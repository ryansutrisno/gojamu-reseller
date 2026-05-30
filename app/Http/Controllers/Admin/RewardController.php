<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRewardRequest;
use App\Http\Requests\UpdateRewardRequest;
use App\Models\Reward;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    public function index(): Response
    {
        $rewards = Reward::query()
            ->latest()
            ->take(50)
            ->get()
            ->map(fn (Reward $reward): array => [
                'id' => $reward->id,
                'name' => $reward->name,
                'description' => $reward->description,
                'required_points' => $reward->required_points,
                'stock' => $reward->stock,
                'status' => $reward->status->value,
                'status_label' => $reward->status->label(),
                'start_date' => $reward->start_date?->toISOString(),
                'end_date' => $reward->end_date?->toISOString(),
            ])->values();

        return Inertia::render('admin/rewards/index', [
            'rewards' => $rewards,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/rewards/create');
    }

    public function store(StoreRewardRequest $request): RedirectResponse
    {
        Reward::query()->create($request->validated());

        return redirect()
            ->route('admin.rewards.index')
            ->with('success', 'Reward berhasil ditambahkan.');
    }

    public function edit(Reward $reward): Response
    {
        return Inertia::render('admin/rewards/edit', [
            'reward' => [
                'id' => $reward->id,
                'name' => $reward->name,
                'description' => $reward->description,
                'required_points' => $reward->required_points,
                'stock' => $reward->stock,
                'status' => $reward->status->value,
                'status_label' => $reward->status->label(),
                'start_date' => $reward->start_date?->toISOString(),
                'end_date' => $reward->end_date?->toISOString(),
            ],
        ]);
    }

    public function update(UpdateRewardRequest $request, Reward $reward): RedirectResponse
    {
        $reward->update($request->validated());

        return back()->with('success', 'Reward berhasil diperbarui.');
    }

    public function destroy(Reward $reward): RedirectResponse
    {
        $reward->delete();

        return back()->with('success', 'Reward berhasil dihapus.');
    }
}
