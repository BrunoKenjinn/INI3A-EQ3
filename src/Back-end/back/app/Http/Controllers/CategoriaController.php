<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CategoriaController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();

        $categorias = Categoria::where('user_id', $user->id)
            ->where('visivel', true)
            ->get();

        return response()->json($categorias);
    }


    public function salvar(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'nome' => [
                'required',
                'string',
                'max:255',

                Rule::unique('categorias')->where(function ($query) use ($user) {
                    return $query->where('user_id', $user->id);
                }),
            ],
            'icone' => 'required|string|max:255',
            'cor' => 'required|string|size:7',
        ]);

        $categoria = new Categoria();
        $categoria->nome = $validatedData['nome'];
        $categoria->icone = $validatedData['icone'];
        $categoria->cor = $validatedData['cor'];
        $categoria->user_id = $user->id;
        $categoria->save();

        return response()->json($categoria, 201);
    }


    public function atualizar(Request $request, Categoria $categoria)
    {
        $user = $request->user();

        if ($categoria->user_id !== $user->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $validatedData = $request->validate([
            'nome' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('categorias')->where(function ($query) use ($user, $categoria) {
                    return $query->where('user_id', $user->id)->where('id', '!=', $categoria->id);
                }),
            ],
            'icone' => 'sometimes|required|string|max:255',
            'cor' => 'sometimes|required|string|size:7',
        ]);

        $categoria->update($validatedData);

        return response()->json($categoria);
    }


    public function excluir(Request $request, Categoria $categoria)
    {
        $user = $request->user();

        if ($categoria->user_id !== $user->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $categoria->delete();

        return response()->json(null, 204);
    }


}