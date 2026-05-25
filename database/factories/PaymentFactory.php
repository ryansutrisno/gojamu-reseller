<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'method' => 'manual_transfer',
            'provider' => null,
            'external_payment_id' => null,
            'amount' => fake()->numberBetween(50_000, 2_000_000),
            'status' => PaymentStatus::Pending,
            'paid_at' => null,
            'verified_by' => null,
            'verified_at' => null,
            'rejected_reason' => null,
        ];
    }

    public function waitingVerification(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => PaymentStatus::WaitingVerification,
            'paid_at' => null,
            'verified_by' => null,
            'verified_at' => null,
            'rejected_reason' => null,
        ]);
    }

    public function paid(?User $verifier = null): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => PaymentStatus::Paid,
            'paid_at' => now(),
            'verified_by' => $verifier?->id ?? User::factory(),
            'verified_at' => now(),
            'rejected_reason' => null,
        ]);
    }

    public function rejected(?User $verifier = null): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => PaymentStatus::Rejected,
            'paid_at' => null,
            'verified_by' => $verifier?->id ?? User::factory(),
            'verified_at' => now(),
            'rejected_reason' => fake()->sentence(),
        ]);
    }
}
