<?php

namespace Database\Factories;

use App\Enums\RewardStatus;
use App\Models\Reward;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reward>
 */
class RewardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'image' => null,
            'description' => fake()->sentence(10),
            'required_points' => fake()->numberBetween(50, 1000),
            'stock' => fake()->numberBetween(0, 100),
            'status' => RewardStatus::Active,
            'start_date' => null,
            'end_date' => null,
        ];
    }
}
