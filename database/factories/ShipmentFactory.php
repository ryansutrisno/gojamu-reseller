<?php

namespace Database\Factories;

use App\Enums\ShipmentStatus;
use App\Models\Order;
use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shipment>
 */
class ShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'recipient_name' => fake()->name(),
            'recipient_phone' => fake()->phoneNumber(),
            'recipient_address' => fake()->address(),
            'recipient_city' => fake()->city(),
            'recipient_province' => fake()->state(),
            'recipient_postal_code' => fake()->postcode(),
            'courier' => fake()->randomElement(['JNE', 'J&T', 'SiCepat']),
            'service' => fake()->randomElement(['REG', 'YES', 'ECO']),
            'tracking_number' => strtoupper(fake()->bothify('GOJAMU-########')),
            'shipping_cost' => fake()->numberBetween(10000, 50000),
            'status' => ShipmentStatus::ReadyToShip,
            'provider' => null,
            'external_shipment_id' => null,
            'label_url' => null,
            'shipped_at' => null,
            'delivered_at' => null,
        ];
    }
}
