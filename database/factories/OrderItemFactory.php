<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $qty = fake()->numberBetween(1, 24);
        $price = fake()->randomElement([55000, 47000, 42000]);

        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_variant_id' => ProductVariant::factory(),
            'product_name' => fake()->words(3, true),
            'variant_name' => fake()->randomElement(['Dus 12 pcs', 'Dus 24 pcs']),
            'sku' => 'GJ-'.fake()->unique()->bothify('??-##'),
            'qty' => $qty,
            'price_per_pcs' => $price,
            'subtotal' => $qty * $price,
            'weight_gram' => fake()->numberBetween(1000, 6000),
        ];
    }
}
