<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class UsuarioController extends Controller
{
    public function registrar(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nome'              => 'required|string|max:255',
                'email'             => 'required|string|email|max:255|unique:users',
                'cpf'               => 'required|string|size:11|unique:users',
                'celular'           => 'required|string|max:15',
                'data_nascimento'   => 'required|date_format:d/m/Y|before:today',
                'password'          => 'required|string|min:6|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = User::create([
                'nome'              => $request->nome,
                'email'             => $request->email,
                'cpf'               => $request->cpf,
                'celular'           => $request->celular,
                'data_nascimento'   => Carbon::createFromFormat('d/m/Y', $request->data_nascimento)->format('Y-m-d'),
                'password'          => Hash::make($request->password),
            ]);

            return response()->json(['message' => 'Usuário cadastrado com sucesso.'], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro interno no servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        return response()->json($request->user());
    }

    public function atualizar(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'cpf' => [
                'sometimes',
                'required',
                'string',
                'size:11',
                Rule::unique('users')->ignore($user->id),
            ],
            'celular' => 'sometimes|required|string|max:15',
            'data_nascimento' => 'sometimes|required|date_format:d/m/Y|before:today',
            'password' => 'sometimes|nullable|string|min:6|confirmed',
        ]);

        if (isset($validated['data_nascimento'])) {
            $validated['data_nascimento'] = Carbon::createFromFormat('d/m/Y', $validated['data_nascimento'])->format('Y-m-d');
        }

        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function excluir(Request $request)
    {
        $user = $request->user();
        $user->delete();

        return response()->json(null, 204);
    }
    public function definirSaldoInicial(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'saldo_inicial' => 'required|numeric'
        ]);

        if ($user->saldo_inicial !== null) {
            return response()->json(['message' => 'Saldo inicial já definido.'], 400);
        }

        $user->saldo_inicial = $validated['saldo_inicial'];
        $user->save();

        return response()->json(['message' => 'Saldo inicial definido com sucesso!', 'user' => $user]);
    }
}
