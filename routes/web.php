<?php

use App\Enums\UserRole;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Reseller\OrderController as ResellerOrderController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $user = Auth::user();

    if (! $user instanceof User) {
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
    ]))->prefix('admin')->name('admin.')->group(function (): void {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('dashboard');

        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    });

    Route::middleware('role:'.UserRole::Reseller->value)->prefix('reseller')->name('reseller.')->group(function (): void {
        Route::get('/dashboard', function () {
            return Inertia::render('reseller/dashboard');
        })->name('dashboard');

        Route::get('/orders', [ResellerOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/create', [ResellerOrderController::class, 'create'])->name('orders.create');
        Route::post('/orders', [ResellerOrderController::class, 'store'])->name('orders.store');
        Route::get('/orders/{order}', [ResellerOrderController::class, 'show'])->name('orders.show');
    });
});
