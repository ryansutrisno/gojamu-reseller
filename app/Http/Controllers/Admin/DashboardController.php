<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\ProductStatus;
use App\Enums\ResellerStatus;
use App\Enums\RewardRedemptionStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Reseller;
use App\Models\RewardRedemption;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        // 1. Order hari ini
        $yesterdayCount = Order::whereDate('created_at', today()->subDay())->count();
        $todayCount = Order::whereDate('created_at', today())->count();
        $orderDiff = $todayCount - $yesterdayCount;
        $orderTodayHelper = ($orderDiff >= 0 ? '+' : '').$orderDiff.' dari kemarin';

        // 2. Omzet bulan ini
        $omzet = Order::where('status', '!=', OrderStatus::Cancelled)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_amount');
        $omzetValue = number_format($omzet / 1000000, 1, ',', '.').' jt';

        $lastMonthOmzet = Order::where('status', '!=', OrderStatus::Cancelled)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('total_amount');

        if ($lastMonthOmzet > 0) {
            $percentage = (($omzet - $lastMonthOmzet) / $lastMonthOmzet) * 100;
            $omzetHelper = ($percentage >= 0 ? '↑ ' : '↓ ').number_format(abs($percentage), 0).'% dari bulan lalu';
        } else {
            $omzetHelper = 'Bulan lalu: Rp 0';
        }

        // 3. Pending payment
        $pendingPaymentCount = Order::where('status', OrderStatus::PendingPayment)->count();

        // 4. Redeem pending
        $redeemPendingCount = RewardRedemption::where('status', RewardRedemptionStatus::Requested)->count();

        // 5. Recent orders
        $recentOrders = Order::query()
            ->latest()
            ->with('reseller')
            ->take(5)
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'invoice' => $order->invoice_number,
                'reseller' => $order->reseller?->name ?? 'Guest',
                'quantity' => $order->total_qty.' pcs',
                'status' => $order->status->value,
            ])->values();

        // 6. Stock items
        $products = Product::query()
            ->where('status', ProductStatus::Active)
            ->with(['variants' => function ($query): void {
                $query->where('status', ProductStatus::Active)
                    ->withSum('inventories as stock_available', 'stock_available');
            }])
            ->get();

        $stockItems = $products->map(function (Product $product): array {
            $totalStock = 0;
            foreach ($product->variants as $variant) {
                $totalStock += (int) ($variant->stock_available ?? 0);
            }

            $tone = 'gojamu';
            if ($product->color_key === 'amber') {
                $tone = 'kunyit';
            } elseif ($product->color_key === 'orange') {
                $tone = 'nirlawa';
            } elseif ($product->color_key === 'red') {
                $tone = 'mahakunir';
            }

            return [
                'name' => $product->name,
                'stock' => $totalStock.' pcs'.($totalStock < 30 ? ' ⚠' : ''),
                'percent' => (int) min(100, max(0, ($totalStock / 400) * 100)),
                'tone' => $tone,
            ];
        })->values();

        // 7. Top Resellers
        $topResellers = Reseller::query()
            ->where('status', ResellerStatus::Active)
            ->orderByDesc('current_points')
            ->take(4)
            ->get()
            ->map(function (Reseller $reseller): array {
                $initials = collect(explode(' ', $reseller->name))
                    ->map(fn ($word) => str($word)->substr(0, 1)->upper())
                    ->take(2)
                    ->join('');

                return [
                    'initials' => $initials ?: 'RS',
                    'name' => $reseller->name,
                    'points' => $reseller->current_points.' pt',
                ];
            })->values();

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'orders_today' => [
                    'value' => (string) $todayCount,
                    'helper' => $orderTodayHelper,
                ],
                'omzet_month' => [
                    'value' => $omzetValue,
                    'helper' => $omzetHelper,
                ],
                'pending_payment' => [
                    'value' => (string) $pendingPaymentCount,
                    'helper' => 'Menunggu verifikasi',
                ],
                'redeem_pending' => [
                    'value' => (string) $redeemPendingCount,
                    'helper' => 'Perlu diproses admin',
                ],
            ],
            'recent_orders' => $recentOrders,
            'stock_items' => $stockItems,
            'top_resellers' => $topResellers,
        ]);
    }
}
