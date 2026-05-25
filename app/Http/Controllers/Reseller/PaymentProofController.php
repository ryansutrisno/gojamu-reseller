<?php

namespace App\Http\Controllers\Reseller;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadPaymentProofRequest;
use App\Models\Order;
use App\Models\User;
use App\Services\ManualPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;

class PaymentProofController extends Controller
{
    public function store(UploadPaymentProofRequest $request, Order $order, ManualPaymentService $manualPaymentService): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user instanceof User, 403);

        $reseller = $user->reseller;

        abort_unless($reseller !== null && $order->reseller_id === $reseller->id, 403);
        abort_unless(in_array($order->payment_status, [PaymentStatus::Pending, PaymentStatus::Rejected], true), 422, 'Pembayaran sedang menunggu verifikasi.');

        $validated = $request->validated();
        $proof = $request->file('proof');

        abort_unless($proof instanceof UploadedFile, 422, 'Bukti bayar wajib diunggah.');

        $manualPaymentService->submitProof(
            order: $order,
            uploader: $user,
            proof: $proof,
            notes: $validated['notes'] ?? null,
        );

        return back()->with('success', 'Bukti bayar berhasil diunggah. Tim finance akan memverifikasi pembayaran.');
    }
}
