<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AtalhoController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $atalhos = atalho::where('user_id', $user->id)->get();

        if ($atalhos->isEmpty() && $user->atalhos()->count() === 0) {
            $this->copiaratalhosModeloParaUsuario($user);
            $atalhos = atalho::where('user_id', $user->id)->get();
        }

        return response()->json($atalhos);
    }


    public function salvar(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'nome' => [
                'required',
                'string',
                'max:255',

                Rule::unique('atalhos')->where(function ($query) use ($user) {
                    return $query->where('user_id', $user->id);
                }),
            ],
        ]);

        $atalho = new atalho();
        $atalho->nome = $validatedData['nome'];
        $atalho->user_id = $user->id; 
        $atalho->save();

        return response()->json($atalho, 201);
    }


    public function atualizar(Request $request, atalho $atalho)
    {
        $user = $request->user();

        if ($atalho->user_id !== $user->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $validatedData = $request->validate([
            'nome' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('atalhos')->where(function ($query) use ($user, $atalho) {
                    return $query->where('user_id', $user->id)->where('id', '!=', $atalho->id);
                }),
            ],
        ]);

        $atalho->update($validatedData);

        return response()->json($atalho);
    }


    public function excluir(Request $request, atalho $atalho)
    {
        $user = $request->user();

        if ($atalho->user_id !== $user->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $atalho->delete();

        return response()->json(null, 204);
    }
}
