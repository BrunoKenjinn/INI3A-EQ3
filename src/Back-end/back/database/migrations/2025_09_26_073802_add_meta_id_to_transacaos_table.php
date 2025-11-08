<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transacaos', function (Blueprint $table) {
            $table->foreignId('meta_id')
                ->nullable()
                ->constrained('metas')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transacaos', function (Blueprint $table) {
            $table->dropForeign(['meta_id']);
            $table->dropColumn('meta_id');
        });
    }
};
