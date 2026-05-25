<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentProofStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentProof;
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
        $order->load(['reseller', 'warehouse', 'priceTier', 'items', 'payment.proofs.uploader', 'payment.verifier']);

        return Inertia::render('admin/orders/show', [
            'order' => $this->orderDetail($order),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function orderDetail(Order $order): array
    {
        $payment = $order->payment;
        $proofs = $payment?->proofs->sortByDesc('created_at')->values() ?? collect();
        $latestProof = $proofs->first();

        return [
            'id' => $order->id,
            'invoice_number' => $order->invoice_number,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'payment_status' => $order->payment_status->value,
            'shipment_status' => $order->shipment_status->value,
            'total_qty' => $order->total_qty,
            'price_per_pcs' => $order->price_per_pcs,
            'subtotal' => $order->subtotal,
            'shipping_cost' => $order->shipping_cost,
            'discount_amount' => $order->discount_amount,
            'total_amount' => $order->total_amount,
            'potential_points' => $order->potential_points,
            'reseller_notes' => $order->reseller_notes,
            'ordered_at' => $order->ordered_at?->toISOString(),
            'reseller' => $order->reseller ? [
                'id' => $order->reseller->id,
                'name' => $order->reseller->name,
                'reseller_code' => $order->reseller->reseller_code,
            ] : null,
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
            ])->values(),
            'payment' => $this->paymentDetail($payment),
            'payment_proofs' => $proofs->map(fn (PaymentProof $proof): array => $this->paymentProofDetail($order, $proof))->values(),
            'latest_payment_proof' => $latestProof instanceof PaymentProof ? $this->paymentProofDetail($order, $latestProof) : null,
        ];
    }

    /**
     * @return array{id: int, method: string, amount: int, status: string, status_label: string, paid_at: ?string, verified_at: ?string, rejected_reason: ?string, verifier_name: ?string}|null
     */
    private function paymentDetail(?Payment $payment): ?array
    {
        if (! $payment) {
            return null;
        }

        return [
            'id' => $payment->id,
            'method' => $payment->method,
            'amount' => $payment->amount,
            'status' => $payment->status->value,
            'status_label' => $payment->status->label(),
            'paid_at' => $payment->paid_at?->toISOString(),
            'verified_at' => $payment->verified_at?->toISOString(),
            'rejected_reason' => $payment->rejected_reason,
            'verifier_name' => $payment->verifier?->name,
        ];
    }

    /**
     * @return array{id: int, status: string, status_label: string, notes: ?string, uploaded_at: ?string, uploader_name: ?string, view_url: string, can_approve: bool, can_reject: bool}
     */
    private function paymentProofDetail(Order $order, PaymentProof $proof): array
    {
        $isSubmitted = $proof->status === PaymentProofStatus::Submitted;

        return [
            'id' => $proof->id,
            'status' => $proof->status->value,
            'status_label' => $proof->status->label(),
            'notes' => $proof->notes,
            'uploaded_at' => $proof->created_at?->toISOString(),
            'uploader_name' => $proof->uploader?->name,
            'view_url' => route('admin.orders.payment-proofs.show', [$order, $proof]),
            'can_approve' => $isSubmitted,
            'can_reject' => $isSubmitted,
        ];
    }
}
