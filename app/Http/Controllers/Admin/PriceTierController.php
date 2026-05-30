<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PriceTierStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePriceTierRequest;
use App\Http\Requests\UpdatePriceTierRequest;
use App\Models\PriceTier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PriceTierController extends Controller
{
    public function index(): Response
    {
        $priceTiers = PriceTier::query()
            ->orderBy('min_qty')
            ->get()
            ->map(fn (PriceTier $tier): array => [
                'id' => $tier->id,
                'name' => $tier->name,
                'min_qty' => $tier->min_qty,
                'max_qty' => $tier->max_qty,
                'price_per_pcs' => $tier->price_per_pcs,
                'status' => $tier->status->value,
                'status_label' => $tier->status->label(),
            ])->values();

        return Inertia::render('admin/price-tiers/index', [
            'priceTiers' => $priceTiers,
        ]);
    }

    public function store(StorePriceTierRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->validateNoOverlap(
            (int) $validated['min_qty'],
            isset($validated['max_qty']) ? (int) $validated['max_qty'] : null,
        );

        PriceTier::query()->create($validated);

        return back()->with('success', 'Tier harga berhasil ditambahkan.');
    }

    public function update(UpdatePriceTierRequest $request, PriceTier $priceTier): RedirectResponse
    {
        $validated = $request->validated();

        $this->validateNoOverlap(
            (int) $validated['min_qty'],
            isset($validated['max_qty']) ? (int) $validated['max_qty'] : null,
            $priceTier->id,
        );

        $priceTier->update($validated);

        return back()->with('success', 'Tier harga berhasil diperbarui.');
    }

    public function destroy(PriceTier $priceTier): RedirectResponse
    {
        $priceTier->delete();

        return back()->with('success', 'Tier harga berhasil dihapus.');
    }

    /**
     * Validate that the given qty range does not overlap with existing active price tiers.
     *
     * @throws ValidationException
     */
    private function validateNoOverlap(int $min, ?int $max, ?int $excludeId = null): void
    {
        $overlap = PriceTier::query()
            ->where('id', '!=', $excludeId)
            ->where('status', PriceTierStatus::Active->value)
            ->where(function ($q) use ($min, $max): void {
                $q->whereBetween('min_qty', [$min, $max ?? PHP_INT_MAX])
                    ->orWhereBetween('max_qty', [$min, $max ?? PHP_INT_MAX])
                    ->orWhere(function ($q2) use ($min, $max): void {
                        $q2->where('min_qty', '<=', $min)
                            ->where(function ($q3) use ($max): void {
                                $q3->where('max_qty', '>=', $max ?? PHP_INT_MAX)
                                    ->orWhereNull('max_qty');
                            });
                    });
            })
            ->exists();

        if ($overlap) {
            throw ValidationException::withMessages([
                'min_qty' => 'Rentang kuantitas tumpang tindih dengan tier harga aktif lainnya.',
            ]);
        }
    }
}
