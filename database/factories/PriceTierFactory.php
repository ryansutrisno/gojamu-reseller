<?php

namespace Database\Factories;

use App\Enums\PriceTierStatus;
use App\Models\PriceTier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PriceTier>
 */
class PriceTierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $minQty = fake()->randomElement([1, 12, 24, 48, 96]);

        return [
            'name' => 'Tier '.$minQty.' pcs',
            'min_qty' => $minQty,
            'max_qty' => null,
            'price_per_pcs' => fake()->numberBetween(15000, 25000),
            'status' => PriceTierStatus::Active,
            'starts_at' => null,
            'ends_at' => null,
        ];
    }
}
