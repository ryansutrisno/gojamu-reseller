<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Reseller;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->withoutVite();
});

it('renders the admin dashboard with operational metrics', function (): void {
    $admin = User::factory()->admin()->create();
    $reseller = Reseller::factory()->create([
        'name' => 'Reseller Laporan',
        'reseller_code' => 'RSL-777',
    ]);

    $paidOrder = Order::factory()->for($reseller)->create([
        'invoice_number' => 'INV-M7-ADMIN-001',
        'status' => OrderStatus::Paid,
        'payment_status' => PaymentStatus::Paid,
        'total_qty' => 12,
        'total_amount' => 1_250_000,
        'potential_points' => 12,
        'ordered_at' => now(),
        'paid_at' => now(),
        'created_by' => $admin->id,
    ]);

    Payment::factory()->for($paidOrder)->waitingVerification()->create([
        'amount' => $paidOrder->total_amount,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('admin/dashboard')
            ->has('metrics', 4)
            ->where('metrics.0.value', '1')
            ->where('metrics.2.value', '1')
            ->has('recentOrders', 1)
            ->where('recentOrders.0.invoice', 'INV-M7-ADMIN-001')
            ->where('recentOrders.0.reseller', 'Reseller Laporan')
            ->where('recentOrders.0.status', OrderStatus::Paid->value)
            ->has('operationSummary', 3)
        );
});

it('renders the reseller dashboard with reseller-specific metrics', function (): void {
    $user = User::factory()->reseller()->create();
    $reseller = Reseller::factory()->for($user)->create([
        'city' => 'Bandung',
        'current_points' => 250,
        'name' => 'Reseller Bandung',
        'reseller_code' => 'BDG-001',
        'total_qty_purchased' => 42,
        'total_spent' => 2_500_000,
    ]);

    Order::factory()->for($reseller)->create([
        'invoice_number' => 'INV-M7-RES-001',
        'status' => OrderStatus::Processing,
        'payment_status' => PaymentStatus::Paid,
        'total_qty' => 20,
        'total_amount' => 1_000_000,
        'potential_points' => 20,
        'ordered_at' => now(),
        'paid_at' => now(),
        'created_by' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('reseller.dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('reseller/dashboard')
            ->where('reseller.name', 'Reseller Bandung')
            ->where('reseller.code', 'BDG-001')
            ->where('reseller.city', 'Bandung')
            ->where('stats.orders_count', 1)
            ->where('stats.current_points', 250)
            ->where('stats.total_qty_purchased', 42)
            ->where('points.current', 250)
            ->has('recentOrders', 1)
            ->where('recentOrders.0.invoice_number', 'INV-M7-RES-001')
            ->where('latestOrder.invoice_number', 'INV-M7-RES-001')
        );
});

it('renders the admin reports page with filtered order summaries', function (): void {
    $admin = User::factory()->admin()->create();
    $reseller = Reseller::factory()->create([
        'name' => 'Reseller Report',
        'reseller_code' => 'RPT-001',
    ]);

    Order::factory()->for($reseller)->create([
        'invoice_number' => 'INV-M7-REPORT-001',
        'status' => OrderStatus::Completed,
        'payment_status' => PaymentStatus::Paid,
        'total_qty' => 30,
        'total_amount' => 1_500_000,
        'potential_points' => 30,
        'ordered_at' => now(),
        'paid_at' => now(),
        'created_by' => $admin->id,
    ]);

    Order::factory()->for($reseller)->create([
        'invoice_number' => 'INV-M7-REPORT-OUTSIDE',
        'status' => OrderStatus::Completed,
        'payment_status' => PaymentStatus::Paid,
        'ordered_at' => now()->subMonths(2),
        'created_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.reports.index', [
            'start_date' => now()->startOfMonth()->toDateString(),
            'end_date' => now()->toDateString(),
            'status' => OrderStatus::Completed->value,
            'payment_status' => PaymentStatus::Paid->value,
        ]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('admin/reports/index')
            ->where('filters.status', OrderStatus::Completed->value)
            ->where('filters.payment_status', PaymentStatus::Paid->value)
            ->where('summary.orders_count', 1)
            ->where('summary.total_qty', 30)
            ->where('summary.total_amount', 1_500_000)
            ->where('summary.potential_points', 30)
            ->has('orders', 1)
            ->where('orders.0.invoice_number', 'INV-M7-REPORT-001')
            ->where('orders.0.reseller_name', 'Reseller Report')
            ->where('orders.0.status.value', OrderStatus::Completed->value)
            ->where('orders.0.payment_status.value', PaymentStatus::Paid->value)
            ->has('statusOptions')
            ->has('paymentStatusOptions')
        );
});

it('exports admin reports as a csv download', function (): void {
    $admin = User::factory()->admin()->create();
    $reseller = Reseller::factory()->create([
        'name' => 'Reseller CSV',
        'reseller_code' => 'CSV-001',
    ]);

    Order::factory()->for($reseller)->create([
        'invoice_number' => 'INV-M7-CSV-001',
        'status' => OrderStatus::Shipped,
        'payment_status' => PaymentStatus::Paid,
        'total_qty' => 15,
        'total_amount' => 750_000,
        'potential_points' => 15,
        'ordered_at' => now(),
        'paid_at' => now(),
        'created_by' => $admin->id,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.reports.export', [
        'start_date' => now()->startOfMonth()->toDateString(),
        'end_date' => now()->toDateString(),
        'status' => 'all',
        'payment_status' => 'all',
    ]));

    $response->assertSuccessful();
    $response->assertDownload();

    $content = $response->streamedContent();

    expect($content)
        ->toContain('Invoice,Reseller,"Kode Reseller"')
        ->toContain('INV-M7-CSV-001')
        ->toContain('Reseller CSV')
        ->toContain('CSV-001')
        ->toContain('Dikirim')
        ->toContain('Lunas');
});
