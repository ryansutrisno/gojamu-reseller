<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PointLedgerType;
use App\Enums\ShipmentStatus;
use App\Models\Order;
use App\Models\PointLedger;
use App\Models\Reseller;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ManualFulfillmentService
{
    /**
     * Mark a paid order as being processed by the warehouse.
     *
     * @throws ValidationException
     */
    public function markProcessing(Order $order): Order
    {
        return DB::transaction(function () use ($order): Order {
            $lockedOrder = $this->lockOrder($order);

            if ($lockedOrder->status !== OrderStatus::Paid) {
                throw ValidationException::withMessages([
                    'order' => 'Hanya order berstatus paid yang bisa mulai diproses gudang.',
                ]);
            }

            $lockedOrder->loadMissing('reseller');

            $lockedOrder->shipment()->updateOrCreate(
                ['order_id' => $lockedOrder->id],
                [
                    ...$this->shipmentSnapshot($lockedOrder),
                    'shipping_cost' => $lockedOrder->shipping_cost,
                    'status' => ShipmentStatus::ReadyToShip,
                ],
            );

            $lockedOrder->forceFill([
                'status' => OrderStatus::Processing,
                'shipment_status' => ShipmentStatus::Processing,
            ])->save();

            return $lockedOrder->refresh()->load('shipment');
        });
    }

    /**
     * Store manual shipment details and mark the order as shipped.
     *
     * @param  array{courier: string, service?: ?string, tracking_number: string, shipping_cost: int|string}  $shipmentData
     *
     * @throws ValidationException
     */
    public function ship(Order $order, array $shipmentData): Order
    {
        return DB::transaction(function () use ($order, $shipmentData): Order {
            $lockedOrder = $this->lockOrder($order);

            if ($lockedOrder->status !== OrderStatus::Processing) {
                throw ValidationException::withMessages([
                    'order' => 'Order harus berstatus processing sebelum bisa dikirim.',
                ]);
            }

            $lockedOrder->loadMissing('reseller');

            $shippingCost = (int) $shipmentData['shipping_cost'];

            $lockedOrder->shipment()->updateOrCreate(
                ['order_id' => $lockedOrder->id],
                [
                    ...$this->shipmentSnapshot($lockedOrder),
                    'courier' => $shipmentData['courier'],
                    'service' => Arr::get($shipmentData, 'service'),
                    'tracking_number' => $shipmentData['tracking_number'],
                    'shipping_cost' => $shippingCost,
                    'status' => ShipmentStatus::Shipped,
                    'shipped_at' => now(),
                ],
            );

            $lockedOrder->forceFill([
                'status' => OrderStatus::Shipped,
                'shipment_status' => ShipmentStatus::Shipped,
                'shipping_cost' => $shippingCost,
                'total_amount' => $lockedOrder->subtotal + $shippingCost - $lockedOrder->discount_amount,
            ])->save();

            return $lockedOrder->refresh()->load('shipment');
        });
    }

    /**
     * Complete a shipped order and award reseller points once.
     *
     * @throws ValidationException
     */
    public function complete(Order $order): Order
    {
        return DB::transaction(function () use ($order): Order {
            $lockedOrder = $this->lockOrder($order);

            if (! in_array($lockedOrder->status, [OrderStatus::Shipped, OrderStatus::Completed], true)) {
                throw ValidationException::withMessages([
                    'order' => 'Order harus berstatus shipped sebelum bisa diselesaikan.',
                ]);
            }

            /** @var Reseller $reseller */
            $reseller = Reseller::query()
                ->whereKey($lockedOrder->reseller_id)
                ->lockForUpdate()
                ->firstOrFail();

            $earnedPoints = $lockedOrder->earned_points;

            if ($earnedPoints === 0 && $lockedOrder->potential_points > 0) {
                $earnedPoints = $lockedOrder->potential_points;
                $balanceBefore = $reseller->current_points;
                $balanceAfter = $balanceBefore + $earnedPoints;

                $reseller->forceFill([
                    'current_points' => $balanceAfter,
                ])->save();

                PointLedger::query()->create([
                    'reseller_id' => $reseller->id,
                    'order_id' => $lockedOrder->id,
                    'type' => PointLedgerType::Credit,
                    'points' => $earnedPoints,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'description' => "Poin dari order {$lockedOrder->invoice_number}",
                ]);
            }

            $lockedOrder->forceFill([
                'status' => OrderStatus::Completed,
                'shipment_status' => ShipmentStatus::Delivered,
                'earned_points' => $earnedPoints,
                'completed_at' => $lockedOrder->completed_at ?? now(),
            ])->save();

            $lockedOrder->loadMissing('shipment');

            $lockedOrder->shipment?->forceFill([
                'status' => ShipmentStatus::Delivered,
                'delivered_at' => $lockedOrder->shipment->delivered_at ?? now(),
            ])->save();

            return $lockedOrder->refresh()->load('shipment');
        }, attempts: 5);
    }

    private function lockOrder(Order $order): Order
    {
        return Order::query()
            ->whereKey($order->id)
            ->lockForUpdate()
            ->firstOrFail();
    }

    /**
     * @return array{recipient_name: string, recipient_phone: string, recipient_address: string, recipient_city: string, recipient_province: string, recipient_postal_code: ?string}
     */
    private function shipmentSnapshot(Order $order): array
    {
        $reseller = $order->reseller;

        return [
            'recipient_name' => $reseller->name,
            'recipient_phone' => $reseller->phone,
            'recipient_address' => $reseller->address,
            'recipient_city' => $reseller->city,
            'recipient_province' => $reseller->province,
            'recipient_postal_code' => $reseller->postal_code,
        ];
    }
}
