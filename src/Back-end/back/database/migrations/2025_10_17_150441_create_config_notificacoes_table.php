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
        Schema::create('config_notificacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('todas_ativas')->default(true);
            $table->boolean('som_ativo')->default(true);
            $table->boolean('vibracao_ativa')->default(true);
            $table->boolean('push_ativo')->default(true);
            $table->boolean('email_ativo')->default(false);
            $table->boolean('lembretes_ativos')->default(true);
            $table->boolean('modo_silencioso')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('config_notificacoes');
    }
};
