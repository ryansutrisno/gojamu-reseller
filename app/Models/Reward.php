<?php

namespace App\Models;

use App\Enums\RewardStatus;
use Database\Factories\RewardFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'image', 'description', 'required_points', 'stock', 'status', 'start_date', 'end_date'])]
class Reward extends Model
{
    /** @use HasFactory<RewardFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'required_points' => 'integer',
            'stock' => 'integer',
            'status' => RewardStatus::class,
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }
}
