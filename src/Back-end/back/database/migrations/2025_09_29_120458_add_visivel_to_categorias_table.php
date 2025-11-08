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
        Schema::table('categorias', function (Blueprint $table) {
            Schema::table('categorias', function (Blueprint $table) {
                $table->boolean('visivel')->default(true)->after('cor');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            Schema::table('categorias', function (Blueprint $table) {
                $table->dropColumn('visivel');
            });
        });
    }
};
