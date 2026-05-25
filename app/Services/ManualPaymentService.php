<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentProofStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentProof;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ManualPaymentService
{
    public function submitProof(Order $order, User $uploader, UploadedFile $proof, ?string $notes = null): PaymentProof
    {
        return DB::transaction(function () use ($order, $uploader, $proof, $notes): PaymentProof {
            $order->refresh();

            abort_unless(in_array($order->payment_status, [PaymentStatus::Pending, PaymentStatus::Rejected], true), 422, 'Pembayaran sedang menunggu verifikasi.');

            $payment = Payment::query()->updateOrCreate(
                ['order_id' => $order->id],
                [
                    'method' => 'manual_transfer',
                    'amount' => $order->total_amount,
                    'status' => PaymentStatus::WaitingVerification,
                    'paid_at' => null,
                    'verified_by' => null,
                    'verified_at' => null,
                    'rejected_reason' => null,
                ]
            );

            $path = $proof->storeAs(
                'payment-proofs/'.$order->id,
                Str::uuid()->toString().'.'.$proof->extension(),
                'local'
            );

            $paymentProof = PaymentProof::query()->create([
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'file_path' => $path,
                'uploaded_by' => $uploader->id,
                'status' => PaymentProofStatus::Submitted,
                'notes' => $notes,
            ]);

            $order->forceFill([
                'payment_status' => PaymentStatus::WaitingVerification,
            ])->save();

            return $paymentProof;
        });
    }

    public function approveProof(Order $order, PaymentProof $paymentProof, User $verifier): void
    {
        DB::transaction(function () use ($order, $paymentProof, $verifier): void {
            $this->ensureProofBelongsToOrder($order, $paymentProof);

            abort_unless($paymentProof->status === PaymentProofStatus::Submitted, 422, 'Bukti bayar sudah diproses.');

            $now = now();

            $paymentProof->forceFill([
                'status' => PaymentProofStatus::Approved,
            ])->save();

            $paymentProof->payment->forceFill([
                'status' => PaymentStatus::Paid,
                'paid_at' => $now,
                'verified_by' => $verifier->id,
                'verified_at' => $now,
                'rejected_reason' => null,
            ])->save();

            $order->forceFill([
                'status' => OrderStatus::Paid,
                'payment_status' => PaymentStatus::Paid,
                'paid_at' => $now,
            ])->save();
        });
    }

    public function rejectProof(Order $order, PaymentProof $paymentProof, User $verifier, string $reason): void
    {
        DB::transaction(function () use ($order, $paymentProof, $verifier, $reason): void {
            $this->ensureProofBelongsToOrder($order, $paymentProof);

            abort_unless($paymentProof->status === PaymentProofStatus::Submitted, 422, 'Bukti bayar sudah diproses.');

            $now = now();

            $paymentProof->forceFill([
                'status' => PaymentProofStatus::Rejected,
            ])->save();

            $paymentProof->payment->forceFill([
                'status' => PaymentStatus::Rejected,
                'paid_at' => null,
                'verified_by' => $verifier->id,
                'verified_at' => $now,
                'rejected_reason' => $reason,
            ])->save();

            $order->forceFill([
                'status' => OrderStatus::PendingPayment,
                'payment_status' => PaymentStatus::Rejected,
                'paid_at' => null,
            ])->save();
        });
    }

    public function proofResponse(PaymentProof $paymentProof): StreamedResponse
    {
        abort_unless(Storage::disk('local')->exists($paymentProof->file_path), 404);

        return response()->streamDownload(function () use ($paymentProof): void {
            $stream = Storage::disk('local')->readStream($paymentProof->file_path);

            if ($stream === false) {
                abort(404);
            }

            fpassthru($stream);
            fclose($stream);
        }, basename($paymentProof->file_path));
    }

    private function ensureProofBelongsToOrder(Order $order, PaymentProof $paymentProof): void
    {
        abort_unless($paymentProof->order_id === $order->id, 404);
    }
}
