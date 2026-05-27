<?php

namespace Database\Factories;

use App\Enums\PointLedgerType;
use App\Models\PointLedger;
use App\Models\Reseller;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PointLedger>
 */
class PointLedgerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $points = fake()->numberBetween(10, 500);

        return [
            'reseller_id' => Reseller::factory(),
            'order_id' => null,
            'reward_redemption_id' => null,
            'type' => PointLedgerType::Credit,
            'points' => $points,
            'balance_before' => 0,
            'balance_after' => $points,
            'description' => fake()->sentence(),
        ];
    }
}
