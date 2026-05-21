<?php

namespace App\Http\Controllers\Reseller;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\PriceTierStatus;
use App\Enums\ProductStatus;
use App\Enums\ShipmentStatus;
use App\Enums\StockMovementType;
use App\Enums\WarehouseStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\PriceTier;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $reseller = request()->user()->reseller()->firstOrFail();

        $orders = $reseller->orders()
            ->latest()
            ->withCount('items')
            ->take(25)
            ->get()
            ->map(fn (Order $order): array => $this->orderSummary($order))
            ->values();

        return Inertia::render('reseller/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function create(): Response
    {
        $catalog = Product::query()
            ->where('status', ProductStatus::Active)
            ->with(['variants' => function ($query): void {
                $query->where('status', ProductStatus::Active)
                    ->withSum('inventories as stock_available', 'stock_available');
            }])
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'color_key' => $product->color_key,
                'color_hex' => $product->color_hex,
                'variants' => $product->variants->map(fn (ProductVariant $variant): array => [
                    'id' => $variant->id,
                    'name' => $variant->name,
                    'sku' => $variant->sku,
                    'weight_gram' => $variant->weight_gram,
                    'stock_available' => (int) ($variant->stock_available ?? 0),
                ])->values(),
            ])->values();

        return Inertia::render('reseller/orders/create', [
            'catalog' => $catalog,
            'priceTiers' => PriceTier::query()
                ->where('status', PriceTierStatus::Active)
                ->orderBy('min_qty')
                ->get(['id', 'name', 'min_qty', 'max_qty', 'price_per_pcs']),
        ]);
    }

    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();
        $reseller = $user->reseller()->firstOrFail();

        $order = DB::transaction(function () use ($validated, $user, $reseller): Order {
            $items = collect($validated['items']);
            $totalQty = (int) $items->sum('qty');
            $warehouse = $this->resolveWarehouse($validated['warehouse_id'] ?? null);
            $priceTier = $this->resolvePriceTier($totalQty);
            $pricePerPcs = (int) $priceTier->price_per_pcs;
            $subtotal = $totalQty * $pricePerPcs;

            $order = Order::query()->create([
                'invoice_number' => $this->nextInvoiceNumber(),
                'reseller_id' => $reseller->id,
                'warehouse_id' => $warehouse->id,
                'status' => OrderStatus::PendingPayment,
                'payment_status' => PaymentStatus::Pending,
                'shipment_status' => ShipmentStatus::Pending,
                'total_qty' => $totalQty,
                'price_tier_id' => $priceTier->id,
                'price_per_pcs' => $pricePerPcs,
                'subtotal' => $subtotal,
                'shipping_cost' => 0,
                'discount_amount' => 0,
                'total_amount' => $subtotal,
                'potential_points' => intdiv($totalQty, 10),
                'earned_points' => 0,
                'point_rule_id' => null,
                'reseller_notes' => $validated['reseller_notes'] ?? null,
                'ordered_at' => now(),
                'created_by' => $user->id,
            ]);

            $variants = ProductVariant::query()
                ->with('product')
                ->whereIn('id', $items->pluck('product_variant_id'))
                ->get()
                ->keyBy('id');

            foreach ($items as $item) {
                $variant = $variants->get($item['product_variant_id']);

                if (! $variant || $variant->status !== ProductStatus::Active || $variant->product->status !== ProductStatus::Active) {
                    throw ValidationException::withMessages([
                        'items' => 'Produk yang dipilih tidak aktif.',
                    ]);
                }

                $inventory = Inventory::query()
                    ->where('warehouse_id', $warehouse->id)
                    ->where('product_id', $variant->product_id)
                    ->where('product_variant_id', $variant->id)
                    ->lockForUpdate()
                    ->first();

                $qty = (int) $item['qty'];

                if (! $inventory || $inventory->stock_available < $qty) {
                    throw ValidationException::withMessages([
                        'items' => "Stok {$variant->sku} tidak mencukupi.",
                    ]);
                }

                $stockBefore = $inventory->stock_available;

                $orderItem = $order->items()->create([
                    'product_id' => $variant->product_id,
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_name' => $variant->name,
                    'sku' => $variant->sku,
                    'qty' => $qty,
                    'price_per_pcs' => $pricePerPcs,
                    'subtotal' => $qty * $pricePerPcs,
                    'weight_gram' => $variant->weight_gram,
                ]);

                $inventory->update([
                    'stock_available' => $stockBefore - $qty,
                    'stock_reserved' => $inventory->stock_reserved + $qty,
                ]);

                StockMovement::query()->create([
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $variant->product_id,
                    'product_variant_id' => $variant->id,
                    'order_id' => $order->id,
                    'order_item_id' => $orderItem->id,
                    'type' => StockMovementType::OrderReserved,
                    'qty' => $qty,
                    'stock_before' => $stockBefore,
                    'stock_after' => $stockBefore - $qty,
                    'notes' => "Reservasi stok untuk {$order->invoice_number}.",
                    'created_by' => $user->id,
                ]);
            }

            return $order;
        }, 3);

        return redirect()
            ->route('reseller.orders.show', $order)
            ->with('success', 'Order berhasil dibuat dan stok sudah direservasi.');
    }

    public function show(Order $order): Response
    {
        $reseller = request()->user()->reseller()->firstOrFail();

        abort_unless($order->reseller_id === $reseller->id, 403);

        return Inertia::render('reseller/orders/show', [
            'order' => $this->orderDetail($order->load(['items', 'warehouse', 'priceTier'])),
        ]);
    }

    private function resolveWarehouse(?int $warehouseId): Warehouse
    {
        $query = Warehouse::query()->where('status', WarehouseStatus::Active);

        if ($warehouseId !== null) {
            $query->whereKey($warehouseId);
        }

        $warehouse = $query->lockForUpdate()->first();

        if (! $warehouse) {
            throw ValidationException::withMessages([
                'warehouse_id' => 'Gudang aktif tidak tersedia.',
            ]);
        }

        return $warehouse;
    }

    private function resolvePriceTier(int $totalQty): PriceTier
    {
        $priceTier = PriceTier::query()
            ->where('status', PriceTierStatus::Active)
            ->where('min_qty', '<=', $totalQty)
            ->where(function ($query) use ($totalQty): void {
                $query->whereNull('max_qty')->orWhere('max_qty', '>=', $totalQty);
            })
            ->orderByDesc('min_qty')
            ->lockForUpdate()
            ->first();

        $priceTier ??= PriceTier::query()
            ->where('status', PriceTierStatus::Active)
            ->where('min_qty', '<=', $totalQty)
            ->orderByDesc('min_qty')
            ->lockForUpdate()
            ->first();

        if (! $priceTier) {
            throw ValidationException::withMessages([
                'items' => 'Tier harga aktif belum tersedia.',
            ]);
        }

        return $priceTier;
    }

    private function nextInvoiceNumber(): string
    {
        $prefix = 'INV-'.now()->format('Ymd').'-';
        $latest = Order::query()
            ->where('invoice_number', 'like', $prefix.'%')
            ->orderByDesc('invoice_number')
            ->lockForUpdate()
            ->value('invoice_number');

        $sequence = $latest ? ((int) str($latest)->afterLast('-')->toString()) + 1 : 1;

        return $prefix.str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
    }

    /**
     * @return array<string, mixed>
     */
    private function orderSummary(Order $order): array
    {
        return [
            'id' => $order->id,
            'invoice_number' => $order->invoice_number,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'payment_status' => $order->payment_status->value,
            'shipment_status' => $order->shipment_status->value,
            'total_qty' => $order->total_qty,
            'total_amount' => $order->total_amount,
            'potential_points' => $order->potential_points,
            'ordered_at' => $order->ordered_at?->toISOString(),
            'items_count' => $order->items_count ?? $order->items()->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function orderDetail(Order $order): array
    {
        return [
            ...$this->orderSummary($order),
            'price_per_pcs' => $order->price_per_pcs,
            'subtotal' => $order->subtotal,
            'shipping_cost' => $order->shipping_cost,
            'discount_amount' => $order->discount_amount,
            'reseller_notes' => $order->reseller_notes,
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
                'weight_gram' => $item->weight_gram,
            ])->values(),
        ];
    }
}
