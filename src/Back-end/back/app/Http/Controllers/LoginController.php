<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Lida com a tentativa de login de um utilizador, aceitando email, login (username) ou CPF.
     * Rota: POST /api/login
     */
    public function entrar(Request $request)
    {
        // 1. Validar os dados recebidos do formulário do React.
        // O frontend deve enviar 'identifier' e 'password'.
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required',
        ]);

        // 2. Determinar qual campo usar para o login (email, login ou cpf).
        $identifier = $request->input('identifier');

        // Assume 'login' como padrão, depois verifica se é um email ou um CPF.
        $loginType = 'login'; 
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            $loginType = 'email';
        } elseif (is_numeric(preg_replace('/[^0-9]/', '', $identifier))) {
            // Se o campo for numérico (após remover caracteres como . e -), assume que é um CPF.
            $loginType = 'cpf';
        }
        
        // 3. Preparar as credenciais para a tentativa de autenticação.
        $credentials = [
            $loginType => $identifier,
            'password' => $request->input('password')
        ];

        // 4. Tentar autenticar o usuário.
        if (!Auth::attempt($credentials)) {
            // Se a autenticação falhar, retorna um erro JSON.
            return response()->json([
                'message' => 'As credenciais fornecidas estão incorretas.'
            ], 401);
        }

        // 5. Se a autenticação for bem-sucedida, obter o utilizador autenticado.
        $user = Auth::user();

        // 6. Criar um token de API para o usuário (usando Laravel Sanctum).
        // Isto agora funciona porque o Model User tem o trait HasApiTokens.
        $token = $user->createToken('auth_token')->plainTextToken;

        // 7. Retornar uma resposta JSON com o token e os dados do usuário.
        return response()->json([
            'message' => 'Login bem-sucedido!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Lida com o logout do usuário.
     * Rota: POST /api/logout (deve ser protegida por autenticação)
     */
    public function sair(Request $request)
    {
        // 1. Revoga o token que foi usado para fazer esta requisição.
        $request->user()->currentAccessToken()->delete();

        // 2. Retorna uma resposta JSON de sucesso.
        return response()->json([
            'message' => 'Logout realizado com sucesso.'
        ]);
    }
}
