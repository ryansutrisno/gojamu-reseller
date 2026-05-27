<?php

use App\Enums\OrderStatus;
use App\Enums\PointLedgerType;
use App\Enums\RewardRedemptionStatus;
use App\Enums\RewardStatus;
use App\Enums\ShipmentStatus;
use App\Models\Order;
use App\Models\PointLedger;
use App\Models\Reseller;
use App\Models\Reward;
use App\Models\RewardRedemption;
use App\Models\Shipment;
use App\Models\User;
use App\Services\ManualFulfillmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

function createRewardWorkflowData(array $resellerAttributes = [], array $rewardAttributes = []): array
{
    $user = User::factory()->reseller()->create();
    $reseller = Reseller::factory()->for($user)->create(array_merge(['current_points' => 100], $resellerAttributes));
    $reward = Reward::factory()->create(array_merge(['required_points' => 60, 'stock' => 5, 'status' => RewardStatus::Active], $rewardAttributes));

    return compact('user', 'reseller', 'reward');
}

function rewardRedemptionPostWithCsrf(string $uri, array $data = []): TestResponse
{
    $token = 'reward-redemption-csrf-token';

    return test()
        ->withSession(['_token' => $token])
        ->post($uri, [...$data, '_token' => $token]);
}

it('completes shipped orders and awards points once with a credit ledger', function (): void {
    ['user' => $user, 'reseller' => $reseller] = createRewardWorkflowData();
    $order = Order::factory()->for($reseller)->create([
        'status' => OrderStatus::Shipped,
        'shipment_status' => ShipmentStatus::Shipped,
        'potential_points' => 8,
        'earned_points' => 0,
        'created_by' => $user->id,
    ]);
    Shipment::factory()->for($order)->create(['status' => ShipmentStatus::Shipped, 'shipped_at' => now()]);

    app(ManualFulfillmentService::class)->complete($order);

    $order->refresh();

    expect($order->earned_points)->toBe(8)
        ->and($reseller->fresh()->current_points)->toBe(108)
        ->and(PointLedger::query()->where('order_id', $order->id)->where('type', PointLedgerType::Credit)->count())->toBe(1);

    app(ManualFulfillmentService::class)->complete($order);

    expect(PointLedger::query()->where('order_id', $order->id)->where('type', PointLedgerType::Credit)->count())->toBe(1)
        ->and($reseller->fresh()->current_points)->toBe(108);
});

it('lets a reseller request reward redemption when points are sufficient', function (): void {
    ['user' => $user, 'reseller' => $reseller, 'reward' => $reward] = createRewardWorkflowData();

    actingAs($user);

    rewardRedemptionPostWithCsrf(route('reseller.rewards.redemptions.store', $reward))
        ->assertRedirect(route('reseller.rewards.index'));

    $redemption = RewardRedemption::query()->firstOrFail();

    expect($redemption->reseller_id)->toBe($reseller->id)
        ->and($redemption->reward_id)->toBe($reward->id)
        ->and($redemption->status)->toBe(RewardRedemptionStatus::Requested)
        ->and($redemption->points)->toBe(60);
});

it('lets a reseller request reward redemption on the end date with unlimited stock', function (): void {
    ['user' => $user, 'reseller' => $reseller, 'reward' => $reward] = createRewardWorkflowData([], [
        'end_date' => today(),
        'stock' => null,
    ]);

    actingAs($user);

    rewardRedemptionPostWithCsrf(route('reseller.rewards.redemptions.store', $reward))
        ->assertRedirect(route('reseller.rewards.index'));

    $redemption = RewardRedemption::query()->firstOrFail();

    expect($redemption->reseller_id)->toBe($reseller->id)
        ->and($redemption->reward_id)->toBe($reward->id)
        ->and($redemption->status)->toBe(RewardRedemptionStatus::Requested)
        ->and($reward->fresh()->stock)->toBeNull();
});

it('lets admin approve redemption and deduct points with stock and debit ledger updates', function (): void {
    $admin = User::factory()->admin()->create();
    ['reseller' => $reseller, 'reward' => $reward] = createRewardWorkflowData(['current_points' => 100]);
    $redemption = RewardRedemption::factory()->for($reseller)->for($reward)->create([
        'points' => 60,
        'status' => RewardRedemptionStatus::Requested,
    ]);

    actingAs($admin);

    rewardRedemptionPostWithCsrf(route('admin.reward-redemptions.approve', $redemption), ['admin_notes' => 'disetujui'])
        ->assertRedirect();

    $redemption->refresh();

    expect($redemption->status)->toBe(RewardRedemptionStatus::Approved)
        ->and($redemption->approved_by)->toBe($admin->id)
        ->and($reseller->fresh()->current_points)->toBe(40)
        ->and($reward->fresh()->stock)->toBe(4)
        ->and(PointLedger::query()->where('reward_redemption_id', $redemption->id)->where('type', PointLedgerType::Debit)->count())->toBe(1);
});

it('rejects redemption without deducting points or stock', function (): void {
    $admin = User::factory()->admin()->create();
    ['reseller' => $reseller, 'reward' => $reward] = createRewardWorkflowData(['current_points' => 100]);
    $redemption = RewardRedemption::factory()->for($reseller)->for($reward)->create([
        'points' => 60,
        'status' => RewardRedemptionStatus::Requested,
    ]);

    actingAs($admin);

    rewardRedemptionPostWithCsrf(route('admin.reward-redemptions.reject', $redemption), [
        'reason' => 'stok tidak tersedia',
        'admin_notes' => 'dicek ulang',
    ])->assertRedirect();

    $redemption->refresh();

    expect($redemption->status)->toBe(RewardRedemptionStatus::Rejected)
        ->and($redemption->rejected_reason)->toBe('stok tidak tersedia')
        ->and($reseller->fresh()->current_points)->toBe(100)
        ->and($reward->fresh()->stock)->toBe(5)
        ->and(PointLedger::query()->where('reward_redemption_id', $redemption->id)->count())->toBe(0);
});

it('blocks completing approved redemption before it is processing', function (): void {
    $admin = User::factory()->admin()->create();
    ['reseller' => $reseller, 'reward' => $reward] = createRewardWorkflowData(['current_points' => 100]);
    $redemption = RewardRedemption::factory()->for($reseller)->for($reward)->create([
        'points' => 60,
        'status' => RewardRedemptionStatus::Approved,
    ]);

    actingAs($admin);

    rewardRedemptionPostWithCsrf(route('admin.reward-redemptions.complete', $redemption), ['admin_notes' => 'selesai'])
        ->assertSessionHasErrors('redemption');

    expect($redemption->fresh()->status)->toBe(RewardRedemptionStatus::Approved)
        ->and($redemption->fresh()->completed_at)->toBeNull();
});

it('blocks redemption when points are insufficient', function (): void {
    ['user' => $user, 'reward' => $reward] = createRewardWorkflowData(['current_points' => 20]);

    actingAs($user);

    rewardRedemptionPostWithCsrf(route('reseller.rewards.redemptions.store', $reward))
        ->assertSessionHasErrors('reward');
});
