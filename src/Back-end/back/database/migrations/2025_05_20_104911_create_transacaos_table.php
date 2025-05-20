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
        Schema::create('transacaos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('fonte');
            $table->decimal('valor', 10, 2);
            $table->enum('tipo', ['entrada', 'saida']); 
            $table->date('data'); 
            $table->boolean('recorrente')->default(false);
            $table->enum('frequencia', ['diaria', 'semanal', 'mensal', 'anual'])->nullable();
            $table->date('proxima_execucao')->nullable();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('categoria_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transacaos');
    }
};
