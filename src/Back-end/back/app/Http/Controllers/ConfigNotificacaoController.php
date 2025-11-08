<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ConfigNotificacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConfigNotificacaoController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        $configs = ConfigNotificacao::firstOrCreate(
            ['user_id' => $user->id]
        );

        if ($configs->wasRecentlyCreated) {
            $configs->refresh();
        }

        return response()->json($configs);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'todas_ativas' => 'required|boolean',
            'lembretes_ativos' => 'required|boolean',
        ]);

        $configs = ConfigNotificacao::updateOrCreate(
            ['user_id' => $user->id],
            $validatedData
        );

        return response()->json($configs);
    }
}