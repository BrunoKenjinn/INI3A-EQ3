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
}
