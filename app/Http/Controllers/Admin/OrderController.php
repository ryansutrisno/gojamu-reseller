<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
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
        return Inertia::render('admin/orders/show', [
            'order' => $order->load(['reseller', 'warehouse', 'priceTier', 'items']),
        ]);
    }
}
