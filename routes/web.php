<?php

use App\Enums\UserRole;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $user = Auth::user();

    if (! $user) {
        return redirect()->route('login');
    }

    return redirect()->route($user->dashboardRouteName());
})->name('home');

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function (): void {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::middleware('role:'.implode(',', [
        UserRole::SuperAdmin->value,
        UserRole::Admin->value,
        UserRole::Warehouse->value,
        UserRole::Finance->value,
    ]))->get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    Route::middleware('role:'.UserRole::Reseller->value)->get('/reseller/dashboard', function () {
        return Inertia::render('reseller/dashboard');
    })->name('reseller.dashboard');
});
