<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User; 

class TransacaoController extends Controller
{
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

    public function listarTransacoes(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'periodo' => 'sometimes|in:semana,mes',
            'tipo' => 'sometimes|in:todos,entrada,saida,recorrente',
        ]);

        $periodo = $request->input('periodo', 'semana');
        $tipo = $request->input('tipo', 'todos');    

        $query = $user->transacoes()
            ->join('categorias', 'transacaos.categoria_id', '=', 'categorias.id')
            ->select(
                'transacaos.id', 
                'transacaos.fonte as descricao', 
                'transacaos.valor', 
                'transacaos.data',
                'transacaos.tipo',
                'categorias.icone', 
                'categorias.cor'
            );

        if ($tipo !== 'todos') {
            $query->where('transacaos.tipo', $tipo);
        } elseif($tipo === 'recorrente'){
            $query->where('transacoes.recorrente', true);
        }

        switch ($periodo) {
            case 'semana':
                $query->whereBetween('transacaos.data', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'mes':
                $query->whereBetween('transacaos.data', [now()->startOfMonth(), now()->endOfMonth()]);
                break;
        }

        $transacoes = $query->orderBy('transacaos.data', 'desc')->get();

        return response()->json($transacoes);
    }
}
