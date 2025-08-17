<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User; 

class TransacaoController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'fonte' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0.01',
            'tipo' => ['required', Rule::in(['entrada', 'saida'])],
            'data' => 'required|date',
            'recorrente' => 'boolean',
            'frequencia' => 'nullable|required_if:recorrente,true|in:diaria,semanal,mensal,anual',
            'proxima_execucao' => 'nullable|date',
            'categoria_id' => [
                'required',
                Rule::exists('categorias', 'id')->where(function ($query) use ($user) {
                    $query->where('user_id', $user->id)->orWhereNull('user_id');
                }),
            ],
        ]);

        $validatedData['user_id'] = $user->id;

        $transacao = Transacao::create($validatedData);

        return response()->json($transacao, 201);
    }

        public function update(Request $request, Transacao $transacao)
    {
        $user = $request->user();

        if ($transacao->user_id !== $user->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $validatedData = $request->validate([
            'fonte' => 'sometimes|required|string|max:255',
            'valor' => 'sometimes|required|numeric|min:0.01',
            'tipo' => ['sometimes', 'required', Rule::in(['entrada', 'saida'])],
            'data' => 'sometimes|required|date',
            'recorrente' => 'boolean',
            'frequencia' => 'nullable|required_if:recorrente,true|in:diaria,semanal,mensal,anual',
            'proxima_execucao' => 'nullable|date',
            'categoria_id' => [
                'sometimes',
                'required',
                Rule::exists('categorias', 'id')->where(function ($query) use ($user, $transacao) {
                    $query->where('user_id', $user->id)->orWhereNull('user_id');
                }),
            ],
        ]);

        $transacao->update($validatedData);

        return response()->json($transacao);
    }

    public function destroy(Request $request, Transacao $transacao)
    {
        $user = $request->user();

        if ($transacao->user_id !== $user->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $transacao->delete();

        return response()->json(null, 204);
    }


    public function getGastosPorCategoria(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'periodo' => 'sometimes|in:hoje,semana,mes'
        ]);

        $periodo = $request->input('periodo', 'mes'); 

        $query = $user->transacoes()
            ->where('tipo', 'saida') 
            ->join('categorias', 'transacaos.categoria_id', '=', 'categorias.id')
            ->select(
                'categorias.nome as categoria_nome',
                'categorias.cor as categoria_cor',
                DB::raw('SUM(transacaos.valor) as total_gasto')
            );

        switch ($periodo) {
            case 'hoje':
                $query->whereDate('transacaos.data', today());
                break;
            case 'semana':
                $query->whereBetween('transacaos.data', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'mes':
                $query->whereYear('transacaos.data', now()->year)
                      ->whereMonth('transacaos.data', now()->month);
                break;
        }

        $gastos = $query->groupBy('categorias.id', 'categorias.nome', 'categorias.cor')->get();

        $dadosFormatados = $gastos->map(function ($item) {
            return [
                'name' => $item->categoria_nome,
                'population' => (float) $item->total_gasto,
                'color' => $item->categoria_cor, 
                'legendFontColor' => "#7F7F7F",
                'legendFontSize' => 15
            ];
        });

        return response()->json($dadosFormatados);
    }

    public function getEntradasHoje(Request $request)
    {
        $user = Auth::user();

        $entradas = $user->transacoes()
            ->join('categorias', 'transacaos.categoria_id', '=', 'categorias.id')
            ->where('transacaos.tipo', 'saida') 
            ->whereDate('transacaos.data', today()) 
            ->orderBy('transacaos.created_at', 'desc') 
            ->get([
                'transacaos.id', 
                'transacaos.fonte as descricao', 
                'transacaos.valor', 
                'transacaos.created_at as data',
                'categorias.icone', 
                'categorias.cor'    
        ]);

        return response()->json($entradas);
    }
}
