<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $reseller = $request->user()?->reseller;

        abort_if($reseller === null, 403);

        $recentOrders = $reseller->orders()
            ->latest('ordered_at')
            ->limit(3)
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'invoice_number' => $order->invoice_number,
                'status' => [
                    'label' => $order->status->label(),
                    'value' => $order->status->value,
                ],
                'payment_status' => [
                    'label' => $order->payment_status->label(),
                    'value' => $order->payment_status->value,
                ],
                'total_qty' => $order->total_qty,
                'total_amount' => $order->total_amount,
                'potential_points' => $order->potential_points,
                'ordered_at' => $order->ordered_at?->format('d M Y'),
            ]);

        $latestOrder = $recentOrders->first();
        $nextRewardTarget = max(2_200, (int) ceil(($reseller->current_points + 1) / 2_200) * 2_200);

        return Inertia::render('reseller/dashboard', [
            'reseller' => [
                'name' => $reseller->name,
                'code' => $reseller->reseller_code,
                'city' => $reseller->city,
                'status' => [
                    'label' => $reseller->status->label(),
                    'value' => $reseller->status->value,
                ],
            ],
            'stats' => [
                'orders_count' => $reseller->orders()->count(),
                'current_points' => $reseller->current_points,
                'total_qty_purchased' => $reseller->total_qty_purchased,
                'total_spent' => $reseller->total_spent,
            ],
            'points' => [
                'current' => $reseller->current_points,
                'target' => $nextRewardTarget,
                'progress' => $nextRewardTarget > 0 ? min(100, round(($reseller->current_points / $nextRewardTarget) * 100, 1)) : 0,
            ],
            'recentOrders' => $recentOrders,
            'latestOrder' => $latestOrder,
        ]);
    }
}
