<?php

use App\Enums\PriceTierStatus;
use App\Enums\ProductStatus;
use App\Enums\RewardStatus;
use App\Enums\UserRole;
use App\Models\Reseller;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

function masterDataPostWithCsrf(string $uri, array $data = []): TestResponse
{
    $token = 'test-csrf-token';

    return test()
        ->withSession(['_token' => $token])
        ->post($uri, [...$data, '_token' => $token]);
}

function masterDataPutWithCsrf(string $uri, array $data = []): TestResponse
{
    $token = 'test-csrf-token';

    return test()
        ->withSession(['_token' => $token])
        ->put($uri, [...$data, '_token' => $token]);
}

function masterDataDeleteWithCsrf(string $uri, array $data = []): TestResponse
{
    $token = 'test-csrf-token';

    return test()
        ->withSession(['_token' => $token])
        ->delete($uri, [...$data, '_token' => $token]);
}

test('admin can view resellers list', function () {
    $admin = User::factory()->admin()->create();
    Reseller::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.resellers.index'));

    $response->assertOk();
});

test('admin can create reseller', function () {
    $admin = User::factory()->admin()->create();

    actingAs($admin);

    $response = masterDataPostWithCsrf(route('admin.resellers.store'), [
        'name' => 'John Reseller',
        'email' => 'john@reseller.com',
        'password' => 'secret123',
        'phone' => '08123456789',
        'address' => 'Reseller Address 123',
        'city' => 'Jakarta',
        'province' => 'DKI Jakarta',
        'postal_code' => '12345',
        'internal_notes' => 'Some notes',
    ]);

    $response->assertRedirect(route('admin.resellers.index'));

    $this->assertDatabaseHas('users', [
        'name' => 'John Reseller',
        'email' => 'john@reseller.com',
        'role' => UserRole::Reseller->value,
    ]);

    $this->assertDatabaseHas('resellers', [
        'phone' => '08123456789',
        'city' => 'Jakarta',
        'province' => 'DKI Jakarta',
    ]);
});

test('admin can update reseller status and details', function () {
    $admin = User::factory()->admin()->create();
    $reseller = Reseller::factory()->create();

    actingAs($admin);

    $response = masterDataPutWithCsrf(route('admin.resellers.update', $reseller), [
        'name' => 'Updated Name',
        'email' => 'updated@email.com',
        'phone' => '08987654321',
        'address' => 'Updated Address 123',
        'city' => 'Surabaya',
        'province' => 'Jawa Timur',
        'postal_code' => '54321',
        'status' => 'inactive',
        'internal_notes' => 'Updated notes',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $reseller->user_id,
        'name' => 'Updated Name',
        'email' => 'updated@email.com',
        'status' => 'inactive',
    ]);

    $this->assertDatabaseHas('resellers', [
        'id' => $reseller->id,
        'phone' => '08987654321',
        'city' => 'Surabaya',
    ]);
});

test('admin can reset reseller password', function () {
    $admin = User::factory()->admin()->create();
    $reseller = Reseller::factory()->create();

    actingAs($admin);

    $response = masterDataPostWithCsrf(route('admin.resellers.reset-password', $reseller), [
        'password' => 'newpassword123',
    ]);

    $response->assertRedirect();
});

test('admin can create and view products', function () {
    $admin = User::factory()->admin()->create();

    actingAs($admin);

    $response = masterDataPostWithCsrf(route('admin.products.store'), [
        'sku' => 'PROD-001',
        'name' => 'Product Name 1',
        'description' => 'Product Description',
        'weight_gram' => 250,
        'status' => ProductStatus::Active->value,
        'color_key' => 'green',
        'color_hex' => '#00FF00',
        'sort_order' => 1,
    ]);

    $response->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseHas('products', [
        'sku' => 'PROD-001',
        'name' => 'Product Name 1',
    ]);

    $indexResponse = $this->get(route('admin.products.index'));
    $indexResponse->assertOk();

    $productsData = $indexResponse->original->getData()['page']['props']['products'];
    expect($productsData)->toBeArray()
        ->and($productsData[0])->toHaveKey('variants')
        ->and($productsData[0]['variants'])->toBeArray();
});

test('admin can create, update, delete price tiers without overlap issues', function () {
    $admin = User::factory()->admin()->create();

    actingAs($admin);

    $response = masterDataPostWithCsrf(route('admin.price-tiers.store'), [
        'name' => 'Tier 1',
        'min_qty' => 1,
        'max_qty' => 10,
        'price_per_pcs' => 10000,
        'status' => PriceTierStatus::Active->value,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('price_tiers', ['name' => 'Tier 1']);

    $responseOverlap = masterDataPostWithCsrf(route('admin.price-tiers.store'), [
        'name' => 'Tier 2 Overlapping',
        'min_qty' => 5,
        'max_qty' => 15,
        'price_per_pcs' => 9000,
        'status' => PriceTierStatus::Active->value,
    ]);

    $responseOverlap->assertSessionHasErrors('min_qty');
});

test('admin can manage rewards', function () {
    $admin = User::factory()->admin()->create();

    actingAs($admin);

    $response = masterDataPostWithCsrf(route('admin.rewards.store'), [
        'name' => 'Reward Gift',
        'description' => 'Gift description',
        'required_points' => 50,
        'stock' => 10,
        'status' => RewardStatus::Active->value,
    ]);

    $response->assertRedirect(route('admin.rewards.index'));
    $this->assertDatabaseHas('rewards', ['name' => 'Reward Gift']);
});
