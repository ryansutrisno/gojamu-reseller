<?php

namespace App\Http\Controllers\Reseller;

use App\Enums\RewardStatus;
use App\Http\Controllers\Controller;
use App\Models\PointLedger;
use App\Models\Reward;
use App\Models\RewardRedemption;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        abort_unless($user instanceof User, 403);

        $reseller = $user->reseller()->firstOrFail();
        $today = now()->toDateString();

        $rewards = Reward::query()
            ->where('status', RewardStatus::Active)
            ->where(function ($query) use ($today): void {
                $query->whereNull('start_date')->orWhereDate('start_date', '<=', $today);
            })
            ->where(function ($query) use ($today): void {
                $query->whereNull('end_date')->orWhereDate('end_date', '>=', $today);
            })
            ->orderBy('required_points', 'asc')
            ->get()
            ->map(fn (Reward $reward): array => [
                'id' => $reward->id,
                'name' => $reward->name,
                'image' => $reward->image,
                'description' => $reward->description,
                'required_points' => $reward->required_points,
                'stock' => $reward->stock,
                'status' => $reward->status->value,
                'status_label' => $reward->status->label(),
                'start_date' => $reward->start_date?->toISOString(),
                'end_date' => $reward->end_date?->toISOString(),
                'can_redeem' => $reseller->current_points >= $reward->required_points && ($reward->stock === null || $reward->stock > 0),
            ])->values();

        $recentLedgers = $reseller->pointLedgers()
            ->latest()
            ->with(['order:id,invoice_number', 'rewardRedemption:id,status'])
            ->take(10)
            ->get()
            ->map(fn (PointLedger $ledger): array => [
                'id' => $ledger->id,
                'type' => $ledger->type->value,
                'type_label' => $ledger->type->label(),
                'points' => $ledger->points,
                'balance_before' => $ledger->balance_before,
                'balance_after' => $ledger->balance_after,
                'description' => $ledger->description,
                'order_invoice_number' => $ledger->order?->invoice_number,
                'reward_redemption_status' => $ledger->rewardRedemption?->status->value,
                'created_at' => $ledger->created_at?->toISOString(),
            ])->values();

        $recentRedemptions = $reseller->rewardRedemptions()
            ->latest()
            ->with(['reward:id,name,required_points,stock,status', 'approver:id,name', 'processor:id,name'])
            ->take(10)
            ->get()
            ->map(fn (RewardRedemption $redemption): array => [
                'id' => $redemption->id,
                'points' => $redemption->points,
                'status' => $redemption->status->value,
                'status_label' => $redemption->status->label(),
                'admin_notes' => $redemption->admin_notes,
                'rejected_reason' => $redemption->rejected_reason,
                'requested_at' => $redemption->requested_at?->toISOString(),
                'approved_at' => $redemption->approved_at?->toISOString(),
                'rejected_at' => $redemption->rejected_at?->toISOString(),
                'processed_at' => $redemption->processed_at?->toISOString(),
                'completed_at' => $redemption->completed_at?->toISOString(),
                'reward' => $redemption->reward ? [
                    'id' => $redemption->reward->id,
                    'name' => $redemption->reward->name,
                    'required_points' => $redemption->reward->required_points,
                    'stock' => $redemption->reward->stock,
                    'status' => $redemption->reward->status->value,
                    'status_label' => $redemption->reward->status->label(),
                ] : null,
                'approver_name' => $redemption->approver?->name,
                'processor_name' => $redemption->processor?->name,
            ])->values();

        return Inertia::render('reseller/rewards/index', [
            'current_points' => $reseller->current_points,
            'rewards' => $rewards,
            'recent_point_ledgers' => $recentLedgers,
            'recent_redemptions' => $recentRedemptions,
        ]);
    }
}
