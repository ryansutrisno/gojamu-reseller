<?php

namespace Database\Factories;

use App\Enums\StockMovementType;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockMovement>
 */
class StockMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $qty = fake()->numberBetween(1, 100);
        $stockBefore = fake()->numberBetween(0, 300);

        return [
            'warehouse_id' => Warehouse::factory(),
            'product_id' => Product::factory(),
            'product_variant_id' => null,
            'order_id' => null,
            'order_item_id' => null,
            'type' => StockMovementType::InitialStock,
            'qty' => $qty,
            'stock_before' => $stockBefore,
            'stock_after' => $stockBefore + $qty,
            'notes' => fake()->sentence(),
            'created_by' => User::factory(),
        ];
    }
}
