<?php

namespace App\Models;

use App\Enums\ResellerStatus;
use Database\Factories\ResellerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'user_id',
    'reseller_code',
    'name',
    'phone',
    'email',
    'address',
    'city',
    'province',
    'postal_code',
    'status',
    'joined_at',
    'total_qty_purchased',
    'total_spent',
    'current_points',
    'internal_notes',
])]
class Reseller extends Model
{
    /** @use HasFactory<ResellerFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ResellerStatus::class,
            'joined_at' => 'date',
            'total_qty_purchased' => 'integer',
            'total_spent' => 'integer',
            'current_points' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
