<?php

namespace App\Models;

use App\Enums\RewardRedemptionStatus;
use Database\Factories\RewardRedemptionFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[UseFactory(RewardRedemptionFactory::class)]
class RewardRedemption extends Model
{
    /** @use HasFactory<RewardRedemptionFactory> */
    use HasFactory;

    protected $fillable = [
        'reseller_id',
        'reward_id',
        'points',
        'status',
        'admin_notes',
        'rejected_reason',
        'approved_by',
        'processed_by',
        'requested_at',
        'approved_at',
        'rejected_at',
        'processed_at',
        'completed_at',
        'cancelled_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'status' => RewardRedemptionStatus::class,
            'requested_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'processed_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
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
     * @return BelongsTo<Reward, $this>
     */
    public function reward(): BelongsTo
    {
        return $this->belongsTo(Reward::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * @return HasMany<PointLedger, $this>
     */
    public function pointLedgers(): HasMany
    {
        return $this->hasMany(PointLedger::class);
    }
}
