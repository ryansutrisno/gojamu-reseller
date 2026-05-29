<?php

namespace App\Http\Controllers\Reseller;

use App\Enums\OrderStatus;
use App\Enums\ProductStatus;
use App\Enums\RewardStatus;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Reward;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user instanceof User, 403);

        $reseller = $user->reseller()->firstOrFail();

        // Calculate reseller metrics
        $totalOrders = $reseller->orders()->count();
        $activePoints = (int) $reseller->current_points;

        // Sum of total_qty and total_amount for completed orders
        $completedOrdersQuery = $reseller->orders()->where('status', OrderStatus::Completed);
        $totalPcs = (int) $completedOrdersQuery->sum('total_qty');
        $totalSpent = (int) $completedOrdersQuery->sum('total_amount');

        // Next reward progress target
        $nextReward = Reward::query()
            ->where('status', RewardStatus::Active)
            ->where('required_points', '>', $activePoints)
            ->orderBy('required_points', 'asc')
            ->first();

        // If no reward is higher, get the highest required_points reward
        if (! $nextReward) {
            $nextReward = Reward::query()
                ->where('status', RewardStatus::Active)
                ->orderByDesc('required_points')
                ->first();
        }

        $nextRewardData = null;
        if ($nextReward) {
            $nextRewardData = [
                'name' => $nextReward->name,
                'required_points' => (int) $nextReward->required_points,
            ];
        }

        // Active products for quick catalog (max 3)
        $catalogProducts = Product::query()
            ->where('status', ProductStatus::Active)
            ->with(['variants' => function ($query): void {
                $query->where('status', ProductStatus::Active)
                    ->withSum('inventories as stock_available', 'stock_available');
            }])
            ->orderBy('sort_order')
            ->take(3)
            ->get()
            ->map(fn (Product $product): array => [
                'name' => $product->name,
                'color_key' => $product->color_key,
                'color_hex' => $product->color_hex,
                'stock_label' => $this->getStockLabel($product),
            ])->values();

        return Inertia::render('reseller/dashboard', [
            'metrics' => [
                'total_orders' => $totalOrders,
                'active_points' => $activePoints,
                'total_pcs' => $totalPcs,
                'total_spent' => $totalSpent,
            ],
            'next_reward' => $nextRewardData,
            'catalog_products' => $catalogProducts,
        ]);
    }

    private function getStockLabel(Product $product): string
    {
        $totalStock = 0;
        foreach ($product->variants as $variant) {
            $totalStock += (int) ($variant->stock_available ?? 0);
        }

        if ($totalStock === 0) {
            return 'Habis';
        }

        if ($totalStock < 30) {
            return 'Stok terbatas';
        }

        return 'Ready';
    }
}
