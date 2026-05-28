<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $this->filters($request);
        $query = $this->reportQuery($filters);

        return Inertia::render('admin/reports/index', [
            'filters' => $filters,
            'summary' => [
                'orders_count' => (clone $query)->count(),
                'total_qty' => (int) (clone $query)->sum('total_qty'),
                'total_amount' => (int) (clone $query)->sum('total_amount'),
                'potential_points' => (int) (clone $query)->sum('potential_points'),
            ],
            'orders' => (clone $query)
                ->latest('ordered_at')
                ->limit(100)
                ->get()
                ->map(fn (Order $order): array => $this->row($order)),
            'statusOptions' => collect(OrderStatus::cases())->map(fn (OrderStatus $status): array => [
                'label' => $status->label(),
                'value' => $status->value,
            ]),
            'paymentStatusOptions' => collect(PaymentStatus::cases())->map(fn (PaymentStatus $status): array => [
                'label' => $status->label(),
                'value' => $status->value,
            ]),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $filters = $this->filters($request);
        $orders = $this->reportQuery($filters)->latest('ordered_at')->get();
        $filename = 'laporan-order-'.$filters['start_date'].'-'.$filters['end_date'].'.csv';

        return response()->streamDownload(function () use ($orders): void {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Invoice',
                'Reseller',
                'Kode Reseller',
                'Status Order',
                'Status Pembayaran',
                'Total Qty',
                'Total Amount',
                'Potential Points',
                'Tanggal Order',
            ]);

            foreach ($orders as $order) {
                fputcsv($handle, [
                    $order->invoice_number,
                    $order->reseller?->name ?? 'Reseller dihapus',
                    $order->reseller?->reseller_code ?? '-',
                    $order->status->label(),
                    $order->payment_status->label(),
                    $order->total_qty,
                    $order->total_amount,
                    $order->potential_points,
                    $order->ordered_at?->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * @return array{start_date: string, end_date: string, status: string, payment_status: string}
     */
    private function filters(Request $request): array
    {
        $today = CarbonImmutable::today();

        return [
            'start_date' => $request->date('start_date')?->format('Y-m-d') ?? $today->startOfMonth()->format('Y-m-d'),
            'end_date' => $request->date('end_date')?->format('Y-m-d') ?? $today->format('Y-m-d'),
            'status' => $this->validEnumValue($request->string('status')->toString(), OrderStatus::cases()),
            'payment_status' => $this->validEnumValue($request->string('payment_status')->toString(), PaymentStatus::cases()),
        ];
    }

    /**
     * @param  array{start_date: string, end_date: string, status: string, payment_status: string}  $filters
     * @return Builder<Order>
     */
    private function reportQuery(array $filters): Builder
    {
        return Order::query()
            ->with('reseller:id,name,reseller_code')
            ->whereDate('ordered_at', '>=', $filters['start_date'])
            ->whereDate('ordered_at', '<=', $filters['end_date'])
            ->when($filters['status'] !== 'all', fn (Builder $query): Builder => $query->where('status', $filters['status']))
            ->when($filters['payment_status'] !== 'all', fn (Builder $query): Builder => $query->where('payment_status', $filters['payment_status']));
    }

    /**
     * @return array{id: int, invoice_number: string, reseller_name: string, reseller_code: string, status: array{label: string, value: string}, payment_status: array{label: string, value: string}, total_qty: int, total_amount: int, potential_points: int, ordered_at: ?string}
     */
    private function row(Order $order): array
    {
        return [
            'id' => $order->id,
            'invoice_number' => $order->invoice_number,
            'reseller_name' => $order->reseller?->name ?? 'Reseller dihapus',
            'reseller_code' => $order->reseller?->reseller_code ?? '-',
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
            'ordered_at' => $order->ordered_at?->format('d M Y H:i'),
        ];
    }

    /**
     * @param  array<int, \BackedEnum>  $cases
     */
    private function validEnumValue(string $value, array $cases): string
    {
        $values = collect($cases)->map(fn (\BackedEnum $case): string => (string) $case->value);

        return $values->contains($value) ? $value : 'all';
    }
}
