<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentProofStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentProof;
use App\Models\Reseller;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->withoutVite();
});

function manualPaymentPostWithCsrf(string $uri, array $data = []): TestResponse
{
    $token = 'manual-payment-csrf-token';

    return test()
        ->withSession(['_token' => $token])
        ->post($uri, [...$data, '_token' => $token]);
}

/**
 * @return array{user: User, reseller: Reseller, order: Order, payment: Payment}
 */
function createManualPaymentOrder(?PaymentStatus $paymentStatus = null): array
{
    $user = User::factory()->reseller()->create();
    $reseller = Reseller::factory()->for($user)->create();

    $order = Order::factory()
        ->for($reseller)
        ->create([
            'status' => OrderStatus::PendingPayment,
            'payment_status' => $paymentStatus ?? PaymentStatus::Pending,
            'total_amount' => 250000,
            'subtotal' => 250000,
            'shipping_cost' => 0,
            'discount_amount' => 0,
            'created_by' => $user->id,
        ]);

    $payment = Payment::factory()
        ->for($order)
        ->create([
            'amount' => $order->total_amount,
            'status' => $paymentStatus ?? PaymentStatus::Pending,
        ]);

    return compact('user', 'reseller', 'order', 'payment');
}

it('lets a reseller upload payment proof and marks payment as waiting verification', function (): void {
    Storage::fake('local');

    ['user' => $user, 'order' => $order] = createManualPaymentOrder();

    $response = $this->actingAs($user);

    manualPaymentPostWithCsrf(route('reseller.orders.payment-proof.store', $order), [
        'proof' => UploadedFile::fake()->image('transfer-proof.jpg'),
        'notes' => 'Transfer dari rekening BCA reseller.',
    ])->assertRedirect();

    $proof = PaymentProof::query()->whereBelongsTo($order)->firstOrFail();
    $payment = $order->payment()->firstOrFail();

    Storage::disk('local')->assertExists($proof->file_path);

    expect($response)->not->toBeNull()
        ->and($proof->status)->toBe(PaymentProofStatus::Submitted)
        ->and($proof->uploaded_by)->toBe($user->id)
        ->and($proof->notes)->toBe('Transfer dari rekening BCA reseller.')
        ->and($payment->status)->toBe(PaymentStatus::WaitingVerification)
        ->and($order->refresh()->payment_status)->toBe(PaymentStatus::WaitingVerification);
});

it('lets finance approve a submitted proof and marks the order as paid', function (): void {
    ['order' => $order, 'payment' => $payment] = createManualPaymentOrder(PaymentStatus::WaitingVerification);
    $finance = User::factory()->finance()->create();
    $proof = PaymentProof::factory()->forPayment($payment)->create();

    $this->actingAs($finance);

    manualPaymentPostWithCsrf(route('admin.orders.payment-proofs.approve', [$order, $proof]))
        ->assertRedirect();

    $proof->refresh();
    $payment->refresh();
    $order->refresh();

    expect($proof->status)->toBe(PaymentProofStatus::Approved)
        ->and($payment->status)->toBe(PaymentStatus::Paid)
        ->and($payment->verified_by)->toBe($finance->id)
        ->and($payment->verified_at)->not->toBeNull()
        ->and($payment->paid_at)->not->toBeNull()
        ->and($order->status)->toBe(OrderStatus::Paid)
        ->and($order->payment_status)->toBe(PaymentStatus::Paid)
        ->and($order->paid_at)->not->toBeNull();
});

it('lets finance reject a proof and allows the reseller to upload a replacement', function (): void {
    Storage::fake('local');

    ['user' => $user, 'order' => $order, 'payment' => $payment] = createManualPaymentOrder(PaymentStatus::WaitingVerification);
    $finance = User::factory()->finance()->create();
    $proof = PaymentProof::factory()->forPayment($payment)->create();

    $this->actingAs($finance);

    manualPaymentPostWithCsrf(route('admin.orders.payment-proofs.reject', [$order, $proof]), [
        'reason' => 'Nominal transfer belum sesuai invoice.',
    ])->assertRedirect();

    $proof->refresh();
    $payment->refresh();
    $order->refresh();

    expect($proof->status)->toBe(PaymentProofStatus::Rejected)
        ->and($payment->status)->toBe(PaymentStatus::Rejected)
        ->and($payment->verified_by)->toBe($finance->id)
        ->and($payment->rejected_reason)->toBe('Nominal transfer belum sesuai invoice.')
        ->and($order->status)->toBe(OrderStatus::PendingPayment)
        ->and($order->payment_status)->toBe(PaymentStatus::Rejected)
        ->and($order->paid_at)->toBeNull();

    $this->actingAs($user);

    manualPaymentPostWithCsrf(route('reseller.orders.payment-proof.store', $order), [
        'proof' => UploadedFile::fake()->image('replacement-proof.png'),
        'notes' => 'Upload ulang dengan nominal benar.',
    ])->assertRedirect();

    $replacementProof = PaymentProof::query()
        ->whereBelongsTo($order)
        ->whereKeyNot($proof->id)
        ->firstOrFail();

    Storage::disk('local')->assertExists($replacementProof->file_path);

    expect($replacementProof->status)->toBe(PaymentProofStatus::Submitted)
        ->and($replacementProof->notes)->toBe('Upload ulang dengan nominal benar.')
        ->and($payment->refresh()->status)->toBe(PaymentStatus::WaitingVerification)
        ->and($payment->rejected_reason)->toBeNull()
        ->and($order->refresh()->payment_status)->toBe(PaymentStatus::WaitingVerification);
});

it('forbids warehouse users from payment verification routes', function (): void {
    ['order' => $order, 'payment' => $payment] = createManualPaymentOrder(PaymentStatus::WaitingVerification);
    $warehouseUser = User::factory()->warehouse()->create();
    $proof = PaymentProof::factory()->forPayment($payment)->create();

    $this->actingAs($warehouseUser);

    $this->get(route('admin.orders.payment-proofs.show', [$order, $proof]))
        ->assertForbidden();

    manualPaymentPostWithCsrf(route('admin.orders.payment-proofs.approve', [$order, $proof]))
        ->assertForbidden();
});

it('serves stored proofs only through authorized admin verification routes', function (): void {
    Storage::fake('local');

    ['user' => $resellerUser, 'order' => $order, 'payment' => $payment] = createManualPaymentOrder(PaymentStatus::WaitingVerification);
    $finance = User::factory()->finance()->create();
    $proof = PaymentProof::factory()->forPayment($payment)->create([
        'file_path' => 'payment-proofs/'.$order->id.'/proof.pdf',
    ]);

    Storage::disk('local')->put($proof->file_path, 'proof-content');

    $this->actingAs($finance)
        ->get(route('admin.orders.payment-proofs.show', [$order, $proof]))
        ->assertSuccessful();

    $this->actingAs($resellerUser)
        ->get(route('admin.orders.payment-proofs.show', [$order, $proof]))
        ->assertForbidden();
});
