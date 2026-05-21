<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\PriceTierStatus;
use App\Enums\ProductStatus;
use App\Enums\ShipmentStatus;
use App\Enums\StockMovementType;
use App\Enums\WarehouseStatus;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\PriceTier;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Reseller;
use App\Models\StockMovement;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->withoutVite();
});

function orderPostWithCsrf(string $uri, array $data = []): TestResponse
{
    $token = 'order-core-csrf-token';

    return test()->withSession(['_token' => $token])->post($uri, [
        ...$data,
        '_token' => $token,
    ]);
}

function seedOrderPriceTiers(): void
{
    foreach ([
        ['name' => 'Tier 1-12 pcs', 'min_qty' => 1, 'max_qty' => 12, 'price_per_pcs' => 55000],
        ['name' => 'Tier 13-50 pcs', 'min_qty' => 13, 'max_qty' => 50, 'price_per_pcs' => 47000],
        ['name' => 'Tier 51-100 pcs', 'min_qty' => 51, 'max_qty' => 100, 'price_per_pcs' => 42000],
        ['name' => 'Tier 101-200 pcs', 'min_qty' => 101, 'max_qty' => 200, 'price_per_pcs' => 37000],
        ['name' => 'Tier 201-300 pcs', 'min_qty' => 201, 'max_qty' => 300, 'price_per_pcs' => 32000],
    ] as $tier) {
        PriceTier::factory()->create([
            ...$tier,
            'status' => PriceTierStatus::Active,
        ]);
    }
}

/**
 * @return array{user: User, reseller: Reseller}
 */
function createResellerUser(): array
{
    $user = User::factory()->reseller()->create();
    $reseller = Reseller::factory()->for($user)->create();

    return compact('user', 'reseller');
}

/**
 * @return array{warehouse: Warehouse, product: Product, variant: ProductVariant, inventory: Inventory}
 */
function createVariantInventory(int $stockAvailable = 100): array
{
    $warehouse = Warehouse::factory()->create();
    $product = Product::factory()->create(['status' => ProductStatus::Active]);
    $variant = ProductVariant::factory()->for($product)->create(['status' => ProductStatus::Active]);
    $inventory = Inventory::factory()->for($warehouse)->for($product)->create([
        'product_variant_id' => $variant->id,
        'stock_available' => $stockAvailable,
        'stock_reserved' => 0,
    ]);

    return compact('warehouse', 'product', 'variant', 'inventory');
}

test('reseller order create page exposes only active catalog items with stock and active tiers', function () {
    ['user' => $user] = createResellerUser();

    $warehouse = Warehouse::factory()->create();
    $activeProduct = Product::factory()->create([
        'name' => 'Jamu Active',
        'status' => ProductStatus::Active,
    ]);
    $activeVariant = ProductVariant::factory()->for($activeProduct)->create([
        'name' => 'Active Variant',
        'sku' => 'ACTIVE-001',
        'status' => ProductStatus::Active,
    ]);

    ProductVariant::factory()->for($activeProduct)->create([
        'status' => ProductStatus::Inactive,
    ]);

    $inactiveProduct = Product::factory()->create(['status' => ProductStatus::Inactive]);
    ProductVariant::factory()->for($inactiveProduct)->create(['status' => ProductStatus::Active]);

    Inventory::factory()->for($warehouse)->for($activeProduct)->create([
        'product_variant_id' => $activeVariant->id,
        'stock_available' => 7,
        'stock_reserved' => 0,
    ]);
    Inventory::factory()->for(Warehouse::factory())->for($activeProduct)->create([
        'product_variant_id' => $activeVariant->id,
        'stock_available' => 8,
        'stock_reserved' => 0,
    ]);

    $activeTier = PriceTier::factory()->create([
        'name' => 'Active Tier',
        'min_qty' => 1,
        'max_qty' => 12,
        'price_per_pcs' => 55000,
        'status' => PriceTierStatus::Active,
    ]);
    PriceTier::factory()->create(['status' => PriceTierStatus::Inactive]);

    $this->actingAs($user)
        ->get(route('reseller.orders.create'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('reseller/orders/create')
            ->has('catalog', 1)
            ->where('catalog.0.id', $activeProduct->id)
            ->where('catalog.0.name', 'Jamu Active')
            ->has('catalog.0.variants', 1)
            ->where('catalog.0.variants.0.id', $activeVariant->id)
            ->where('catalog.0.variants.0.sku', 'ACTIVE-001')
            ->where('catalog.0.variants.0.stock_available', 15)
            ->has('priceTiers', 1)
            ->where('priceTiers.0.id', $activeTier->id));
});

test('reseller can create pending payment order with tier snapshot and stock reservation', function () {
    seedOrderPriceTiers();
    ['user' => $user] = createResellerUser();
    ['warehouse' => $warehouse, 'variant' => $variant, 'inventory' => $inventory] = createVariantInventory(100);

    $this->actingAs($user);

    orderPostWithCsrf(route('reseller.orders.store'), [
        'warehouse_id' => $warehouse->id,
        'reseller_notes' => 'Kirim setelah pembayaran terkonfirmasi.',
        'items' => [
            ['product_variant_id' => $variant->id, 'qty' => 25],
        ],
    ])->assertRedirect();

    $order = Order::query()->with('items')->firstOrFail();

    expect($order->invoice_number)->toStartWith('INV-'.now()->format('Ymd').'-')
        ->and($order->status)->toBe(OrderStatus::PendingPayment)
        ->and($order->payment_status)->toBe(PaymentStatus::Pending)
        ->and($order->shipment_status)->toBe(ShipmentStatus::Pending)
        ->and($order->total_qty)->toBe(25)
        ->and($order->price_per_pcs)->toBe(47000)
        ->and($order->subtotal)->toBe(1175000)
        ->and($order->total_amount)->toBe(1175000)
        ->and($order->potential_points)->toBe(2)
        ->and($order->items)->toHaveCount(1)
        ->and($order->items->first()->price_per_pcs)->toBe(47000)
        ->and($order->items->first()->subtotal)->toBe(1175000);

    expect($inventory->fresh())
        ->stock_available->toBe(75)
        ->stock_reserved->toBe(25);

    $movement = StockMovement::query()->firstOrFail();

    expect($movement->type)->toBe(StockMovementType::OrderReserved)
        ->and($movement->qty)->toBe(25)
        ->and($movement->stock_before)->toBe(100)
        ->and($movement->stock_after)->toBe(75)
        ->and($movement->order_id)->toBe($order->id)
        ->and($movement->order_item_id)->toBe($order->items->first()->id);
});

test('invoice number sequence increments for orders created on the same day', function () {
    seedOrderPriceTiers();
    ['user' => $user] = createResellerUser();
    ['warehouse' => $warehouse, 'variant' => $variant] = createVariantInventory(100);

    $this->actingAs($user);

    foreach ([1, 2] as $sequence) {
        orderPostWithCsrf(route('reseller.orders.store'), [
            'warehouse_id' => $warehouse->id,
            'items' => [
                ['product_variant_id' => $variant->id, 'qty' => 1],
            ],
        ])->assertRedirect();

        $order = Order::query()->latest('id')->firstOrFail();

        expect($order->invoice_number)->toBe('INV-'.now()->format('Ymd').'-'.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT));
    }
});

test('quantity above configured maximum uses highest active tier', function () {
    seedOrderPriceTiers();
    ['user' => $user] = createResellerUser();
    ['warehouse' => $warehouse, 'variant' => $variant] = createVariantInventory(400);

    $this->actingAs($user);

    orderPostWithCsrf(route('reseller.orders.store'), [
        'warehouse_id' => $warehouse->id,
        'items' => [
            ['product_variant_id' => $variant->id, 'qty' => 301],
        ],
    ])->assertRedirect();

    $order = Order::query()->firstOrFail();

    expect($order->price_per_pcs)->toBe(32000)
        ->and($order->total_qty)->toBe(301)
        ->and($order->potential_points)->toBe(30);
});

test('order creation fails when selected stock is insufficient', function () {
    seedOrderPriceTiers();
    ['user' => $user] = createResellerUser();
    ['warehouse' => $warehouse, 'variant' => $variant, 'inventory' => $inventory] = createVariantInventory(5);

    $this->actingAs($user);

    orderPostWithCsrf(route('reseller.orders.store'), [
        'warehouse_id' => $warehouse->id,
        'items' => [
            ['product_variant_id' => $variant->id, 'qty' => 6],
        ],
    ])->assertSessionHasErrors('items');

    expect(Order::query()->count())->toBe(0)
        ->and(StockMovement::query()->count())->toBe(0)
        ->and($inventory->fresh()->stock_available)->toBe(5)
        ->and($inventory->fresh()->stock_reserved)->toBe(0);
});

test('order creation rejects inactive selected products without mutating stock', function () {
    seedOrderPriceTiers();
    ['user' => $user] = createResellerUser();
    ['warehouse' => $warehouse, 'product' => $product, 'variant' => $variant, 'inventory' => $inventory] = createVariantInventory(20);

    $product->update(['status' => ProductStatus::Inactive]);

    $this->actingAs($user);

    orderPostWithCsrf(route('reseller.orders.store'), [
        'warehouse_id' => $warehouse->id,
        'items' => [
            ['product_variant_id' => $variant->id, 'qty' => 5],
        ],
    ])->assertSessionHasErrors('items');

    expect(Order::query()->count())->toBe(0)
        ->and(StockMovement::query()->count())->toBe(0)
        ->and($inventory->fresh()->stock_available)->toBe(20)
        ->and($inventory->fresh()->stock_reserved)->toBe(0);
});

test('order creation fails when no active price tier is available', function () {
    ['user' => $user] = createResellerUser();
    ['warehouse' => $warehouse, 'variant' => $variant, 'inventory' => $inventory] = createVariantInventory(20);

    PriceTier::factory()->create(['status' => PriceTierStatus::Inactive]);

    $this->actingAs($user);

    orderPostWithCsrf(route('reseller.orders.store'), [
        'warehouse_id' => $warehouse->id,
        'items' => [
            ['product_variant_id' => $variant->id, 'qty' => 5],
        ],
    ])->assertSessionHasErrors('items');

    expect(Order::query()->count())->toBe(0)
        ->and(StockMovement::query()->count())->toBe(0)
        ->and($inventory->fresh()->stock_available)->toBe(20)
        ->and($inventory->fresh()->stock_reserved)->toBe(0);
});

test('order creation rejects inactive selected warehouse without mutating stock', function () {
    seedOrderPriceTiers();
    ['user' => $user] = createResellerUser();
    ['warehouse' => $warehouse, 'variant' => $variant, 'inventory' => $inventory] = createVariantInventory(20);

    $warehouse->update(['status' => WarehouseStatus::Inactive]);

    $this->actingAs($user);

    orderPostWithCsrf(route('reseller.orders.store'), [
        'warehouse_id' => $warehouse->id,
        'items' => [
            ['product_variant_id' => $variant->id, 'qty' => 5],
        ],
    ])->assertSessionHasErrors('warehouse_id');

    expect(Order::query()->count())->toBe(0)
        ->and(StockMovement::query()->count())->toBe(0)
        ->and($inventory->fresh()->stock_available)->toBe(20)
        ->and($inventory->fresh()->stock_reserved)->toBe(0);
});

test('order creation rejects duplicate selected variants before reserving stock', function () {
    seedOrderPriceTiers();
    ['user' => $user] = createResellerUser();
    ['warehouse' => $warehouse, 'variant' => $variant, 'inventory' => $inventory] = createVariantInventory(20);

    $this->actingAs($user);

    orderPostWithCsrf(route('reseller.orders.store'), [
        'warehouse_id' => $warehouse->id,
        'items' => [
            ['product_variant_id' => $variant->id, 'qty' => 5],
            ['product_variant_id' => $variant->id, 'qty' => 3],
        ],
    ])->assertSessionHasErrors('items.1.product_variant_id');

    expect(Order::query()->count())->toBe(0)
        ->and(StockMovement::query()->count())->toBe(0)
        ->and($inventory->fresh()->stock_available)->toBe(20)
        ->and($inventory->fresh()->stock_reserved)->toBe(0);
});

test('reseller cannot view another reseller order', function () {
    seedOrderPriceTiers();
    ['user' => $ownerUser] = createResellerUser();
    ['user' => $otherUser] = createResellerUser();
    ['warehouse' => $warehouse, 'variant' => $variant] = createVariantInventory(100);

    $this->actingAs($ownerUser);

    orderPostWithCsrf(route('reseller.orders.store'), [
        'warehouse_id' => $warehouse->id,
        'items' => [
            ['product_variant_id' => $variant->id, 'qty' => 12],
        ],
    ])->assertRedirect();

    $order = Order::query()->firstOrFail();

    $this->actingAs($otherUser)
        ->get(route('reseller.orders.show', $order))
        ->assertForbidden();
});
