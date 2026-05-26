<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentProofStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShipOrderRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentProof;
use App\Models\Shipment;
use App\Services\ManualFulfillmentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->with('reseller:id,name,reseller_code')
            ->latest()
            ->take(50)
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'invoice_number' => $order->invoice_number,
                'reseller_name' => $order->reseller->name,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'payment_status' => $order->payment_status->value,
                'shipment_status' => $order->shipment_status->value,
                'total_qty' => $order->total_qty,
                'total_amount' => $order->total_amount,
                'ordered_at' => $order->ordered_at?->toISOString(),
            ])->values();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['reseller', 'warehouse', 'priceTier', 'items', 'shipment', 'payment.proofs.uploader', 'payment.verifier']);

        return Inertia::render('admin/orders/show', [
            'order' => $this->orderDetail($order),
        ]);
    }

    public function process(Order $order, ManualFulfillmentService $fulfillment): RedirectResponse
    {
        $fulfillment->markProcessing($order);

        return back()->with('success', 'Pesanan mulai diproses gudang.');
    }

    public function ship(ShipOrderRequest $request, Order $order, ManualFulfillmentService $fulfillment): RedirectResponse
    {
        $fulfillment->ship($order, $request->validated());

        return back()->with('success', 'Nomor resi pengiriman berhasil disimpan.');
    }

    public function complete(Order $order, ManualFulfillmentService $fulfillment): RedirectResponse
    {
        $fulfillment->complete($order);

        return back()->with('success', 'Pesanan diselesaikan dan poin reseller diperbarui.');
    }

    /**
     * @return array<string, mixed>
     */
    private function orderDetail(Order $order): array
    {
        $payment = $order->payment;
        $proofs = $payment?->proofs->sortByDesc('created_at')->values() ?? collect();
        $latestProof = $proofs->first();

        return [
            'id' => $order->id,
            'invoice_number' => $order->invoice_number,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'payment_status' => $order->payment_status->value,
            'shipment_status' => $order->shipment_status->value,
            'total_qty' => $order->total_qty,
            'price_per_pcs' => $order->price_per_pcs,
            'subtotal' => $order->subtotal,
            'shipping_cost' => $order->shipping_cost,
            'discount_amount' => $order->discount_amount,
            'total_amount' => $order->total_amount,
            'potential_points' => $order->potential_points,
            'earned_points' => $order->earned_points,
            'reseller_notes' => $order->reseller_notes,
            'ordered_at' => $order->ordered_at?->toISOString(),
            'completed_at' => $order->completed_at?->toISOString(),
            'reseller' => $order->reseller ? [
                'id' => $order->reseller->id,
                'name' => $order->reseller->name,
                'reseller_code' => $order->reseller->reseller_code,
            ] : null,
            'warehouse' => $order->warehouse ? [
                'id' => $order->warehouse->id,
                'name' => $order->warehouse->name,
                'code' => $order->warehouse->code,
            ] : null,
            'price_tier' => $order->priceTier ? [
                'id' => $order->priceTier->id,
                'name' => $order->priceTier->name,
            ] : null,
            'items' => $order->items->map(fn ($item): array => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'variant_name' => $item->variant_name,
                'sku' => $item->sku,
                'qty' => $item->qty,
                'price_per_pcs' => $item->price_per_pcs,
                'subtotal' => $item->subtotal,
            ])->values(),
            'payment' => $this->paymentDetail($payment),
            'payment_proofs' => $proofs->map(fn (PaymentProof $proof): array => $this->paymentProofDetail($order, $proof))->values(),
            'latest_payment_proof' => $latestProof instanceof PaymentProof ? $this->paymentProofDetail($order, $latestProof) : null,
            'shipment' => $this->shipmentDetail($order->shipment),
            'fulfillment_actions' => [
                'can_process' => $order->status === OrderStatus::Paid,
                'can_ship' => $order->status === OrderStatus::Processing,
                'can_complete' => $order->status === OrderStatus::Shipped,
            ],
        ];
    }

    /**
     * @return array{id: int, status: string, status_label: string, recipient_name: string, recipient_phone: string, recipient_address: string, recipient_city: string, recipient_province: string, recipient_postal_code: ?string, courier: ?string, service: ?string, tracking_number: ?string, shipping_cost: int, provider: ?string, label_url: ?string, shipped_at: ?string, delivered_at: ?string}|null
     */
    private function shipmentDetail(?Shipment $shipment): ?array
    {
        if (! $shipment) {
            return null;
        }

        return [
            'id' => $shipment->id,
            'status' => $shipment->status->value,
            'status_label' => $shipment->status->label(),
            'recipient_name' => $shipment->recipient_name,
            'recipient_phone' => $shipment->recipient_phone,
            'recipient_address' => $shipment->recipient_address,
            'recipient_city' => $shipment->recipient_city,
            'recipient_province' => $shipment->recipient_province,
            'recipient_postal_code' => $shipment->recipient_postal_code,
            'courier' => $shipment->courier,
            'service' => $shipment->service,
            'tracking_number' => $shipment->tracking_number,
            'shipping_cost' => $shipment->shipping_cost,
            'provider' => $shipment->provider,
            'label_url' => $shipment->label_url,
            'shipped_at' => $shipment->shipped_at?->toISOString(),
            'delivered_at' => $shipment->delivered_at?->toISOString(),
        ];
    }

    /**
     * @return array{id: int, method: string, amount: int, status: string, status_label: string, paid_at: ?string, verified_at: ?string, rejected_reason: ?string, verifier_name: ?string}|null
     */
    private function paymentDetail(?Payment $payment): ?array
    {
        if (! $payment) {
            return null;
        }

        return [
            'id' => $payment->id,
            'method' => $payment->method,
            'amount' => $payment->amount,
            'status' => $payment->status->value,
            'status_label' => $payment->status->label(),
            'paid_at' => $payment->paid_at?->toISOString(),
            'verified_at' => $payment->verified_at?->toISOString(),
            'rejected_reason' => $payment->rejected_reason,
            'verifier_name' => $payment->verifier?->name,
        ];
    }

    /**
     * @return array{id: int, status: string, status_label: string, notes: ?string, uploaded_at: ?string, uploader_name: ?string, view_url: string, can_approve: bool, can_reject: bool}
     */
    private function paymentProofDetail(Order $order, PaymentProof $proof): array
    {
        $isSubmitted = $proof->status === PaymentProofStatus::Submitted;

        return [
            'id' => $proof->id,
            'status' => $proof->status->value,
            'status_label' => $proof->status->label(),
            'notes' => $proof->notes,
            'uploaded_at' => $proof->created_at?->toISOString(),
            'uploader_name' => $proof->uploader?->name,
            'view_url' => route('admin.orders.payment-proofs.show', [$order, $proof]),
            'can_approve' => $isSubmitted,
            'can_reject' => $isSubmitted,
        ];
    }
}
