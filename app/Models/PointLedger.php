<?php

namespace App\Models;

use App\Enums\PointLedgerType;
use Database\Factories\PointLedgerFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[UseFactory(PointLedgerFactory::class)]
class PointLedger extends Model
{
    /** @use HasFactory<PointLedgerFactory> */
    use HasFactory;

    protected $fillable = [
        'reseller_id',
        'order_id',
        'reward_redemption_id',
        'type',
        'points',
        'balance_before',
        'balance_after',
        'description',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PointLedgerType::class,
            'points' => 'integer',
            'balance_before' => 'integer',
            'balance_after' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Reseller, $this>
     */
    public function reseller(): BelongsTo
    {
        return $this->belongsTo(Reseller::class);
    }

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<RewardRedemption, $this>
     */
    public function rewardRedemption(): BelongsTo
    {
        return $this->belongsTo(RewardRedemption::class);
    }
}
