<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\Categoria; 
use App\Models\User; 

class CategoriasParaNovoUsuario
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserRegistered $event): void
    {
        $this->copiarCategoriasModeloParaUsuario($event->user);
    }

    private function copiarCategoriasModeloParaUsuario(User $user)
    {
        $categoriasModelo = Categoria::whereNull('user_id')->get();

        if ($categoriasModelo->isEmpty()) {
            return;
        }

        $categoriasParaNovoUsuario = [];
        $timestamp = now();

        foreach ($categoriasModelo as $modelo) {
            $existe = Categoria::where('user_id', $user->id)->where('nome', $modelo->nome)->exists();
            if (!$existe) {
                $categoriasParaNovoUsuario[] = [
                    'nome' => $modelo->nome,
                    'icone' => $modelo->icone,
                    'cor' => $modelo->cor,
                    'user_id' => $user->id,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ];
            }
        }

        if (!empty($categoriasParaNovoUsuario)) {
            Categoria::insert($categoriasParaNovoUsuario);
        }
    }
}
