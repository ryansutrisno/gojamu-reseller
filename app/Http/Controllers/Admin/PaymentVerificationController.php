<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RejectPaymentProofRequest;
use App\Models\Order;
use App\Models\PaymentProof;
use App\Models\User;
use App\Services\ManualPaymentService;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PaymentVerificationController extends Controller
{
    public function show(Order $order, PaymentProof $paymentProof, ManualPaymentService $manualPaymentService): StreamedResponse
    {
        abort_unless($paymentProof->order_id === $order->id, 404);

        return $manualPaymentService->proofResponse($paymentProof);
    }

    public function approve(Order $order, PaymentProof $paymentProof, ManualPaymentService $manualPaymentService): RedirectResponse
    {
        $user = auth()->user();

        abort_unless($user instanceof User, 403);

        $manualPaymentService->approveProof($order, $paymentProof->load('payment'), $user);

        return back()->with('success', 'Pembayaran disetujui. Order masuk status paid.');
    }

    public function reject(Order $order, PaymentProof $paymentProof, RejectPaymentProofRequest $request, ManualPaymentService $manualPaymentService): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user instanceof User, 403);

        $validated = $request->validated();

        $manualPaymentService->rejectProof($order, $paymentProof->load('payment'), $user, $validated['reason']);

        return back()->with('success', 'Bukti bayar ditolak. Reseller bisa upload ulang.');
    }
}
