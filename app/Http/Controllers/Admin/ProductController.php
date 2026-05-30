<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProductStatus;
use App\Enums\StockMovementType;
use App\Enums\WarehouseStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdjustStockRequest;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->with(['variants', 'inventories'])
            ->latest()
            ->take(50)
            ->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'weight_gram' => $product->weight_gram,
                'status' => $product->status->value,
                'status_label' => $product->status->label(),
                'color_key' => $product->color_key,
                'color_hex' => $product->color_hex,
                'sort_order' => $product->sort_order,
                'stock_available' => $product->inventories->sum('stock_available'),
                'stock_reserved' => $product->inventories->sum('stock_reserved'),
                'variants_count' => $product->variants->count(),
                'variants' => $product->variants->map(fn (ProductVariant $variant): array => [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'name' => $variant->name,
                    'stock_available' => $product->inventories
                        ->where('product_variant_id', $variant->id)
                        ->sum('stock_available'),
                ])->values()->all(),
            ])->values();

        return Inertia::render('admin/products/index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/create');
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $product = Product::query()->create([
            'sku' => $validated['sku'],
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'weight_gram' => $validated['weight_gram'],
            'status' => $validated['status'],
            'color_key' => $validated['color_key'] ?? null,
            'color_hex' => $validated['color_hex'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        $variant = ProductVariant::query()->create([
            'product_id' => $product->id,
            'sku' => $validated['sku'].'-DEFAULT',
            'name' => 'Default',
            'weight_gram' => $validated['weight_gram'],
            'status' => ProductStatus::Active,
        ]);

        $warehouse = Warehouse::query()
            ->where('status', WarehouseStatus::Active)
            ->first();

        if ($warehouse) {
            Inventory::query()->create([
                'warehouse_id' => $warehouse->id,
                'product_id' => $product->id,
                'product_variant_id' => $variant->id,
                'stock_available' => 0,
                'stock_reserved' => 0,
            ]);
        }

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(Product $product): Response
    {
        $product->load('variants');

        return Inertia::render('admin/products/edit', [
            'product' => [
                'id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'weight_gram' => $product->weight_gram,
                'status' => $product->status->value,
                'status_label' => $product->status->label(),
                'color_key' => $product->color_key,
                'color_hex' => $product->color_hex,
                'sort_order' => $product->sort_order,
                'variants' => $product->variants->map(fn (ProductVariant $variant): array => [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'name' => $variant->name,
                    'weight_gram' => $variant->weight_gram,
                    'status' => $variant->status->value,
                ])->values(),
            ],
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        $product->update([
            'sku' => $validated['sku'],
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'weight_gram' => $validated['weight_gram'],
            'status' => $validated['status'],
            'color_key' => $validated['color_key'] ?? null,
            'color_hex' => $validated['color_hex'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Produk berhasil dihapus.');
    }

    public function adjustStock(AdjustStockRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $product, $request): void {
            $warehouse = Warehouse::query()
                ->where('status', WarehouseStatus::Active)
                ->firstOrFail();

            $inventory = Inventory::query()
                ->where('product_variant_id', $validated['product_variant_id'])
                ->where('warehouse_id', $warehouse->id)
                ->lockForUpdate()
                ->firstOrFail();

            $stockBefore = $inventory->stock_available;
            $stockAfter = $stockBefore + $validated['adjustment'];

            $inventory->update([
                'stock_available' => $stockAfter,
            ]);

            StockMovement::query()->create([
                'warehouse_id' => $warehouse->id,
                'product_id' => $product->id,
                'product_variant_id' => $validated['product_variant_id'],
                'type' => StockMovementType::StockAdjustment,
                'qty' => $validated['adjustment'],
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'notes' => $validated['notes'],
                'created_by' => $request->user()->id,
            ]);
        });

        return back()->with('success', 'Stok berhasil disesuaikan.');
    }
}
