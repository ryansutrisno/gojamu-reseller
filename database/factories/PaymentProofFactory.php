<?php

namespace Database\Factories;

use App\Enums\PaymentProofStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentProof;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentProof>
 */
class PaymentProofFactory extends Factory
{
    public function definition(): array
    {
        return [
            'payment_id' => Payment::factory(),
            'order_id' => Order::factory(),
            'file_path' => 'payment-proofs/'.fake()->uuid().'.pdf',
            'uploaded_by' => User::factory(),
            'status' => PaymentProofStatus::Submitted,
            'notes' => null,
        ];
    }

    public function forPayment(Payment $payment): static
    {
        return $this->state(fn (array $attributes): array => [
            'payment_id' => $payment->id,
            'order_id' => $payment->order_id,
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => PaymentProofStatus::Approved,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => PaymentProofStatus::Rejected,
        ]);
    }
}
