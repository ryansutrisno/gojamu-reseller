<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RejectRewardRedemptionRequest;
use App\Http\Requests\UpdateRewardRedemptionStatusRequest;
use App\Models\RewardRedemption;
use App\Models\User;
use App\Services\RewardRedemptionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RewardRedemptionController extends Controller
{
    public function index(): Response
    {
        $redemptions = RewardRedemption::query()
            ->latest()
            ->with(['reseller:id,name,reseller_code', 'reward:id,name,required_points,stock,status', 'approver:id,name', 'processor:id,name'])
            ->take(50)
            ->get()
            ->map(fn (RewardRedemption $redemption): array => $this->redemptionDetail($redemption))
            ->values();

        return Inertia::render('admin/reward-redemptions/index', [
            'redemptions' => $redemptions,
        ]);
    }

    public function approve(UpdateRewardRedemptionStatusRequest $request, RewardRedemption $rewardRedemption, RewardRedemptionService $service): RedirectResponse
    {
        $admin = $request->user();

        abort_unless($admin instanceof User, 403);

        $service->approve($rewardRedemption, $admin, $request->validated()['admin_notes'] ?? null);

        return back()->with('success', 'Penukaran reward berhasil disetujui.');
    }

    public function reject(RejectRewardRedemptionRequest $request, RewardRedemption $rewardRedemption, RewardRedemptionService $service): RedirectResponse
    {
        $admin = $request->user();

        abort_unless($admin instanceof User, 403);

        $validated = $request->validated();

        $service->reject($rewardRedemption, $admin, $validated['reason'], $validated['admin_notes'] ?? null);

        return back()->with('success', 'Penukaran reward berhasil ditolak.');
    }

    public function process(UpdateRewardRedemptionStatusRequest $request, RewardRedemption $rewardRedemption, RewardRedemptionService $service): RedirectResponse
    {
        $admin = $request->user();

        abort_unless($admin instanceof User, 403);

        $service->markProcessing($rewardRedemption, $admin, $request->validated()['admin_notes'] ?? null);

        return back()->with('success', 'Penukaran reward sedang diproses.');
    }

    public function complete(UpdateRewardRedemptionStatusRequest $request, RewardRedemption $rewardRedemption, RewardRedemptionService $service): RedirectResponse
    {
        $admin = $request->user();

        abort_unless($admin instanceof User, 403);

        $service->markCompleted($rewardRedemption, $admin, $request->validated()['admin_notes'] ?? null);

        return back()->with('success', 'Penukaran reward telah diselesaikan.');
    }

    /**
     * @return array<string, mixed>
     */
    private function redemptionDetail(RewardRedemption $redemption): array
    {
        return [
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
            'reseller' => $redemption->reseller ? [
                'id' => $redemption->reseller->id,
                'name' => $redemption->reseller->name,
                'reseller_code' => $redemption->reseller->reseller_code,
            ] : null,
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
        ];
    }
}
