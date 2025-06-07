<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class LoginController extends Controller
{
    public function entrar(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required',
        ]);

        $identifier = $request->input('identifier');
        $loginType = 'login';

        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            $loginType = 'email';
        } elseif (preg_match('/^\d{11}$/', preg_replace('/\D/', '', $identifier))) {
            $loginType = 'cpf';
        }

        $credentials = [
            $loginType => $identifier,
            'password' => $request->input('password')
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login bem-sucedido!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

}
