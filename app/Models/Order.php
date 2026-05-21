<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ShipmentStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'invoice_number',
    'reseller_id',
    'warehouse_id',
    'status',
    'payment_status',
    'shipment_status',
    'total_qty',
    'price_tier_id',
    'price_per_pcs',
    'subtotal',
    'shipping_cost',
    'discount_amount',
    'total_amount',
    'potential_points',
    'earned_points',
    'point_rule_id',
    'reseller_notes',
    'admin_notes',
    'ordered_at',
    'paid_at',
    'completed_at',
    'cancelled_at',
    'created_by',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'shipment_status' => ShipmentStatus::class,
            'total_qty' => 'integer',
            'price_per_pcs' => 'integer',
            'subtotal' => 'integer',
            'shipping_cost' => 'integer',
            'discount_amount' => 'integer',
            'total_amount' => 'integer',
            'potential_points' => 'integer',
            'earned_points' => 'integer',
            'ordered_at' => 'datetime',
            'paid_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function reseller(): BelongsTo
    {
        return $this->belongsTo(Reseller::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function priceTier(): BelongsTo
    {
        return $this->belongsTo(PriceTier::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }
}
