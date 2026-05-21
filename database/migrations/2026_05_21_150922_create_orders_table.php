<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('reseller_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->index();
            $table->string('payment_status')->index();
            $table->string('shipment_status')->index();
            $table->unsignedInteger('total_qty');
            $table->foreignId('price_tier_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('price_per_pcs');
            $table->unsignedBigInteger('subtotal');
            $table->unsignedBigInteger('shipping_cost')->default(0);
            $table->unsignedBigInteger('discount_amount')->default(0);
            $table->unsignedBigInteger('total_amount');
            $table->unsignedInteger('potential_points');
            $table->unsignedInteger('earned_points')->default(0);
            $table->unsignedBigInteger('point_rule_id')->nullable();
            $table->text('reseller_notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('ordered_at');
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
