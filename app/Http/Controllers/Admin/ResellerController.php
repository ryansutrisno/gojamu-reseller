<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ResellerStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ResetResellerPasswordRequest;
use App\Http\Requests\StoreResellerRequest;
use App\Http\Requests\UpdateResellerRequest;
use App\Models\Reseller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ResellerController extends Controller
{
    public function index(): Response
    {
        $resellers = Reseller::query()
            ->with('user:id,name,email,status')
            ->latest()
            ->take(50)
            ->get()
            ->map(fn (Reseller $reseller): array => [
                'id' => $reseller->id,
                'reseller_code' => $reseller->reseller_code,
                'name' => $reseller->name,
                'phone' => $reseller->phone,
                'city' => $reseller->city,
                'province' => $reseller->province,
                'status' => $reseller->status->value,
                'status_label' => $reseller->status->label(),
                'joined_at' => $reseller->joined_at?->toISOString(),
                'total_qty_purchased' => $reseller->total_qty_purchased,
                'total_spent' => $reseller->total_spent,
                'current_points' => $reseller->current_points,
                'user_email' => $reseller->user?->email,
                'user_status' => $reseller->user?->status->value,
            ])->values();

        return Inertia::render('admin/resellers/index', [
            'resellers' => $resellers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/resellers/create');
    }

    public function store(StoreResellerRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => UserRole::Reseller,
            'status' => UserStatus::Active,
        ]);

        Reseller::query()->create([
            'user_id' => $user->id,
            'reseller_code' => 'RS-'.strtoupper(Str::random(6)),
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'province' => $validated['province'],
            'postal_code' => $validated['postal_code'] ?? null,
            'status' => ResellerStatus::Active,
            'joined_at' => now(),
            'total_qty_purchased' => 0,
            'total_spent' => 0,
            'current_points' => 0,
            'internal_notes' => $validated['internal_notes'] ?? null,
        ]);

        return redirect()
            ->route('admin.resellers.index')
            ->with('success', 'Reseller berhasil ditambahkan.');
    }

    public function edit(Reseller $reseller): Response
    {
        $reseller->load('user:id,name,email,status');

        return Inertia::render('admin/resellers/edit', [
            'reseller' => [
                'id' => $reseller->id,
                'reseller_code' => $reseller->reseller_code,
                'name' => $reseller->name,
                'phone' => $reseller->phone,
                'email' => $reseller->user?->email,
                'address' => $reseller->address,
                'city' => $reseller->city,
                'province' => $reseller->province,
                'postal_code' => $reseller->postal_code,
                'status' => $reseller->status->value,
                'status_label' => $reseller->status->label(),
                'joined_at' => $reseller->joined_at?->toISOString(),
                'total_qty_purchased' => $reseller->total_qty_purchased,
                'total_spent' => $reseller->total_spent,
                'current_points' => $reseller->current_points,
                'internal_notes' => $reseller->internal_notes,
                'user_id' => $reseller->user_id,
            ],
        ]);
    }

    public function update(UpdateResellerRequest $request, Reseller $reseller): RedirectResponse
    {
        $validated = $request->validated();

        $reseller->user()->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'] === ResellerStatus::Active->value
                ? UserStatus::Active
                : UserStatus::Inactive,
        ]);

        $reseller->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'province' => $validated['province'],
            'postal_code' => $validated['postal_code'] ?? null,
            'status' => $validated['status'],
            'internal_notes' => $validated['internal_notes'] ?? null,
        ]);

        return back()->with('success', 'Data reseller berhasil diperbarui.');
    }

    public function destroy(Reseller $reseller): RedirectResponse
    {
        $reseller->user()->update([
            'status' => UserStatus::Inactive,
        ]);

        $reseller->delete();

        return back()->with('success', 'Reseller berhasil dihapus.');
    }

    public function resetPassword(ResetResellerPasswordRequest $request, Reseller $reseller): RedirectResponse
    {
        $reseller->user()->update([
            'password' => $request->validated('password'),
        ]);

        return back()->with('success', 'Password reseller berhasil direset.');
    }
}
