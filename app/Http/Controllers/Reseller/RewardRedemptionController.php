<?php

namespace App\Http\Controllers\Reseller;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRewardRedemptionRequest;
use App\Models\Reward;
use App\Services\RewardRedemptionService;
use Illuminate\Http\RedirectResponse;

class RewardRedemptionController extends Controller
{
    public function store(StoreRewardRedemptionRequest $request, Reward $reward, RewardRedemptionService $rewardRedemptionService): RedirectResponse
    {
        $reseller = $request->user()->reseller()->firstOrFail();

        $rewardRedemptionService->request($reseller, $reward);

        return redirect()
            ->route('reseller.rewards.index')
            ->with('success', 'Permintaan penukaran reward berhasil diajukan.');
    }
}
