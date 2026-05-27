<?php

namespace App\Services;

use App\Enums\PointLedgerType;
use App\Enums\RewardRedemptionStatus;
use App\Enums\RewardStatus;
use App\Models\PointLedger;
use App\Models\Reseller;
use App\Models\Reward;
use App\Models\RewardRedemption;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RewardRedemptionService
{
    /**
     * @throws ValidationException
     */
    public function request(Reseller $reseller, Reward $reward): RewardRedemption
    {
        return DB::transaction(function () use ($reseller, $reward): RewardRedemption {
            /** @var Reseller $lockedReseller */
            $lockedReseller = Reseller::query()
                ->whereKey($reseller->id)
                ->lockForUpdate()
                ->firstOrFail();

            /** @var Reward $lockedReward */
            $lockedReward = Reward::query()
                ->whereKey($reward->id)
                ->lockForUpdate()
                ->firstOrFail();

            $this->ensureRewardCanBeRedeemed($lockedReward, $lockedReseller);

            return RewardRedemption::query()->create([
                'reseller_id' => $lockedReseller->id,
                'reward_id' => $lockedReward->id,
                'points' => $lockedReward->required_points,
                'status' => RewardRedemptionStatus::Requested,
                'requested_at' => now(),
            ]);
        }, attempts: 5);
    }

    /**
     * @throws ValidationException
     */
    public function approve(RewardRedemption $redemption, User $admin, ?string $notes = null): RewardRedemption
    {
        return DB::transaction(function () use ($redemption, $admin, $notes): RewardRedemption {
            $lockedRedemption = $this->lockRedemption($redemption);

            if ($lockedRedemption->status !== RewardRedemptionStatus::Requested) {
                throw ValidationException::withMessages([
                    'redemption' => 'Hanya penukaran berstatus requested yang bisa disetujui.',
                ]);
            }

            /** @var Reseller $reseller */
            $reseller = Reseller::query()
                ->whereKey($lockedRedemption->reseller_id)
                ->lockForUpdate()
                ->firstOrFail();

            /** @var Reward $reward */
            $reward = Reward::query()
                ->whereKey($lockedRedemption->reward_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($reseller->current_points < $lockedRedemption->points) {
                throw ValidationException::withMessages([
                    'redemption' => 'Poin reseller tidak mencukupi untuk menyetujui penukaran ini.',
                ]);
            }

            if ($reward->stock !== null && $reward->stock < 1) {
                throw ValidationException::withMessages([
                    'redemption' => 'Stok reward sudah habis.',
                ]);
            }

            $balanceBefore = $reseller->current_points;
            $balanceAfter = $balanceBefore - $lockedRedemption->points;

            $reseller->forceFill([
                'current_points' => $balanceAfter,
            ])->save();

            if ($reward->stock !== null) {
                $reward->forceFill([
                    'stock' => $reward->stock - 1,
                ])->save();
            }

            $lockedRedemption->forceFill([
                'status' => RewardRedemptionStatus::Approved,
                'admin_notes' => $notes,
                'approved_by' => $admin->id,
                'approved_at' => now(),
            ])->save();

            PointLedger::query()->create([
                'reseller_id' => $reseller->id,
                'reward_redemption_id' => $lockedRedemption->id,
                'type' => PointLedgerType::Debit,
                'points' => $lockedRedemption->points,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'description' => "Penukaran reward {$reward->name}",
            ]);

            return $lockedRedemption->refresh()->load(['reseller', 'reward', 'approver']);
        }, attempts: 5);
    }

    /**
     * @throws ValidationException
     */
    public function reject(RewardRedemption $redemption, User $admin, string $reason, ?string $notes = null): RewardRedemption
    {
        return DB::transaction(function () use ($redemption, $admin, $reason, $notes): RewardRedemption {
            $lockedRedemption = $this->lockRedemption($redemption);

            if ($lockedRedemption->status !== RewardRedemptionStatus::Requested) {
                throw ValidationException::withMessages([
                    'redemption' => 'Hanya penukaran berstatus requested yang bisa ditolak.',
                ]);
            }

            $lockedRedemption->forceFill([
                'status' => RewardRedemptionStatus::Rejected,
                'admin_notes' => $notes,
                'rejected_reason' => $reason,
                'processed_by' => $admin->id,
                'rejected_at' => now(),
            ])->save();

            return $lockedRedemption->refresh()->load(['reseller', 'reward', 'processor']);
        }, attempts: 5);
    }

    /**
     * @throws ValidationException
     */
    public function markProcessing(RewardRedemption $redemption, User $admin, ?string $notes = null): RewardRedemption
    {
        return DB::transaction(function () use ($redemption, $admin, $notes): RewardRedemption {
            $lockedRedemption = $this->lockRedemption($redemption);

            if ($lockedRedemption->status !== RewardRedemptionStatus::Approved) {
                throw ValidationException::withMessages([
                    'redemption' => 'Hanya penukaran berstatus approved yang bisa diproses.',
                ]);
            }

            $lockedRedemption->forceFill([
                'status' => RewardRedemptionStatus::Processing,
                'admin_notes' => $notes,
                'processed_by' => $admin->id,
                'processed_at' => now(),
            ])->save();

            return $lockedRedemption->refresh()->load(['reseller', 'reward', 'processor']);
        }, attempts: 5);
    }

    /**
     * @throws ValidationException
     */
    public function markCompleted(RewardRedemption $redemption, User $admin, ?string $notes = null): RewardRedemption
    {
        return DB::transaction(function () use ($redemption, $admin, $notes): RewardRedemption {
            $lockedRedemption = $this->lockRedemption($redemption);

            if ($lockedRedemption->status !== RewardRedemptionStatus::Processing) {
                throw ValidationException::withMessages([
                    'redemption' => 'Hanya penukaran berstatus processing yang bisa diselesaikan.',
                ]);
            }

            $lockedRedemption->forceFill([
                'status' => RewardRedemptionStatus::Completed,
                'admin_notes' => $notes,
                'processed_by' => $admin->id,
                'completed_at' => now(),
            ])->save();

            return $lockedRedemption->refresh()->load(['reseller', 'reward', 'processor']);
        }, attempts: 5);
    }

    /**
     * @throws ValidationException
     */
    private function ensureRewardCanBeRedeemed(Reward $reward, Reseller $reseller): void
    {
        if ($reward->status !== RewardStatus::Active) {
            throw ValidationException::withMessages([
                'reward' => 'Reward belum aktif untuk ditukar.',
            ]);
        }

        if ($reward->start_date !== null && $reward->start_date->isFuture()) {
            throw ValidationException::withMessages([
                'reward' => 'Reward belum memasuki periode penukaran.',
            ]);
        }

        if ($reward->end_date !== null && $reward->end_date->lt(today())) {
            throw ValidationException::withMessages([
                'reward' => 'Periode penukaran reward sudah berakhir.',
            ]);
        }

        if ($reward->stock !== null && $reward->stock < 1) {
            throw ValidationException::withMessages([
                'reward' => 'Stok reward sudah habis.',
            ]);
        }

        if ($reseller->current_points < $reward->required_points) {
            throw ValidationException::withMessages([
                'reward' => 'Poin belum cukup untuk menukar reward ini.',
            ]);
        }
    }

    private function lockRedemption(RewardRedemption $redemption): RewardRedemption
    {
        return RewardRedemption::query()
            ->whereKey($redemption->id)
            ->lockForUpdate()
            ->firstOrFail();
    }
}
