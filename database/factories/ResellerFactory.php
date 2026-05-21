<?php

namespace Database\Factories;

use App\Enums\ResellerStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Reseller;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reseller>
 */
class ResellerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state([
                'role' => UserRole::Reseller,
                'status' => UserStatus::Active,
            ]),
            'reseller_code' => fake()->unique()->bothify('RS-#####'),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'status' => ResellerStatus::Active,
            'joined_at' => fake()->dateTimeBetween('-1 year'),
            'total_qty_purchased' => 0,
            'total_spent' => 0,
            'current_points' => 0,
            'internal_notes' => null,
        ];
    }
}
