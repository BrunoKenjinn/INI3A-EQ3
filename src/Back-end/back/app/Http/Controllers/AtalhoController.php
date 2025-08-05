<?php

namespace App\Http\Controllers;

use App\Models\Atalhos;
use Illuminate\Http\Request;


class AtalhoController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $atalhos = Atalhos::where('user_id', $user->id)->get();

        return response()->json($atalhos);
    }


    public function salvar(Request $request)
    {
        $user = $request->user();

        $atalho = new Atalhos();
        $atalho->user_id = $user->id; 
        $atalho->save();

        return response()->json($atalho, 201);
    }


    public function atualizar(Request $request, Atalhos $atalho)
    {
        $user = $request->user();

        if ($atalho->user_id !== $user->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $atalho->update($request);

        return response()->json($atalho);
    }


    public function excluir(Request $request, Atalhos $atalho)
    {
        $user = $request->user();

        if ($atalho->user_id !== $user->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $atalho->delete();

        return response()->json(null, 204);
    }
}
