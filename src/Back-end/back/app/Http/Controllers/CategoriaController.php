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

        $categorias = Categoria::where('user_id', $user->id)->get();

        if ($categorias->isEmpty() && $user->categorias()->count() === 0) {
            $this->copiarCategoriasModeloParaUsuario($user);
            $categorias = Categoria::where('user_id', $user->id)->get();
        }

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
        ]);

        $categoria = new Categoria();
        $categoria->nome = $validatedData['nome'];
        $categoria->icone = $validatedData['icone'];
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