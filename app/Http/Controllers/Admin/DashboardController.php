<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ResellerStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Reseller;
use Carbon\CarbonImmutable;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = CarbonImmutable::today();
        $monthStart = $today->startOfMonth()->startOfDay();
        $monthEnd = $today->endOfMonth()->endOfDay();

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                [
                    'helper' => 'Order masuk hari ini',
                    'label' => 'Order hari ini',
                    'tone' => 'gojamu',
                    'value' => (string) Order::query()->whereDate('ordered_at', $today->toDateString())->count(),
                ],
                [
                    'helper' => 'Total order lunas bulan berjalan',
                    'label' => 'Omzet bulan ini',
                    'tone' => 'kunyit',
                    'value' => $this->formatCompactRupiah(
                        (int) Order::query()
                            ->where('payment_status', PaymentStatus::Paid->value)
                            ->whereBetween('paid_at', [$monthStart, $monthEnd])
                            ->sum('total_amount')
                    ),
                ],
                [
                    'helper' => 'Bukti pembayaran menunggu finance',
                    'label' => 'Menunggu verifikasi',
                    'tone' => 'mahakunir',
                    'value' => (string) Payment::query()->where('status', PaymentStatus::WaitingVerification->value)->count(),
                ],
                [
                    'helper' => 'Reseller aktif yang dapat order',
                    'label' => 'Reseller aktif',
                    'tone' => 'nirlawa',
                    'value' => (string) Reseller::query()->where('status', ResellerStatus::Active->value)->count(),
                ],
            ],
            'recentOrders' => Order::query()
                ->with('reseller:id,name')
                ->latest('ordered_at')
                ->limit(5)
                ->get()
                ->map(fn (Order $order): array => [
                    'invoice' => $order->invoice_number,
                    'quantity' => number_format($order->total_qty, 0, ',', '.').' pcs',
                    'reseller' => $order->reseller?->name ?? 'Reseller dihapus',
                    'status' => $order->status->value,
                ]),
            'operationSummary' => [
                [
                    'description' => 'Bukti pembayaran yang perlu dicek tim finance.',
                    'label' => 'Verifikasi pembayaran',
                    'value' => (string) Payment::query()->where('status', PaymentStatus::WaitingVerification->value)->count(),
                ],
                [
                    'description' => 'Order lunas yang siap diproses operasional.',
                    'label' => 'Siap diproses',
                    'value' => (string) Order::query()->where('status', OrderStatus::Paid->value)->count(),
                ],
                [
                    'description' => 'Order yang sudah selesai bulan berjalan.',
                    'label' => 'Selesai bulan ini',
                    'value' => (string) Order::query()
                        ->where('status', OrderStatus::Completed->value)
                        ->whereBetween('completed_at', [$monthStart, $monthEnd])
                        ->count(),
                ],
            ],
        ]);
    }

    private function formatCompactRupiah(int $amount): string
    {
        if ($amount >= 1_000_000) {
            return 'Rp'.number_format($amount / 1_000_000, 1, ',', '.').' jt';
        }

        return 'Rp'.number_format($amount, 0, ',', '.');
    }
}
