<?php

namespace Database\Factories;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'sku' => fake()->unique()->bothify('GJ-VAR-####'),
            'name' => fake()->randomElement(['Paket 6 pcs', 'Paket 12 pcs', 'Paket 24 pcs']),
            'weight_gram' => fake()->numberBetween(600, 2400),
            'image' => null,
            'status' => ProductStatus::Active,
        ];
    }
}
