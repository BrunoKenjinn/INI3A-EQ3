<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\User;
use Illuminate\Support\Facades\Validator;


class UsuarioController extends Controller
{
    public function registrar(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nome'            => 'required|string|max:255',
                'email'           => 'required|string|email|max:255|unique:users',
                'cpf'             => 'required|string|size:11|unique:users',
                'celular'         => 'required|string|max:15',
                'data_nascimento' => 'required|date|before:today',
                'password'        => 'required|string|min:6|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = User::create([
                'nome'            => $request->nome,
                'login'           => $request->nome,
                'email'           => $request->email,
                'cpf'             => $request->cpf,
                'celular'         => $request->celular,
                'data_nascimento' => $request->data_nascimento,
                'password'        => Hash::make($request->password),
            ]);

            return response()->json(['message' => 'Usuário cadastrado com sucesso.'], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro interno no servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Ver dados do próprio usuário
    public function index(Request $request)
    {
        return response()->json($request->user());
    }

    // Atualizar dados do próprio usuário
    public function atualizar(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes', 'required', 'email', 'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'sometimes|required|string|min:6|confirmed',
        ]);

        if (isset($validated['nome'])) {
            $user->nome = $validated['nome'];
        }

        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json($user);
    }

    // Excluir a própria conta
    public function excluir(Request $request)
    {
        $user = $request->user();
        $user->delete();

        return response()->json(null, 204);
    }
}