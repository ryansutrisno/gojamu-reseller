<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ShipmentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Reseller;
use App\Models\Shipment;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->withoutVite();
});

function fulfillmentPostWithCsrf(string $uri, array $data = []): TestResponse
{
    $token = 'fulfillment-csrf-token';

    return test()->withSession(['_token' => $token])->post($uri, [
        ...$data,
        '_token' => $token,
    ]);
}

/**
 * @return array{user: User, reseller: Reseller, order: Order}
 */
function createFulfillmentOrder(array $attributes = [], array $resellerAttributes = []): array
{
    $user = User::factory()->reseller()->create();
    $reseller = Reseller::factory()->for($user)->create($resellerAttributes);
    $warehouse = Warehouse::factory()->create();

    $subtotal = (int) ($attributes['subtotal'] ?? 250000);
    $shippingCost = (int) ($attributes['shipping_cost'] ?? 0);
    $discountAmount = (int) ($attributes['discount_amount'] ?? 0);

    $order = Order::factory()
        ->for($reseller)
        ->for($warehouse)
        ->create([
            'status' => $attributes['status'] ?? OrderStatus::Paid,
            'payment_status' => $attributes['payment_status'] ?? PaymentStatus::Paid,
            'shipment_status' => $attributes['shipment_status'] ?? ShipmentStatus::Pending,
            'total_qty' => $attributes['total_qty'] ?? 70,
            'price_per_pcs' => $attributes['price_per_pcs'] ?? 50000,
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'discount_amount' => $discountAmount,
            'total_amount' => $attributes['total_amount'] ?? ($subtotal + $shippingCost - $discountAmount),
            'potential_points' => $attributes['potential_points'] ?? 7,
            'earned_points' => $attributes['earned_points'] ?? 0,
            'paid_at' => $attributes['paid_at'] ?? now(),
            'completed_at' => $attributes['completed_at'] ?? null,
            'created_by' => $user->id,
        ]);

    Payment::factory()->for($order)->paid()->create([
        'amount' => $order->total_amount,
    ]);

    return compact('user', 'reseller', 'order');
}

it('lets warehouse users process a paid order for manual fulfillment', function (): void {
    ['reseller' => $reseller, 'order' => $order] = createFulfillmentOrder([
        'shipping_cost' => 15000,
        'total_amount' => 265000,
    ], [
        'name' => 'Ayu Reseller',
        'phone' => '081234567890',
        'address' => 'Jl. Jamu Sehat No. 7',
        'city' => 'Bandung',
        'province' => 'Jawa Barat',
        'postal_code' => '40111',
    ]);
    $warehouseUser = User::factory()->warehouse()->create();

    $this->actingAs($warehouseUser);

    fulfillmentPostWithCsrf(route('admin.orders.process', $order))
        ->assertRedirect();

    $order->refresh();
    $shipment = $order->shipment()->firstOrFail();

    expect($order->status)->toBe(OrderStatus::Processing)
        ->and($order->shipment_status)->toBe(ShipmentStatus::Processing)
        ->and($shipment->status)->toBe(ShipmentStatus::ReadyToShip)
        ->and($shipment->recipient_name)->toBe('Ayu Reseller')
        ->and($shipment->recipient_phone)->toBe('081234567890')
        ->and($shipment->recipient_address)->toBe('Jl. Jamu Sehat No. 7')
        ->and($shipment->recipient_city)->toBe('Bandung')
        ->and($shipment->recipient_province)->toBe('Jawa Barat')
        ->and($shipment->recipient_postal_code)->toBe('40111')
        ->and($shipment->shipping_cost)->toBe(15000)
        ->and($reseller->fresh()->current_points)->toBe(0);
});

it('lets warehouse users ship a processing order with manual courier tracking', function (): void {
    ['order' => $order] = createFulfillmentOrder([
        'status' => OrderStatus::Processing,
        'shipment_status' => ShipmentStatus::Processing,
        'subtotal' => 200000,
        'shipping_cost' => 0,
        'discount_amount' => 10000,
        'total_amount' => 190000,
    ]);
    $warehouseUser = User::factory()->warehouse()->create();

    $this->actingAs($warehouseUser);

    fulfillmentPostWithCsrf(route('admin.orders.ship', $order), [
        'courier' => 'JNE',
        'service' => 'REG',
        'tracking_number' => 'JNE123456789',
        'shipping_cost' => 35000,
    ])->assertRedirect();

    $order->refresh();
    $shipment = $order->shipment()->firstOrFail();

    expect($order->status)->toBe(OrderStatus::Shipped)
        ->and($order->shipment_status)->toBe(ShipmentStatus::Shipped)
        ->and($order->shipping_cost)->toBe(35000)
        ->and($order->total_amount)->toBe(225000)
        ->and($shipment->status)->toBe(ShipmentStatus::Shipped)
        ->and($shipment->courier)->toBe('JNE')
        ->and($shipment->service)->toBe('REG')
        ->and($shipment->tracking_number)->toBe('JNE123456789')
        ->and($shipment->shipping_cost)->toBe(35000)
        ->and($shipment->shipped_at)->not->toBeNull();
});

it('shows shipment tracking details on reseller order detail page', function (): void {
    ['user' => $user, 'order' => $order] = createFulfillmentOrder([
        'status' => OrderStatus::Shipped,
        'shipment_status' => ShipmentStatus::Shipped,
        'shipping_cost' => 28000,
        'total_amount' => 278000,
    ]);

    Shipment::factory()->for($order)->create([
        'status' => ShipmentStatus::Shipped,
        'courier' => 'SiCepat',
        'service' => 'BEST',
        'tracking_number' => 'SICEPAT-987654321',
        'shipping_cost' => 28000,
        'shipped_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('reseller.orders.show', $order))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('reseller/orders/show')
            ->where('order.id', $order->id)
            ->where('order.shipment.status', ShipmentStatus::Shipped->value)
            ->where('order.shipment.status_label', ShipmentStatus::Shipped->label())
            ->where('order.shipment.courier', 'SiCepat')
            ->where('order.shipment.service', 'BEST')
            ->where('order.shipment.tracking_number', 'SICEPAT-987654321')
            ->where('order.shipment.shipping_cost', 28000));
});

it('completes shipped orders and awards reseller points only once', function (): void {
    ['reseller' => $reseller, 'order' => $order] = createFulfillmentOrder([
        'status' => OrderStatus::Shipped,
        'shipment_status' => ShipmentStatus::Shipped,
        'potential_points' => 7,
        'earned_points' => 0,
    ], [
        'current_points' => 5,
    ]);
    Shipment::factory()->for($order)->create([
        'status' => ShipmentStatus::Shipped,
        'shipped_at' => now(),
        'delivered_at' => null,
    ]);
    $warehouseUser = User::factory()->warehouse()->create();

    $this->actingAs($warehouseUser);

    fulfillmentPostWithCsrf(route('admin.orders.complete', $order))
        ->assertRedirect();

    $order->refresh();
    $shipment = $order->shipment()->firstOrFail();

    expect($order->status)->toBe(OrderStatus::Completed)
        ->and($order->shipment_status)->toBe(ShipmentStatus::Delivered)
        ->and($order->earned_points)->toBe(7)
        ->and($order->completed_at)->not->toBeNull()
        ->and($shipment->status)->toBe(ShipmentStatus::Delivered)
        ->and($shipment->delivered_at)->not->toBeNull()
        ->and($reseller->fresh()->current_points)->toBe(12);

    fulfillmentPostWithCsrf(route('admin.orders.complete', $order))
        ->assertRedirect();

    expect($order->refresh()->earned_points)->toBe(7)
        ->and($reseller->fresh()->current_points)->toBe(12);
});
