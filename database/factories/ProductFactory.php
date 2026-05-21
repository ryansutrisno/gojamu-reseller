<?php

namespace Database\Factories;

use App\Enums\ProductStatus;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'sku' => fake()->unique()->bothify('GJ-???-####'),
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'image' => null,
            'description' => fake()->sentence(12),
            'weight_gram' => fake()->numberBetween(100, 1000),
            'status' => ProductStatus::Active,
            'sort_order' => fake()->numberBetween(1, 50),
            'color_key' => fake()->safeColorName(),
            'color_hex' => fake()->hexColor(),
        ];
    }
}
