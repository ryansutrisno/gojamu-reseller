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
        Schema::create('point_ledgers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reseller_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('reward_redemption_id')->nullable()->index();
            $table->string('type');
            $table->unsignedInteger('points');
            $table->unsignedInteger('balance_before');
            $table->unsignedInteger('balance_after');
            $table->string('description')->nullable();
            $table->timestamps();

            $table->index(['reseller_id', 'created_at']);
            $table->index(['reseller_id', 'type']);
            $table->index(['order_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_ledgers');
    }
};
