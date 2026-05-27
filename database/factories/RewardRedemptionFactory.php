<?php

namespace Database\Factories;

use App\Enums\RewardRedemptionStatus;
use App\Models\Reseller;
use App\Models\Reward;
use App\Models\RewardRedemption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RewardRedemption>
 */
class RewardRedemptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reseller_id' => Reseller::factory(),
            'reward_id' => Reward::factory(),
            'points' => fake()->numberBetween(50, 1000),
            'status' => RewardRedemptionStatus::Requested,
            'admin_notes' => null,
            'rejected_reason' => null,
            'approved_by' => null,
            'processed_by' => null,
            'requested_at' => now(),
            'approved_at' => null,
            'rejected_at' => null,
            'processed_at' => null,
            'completed_at' => null,
            'cancelled_at' => null,
        ];
    }
}
