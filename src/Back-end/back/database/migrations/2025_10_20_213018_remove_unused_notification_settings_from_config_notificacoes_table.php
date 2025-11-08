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
        Schema::table('config_notificacoes', function (Blueprint $table) {
            $table->dropColumn(['som_ativo', 'vibracao_ativa', 'push_ativo', 'email_ativo', 'modo_silencioso']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('config_notificacoes', function (Blueprint $table) {
            //
        });
    }
};
