<?php

use App\Enums\UserStatus;
use App\Models\Reseller;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
});

function csrfToken(): string
{
    return 'test-csrf-token';
}

function postWithCsrf(string $uri, array $data = []): TestResponse
{
    $token = csrfToken();

    return test()->withSession(['_token' => $token])->post($uri, [
        ...$data,
        '_token' => $token,
    ]);
}

test('guest root redirects to login', function () {
    $this->get(route('home'))
        ->assertRedirect(route('login'));
});

test('active admin can login and access admin dashboard', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'admin@gojamu.test',
        'password' => 'password',
    ]);

    postWithCsrf(route('login.store'), [
        'email' => $admin->email,
        'password' => 'password',
    ])->assertRedirect(route('admin.dashboard', absolute: false));

    $this->assertAuthenticatedAs($admin);

    $this->get(route('admin.dashboard'))
        ->assertOk();
});

test('active reseller is redirected to reseller dashboard and cannot access admin dashboard', function () {
    $reseller = User::factory()->reseller()->create([
        'email' => 'reseller@gojamu.test',
        'password' => 'password',
    ]);
    Reseller::factory()->for($reseller)->create();

    postWithCsrf(route('login.store'), [
        'email' => $reseller->email,
        'password' => 'password',
    ])->assertRedirect(route('reseller.dashboard', absolute: false));

    $this->assertAuthenticatedAs($reseller);

    $this->get(route('reseller.dashboard'))
        ->assertOk();

    $this->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('inactive user cannot login', function () {
    $inactiveUser = User::factory()->admin()->inactive()->create([
        'email' => 'inactive@gojamu.test',
        'password' => 'password',
    ]);

    postWithCsrf(route('login.store'), [
        'email' => $inactiveUser->email,
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();

    expect($inactiveUser->fresh()->status)->toBe(UserStatus::Inactive);
});

test('authenticated user can logout', function () {
    $admin = User::factory()->admin()->create();

    $token = csrfToken();

    $this->actingAs($admin)
        ->withSession(['_token' => $token])
        ->post(route('logout'), ['_token' => $token])
        ->assertRedirect(route('login'));

    $this->assertGuest();
});
