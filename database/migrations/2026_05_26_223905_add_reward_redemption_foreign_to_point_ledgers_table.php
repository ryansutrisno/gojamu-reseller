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
        Schema::table('point_ledgers', function (Blueprint $table) {
            $table->foreign('reward_redemption_id')
                ->references('id')
                ->on('reward_redemptions')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('point_ledgers', function (Blueprint $table) {
            $table->dropForeign(['reward_redemption_id']);
        });
    }
};
