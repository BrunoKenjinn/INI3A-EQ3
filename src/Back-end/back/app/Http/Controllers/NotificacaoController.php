<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notificacao;

class NotificacaoController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'status' => 'in:lidas,nao_lidas',
        ]);

        $statusLida = $request->query('status') === 'lidas';

        $notificacoes = Notificacao::where('user_id', $user->id)
            ->where('lida', $statusLida)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $notificacoes->transform(function ($item) {
            $item->descricao = $item->mensagem;
            unset($item->mensagem);
            $item->data_criacao = $item->created_at; 
            return $item;
        });

        return response()->json($notificacoes);
    }
    
    public function marcarComoLida(Notificacao $notificacao)
    {
        if ($notificacao->user_id !== Auth::id()) {
            return response()->json(['error' => 'Não autorizado'], 403);
        }

        $notificacao->update(['lida' => true]);

        return response()->json(['message' => 'Notificação marcada como lida.']);
    }
}