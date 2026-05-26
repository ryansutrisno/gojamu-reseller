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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->text('recipient_address');
            $table->string('recipient_city');
            $table->string('recipient_province');
            $table->string('recipient_postal_code')->nullable();
            $table->string('courier')->nullable();
            $table->string('service')->nullable();
            $table->string('tracking_number')->nullable()->index();
            $table->unsignedBigInteger('shipping_cost')->default(0);
            $table->string('status')->index();
            $table->string('provider')->nullable();
            $table->string('external_shipment_id')->nullable();
            $table->string('label_url')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
