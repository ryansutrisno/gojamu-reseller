<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ShipmentStatus;
use App\Models\Order;
use App\Models\PriceTier;
use App\Models\Reseller;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $qty = fake()->numberBetween(1, 120);
        $price = fake()->randomElement([55000, 47000, 42000]);

        return [
            'invoice_number' => 'INV-'.now()->format('Ymd').'-'.fake()->unique()->numerify('####'),
            'reseller_id' => Reseller::factory(),
            'warehouse_id' => Warehouse::factory(),
            'status' => OrderStatus::PendingPayment,
            'payment_status' => PaymentStatus::Pending,
            'shipment_status' => ShipmentStatus::Pending,
            'total_qty' => $qty,
            'price_tier_id' => PriceTier::factory(),
            'price_per_pcs' => $price,
            'subtotal' => $qty * $price,
            'shipping_cost' => 0,
            'discount_amount' => 0,
            'total_amount' => $qty * $price,
            'potential_points' => intdiv($qty, 10),
            'earned_points' => 0,
            'point_rule_id' => null,
            'reseller_notes' => null,
            'admin_notes' => null,
            'ordered_at' => now(),
            'paid_at' => null,
            'completed_at' => null,
            'cancelled_at' => null,
            'created_by' => User::factory(),
        ];
    }
}
