<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Transacao;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use App\Models\Notificacao;
use App\Models\ConfigNotificacao;

class TransacaoController extends Controller
{
    public function index(Request $request)
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
                'transacaos.recorrente',
                'transacaos.created_at',
                'categorias.icone',
                'categorias.cor',
                'transacaos.categoria_id',
                'transacaos.frequencia',
            );

        if ($tipo === 'recorrente') {
            $query->where('transacaos.recorrente', true);
        } elseif ($tipo !== 'todos') {
            $query->where('transacaos.tipo', $tipo);
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

    public function store(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'fonte' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0.01',
            'tipo' => ['required', Rule::in(['entrada', 'saida'])],
            'data' => 'required|date_format:Y-m-d',
            'recorrente' => 'sometimes|boolean',
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

        if (!empty($validatedData['recorrente']) && $validatedData['recorrente'] == true) {
            $dataBase = Carbon::createFromFormat('Y-m-d', $validatedData['data']);
            $proximaData = $dataBase->clone();

            switch ($validatedData['frequencia']) {
                case 'diaria':
                    $validatedData['proxima_execucao'] = $proximaData->addDay()->format('Y-m-d');
                    break;
                case 'semanal':
                    $validatedData['proxima_execucao'] = $proximaData->addWeek()->format('Y-m-d');
                    break;
                case 'mensal':
                    $validatedData['proxima_execucao'] = $proximaData->addMonth()->format('Y-m-d');
                    break;
                case 'anual':
                    $validatedData['proxima_execucao'] = $proximaData->addYear()->format('Y-m-d');
                    break;
            }
        }

        $transacao = Transacao::create($validatedData);


        return response()->json($transacao);
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
            'periodo' => 'sometimes|in:hoje,semana,mes',
            'tipo' => 'sometimes|in:entrada,saida'
        ]);

        $periodo = $request->input('periodo', 'mes');
        $tipo = $request->input('tipo', 'saida');

        $query = $user->transacoes()
            ->where('tipo', $tipo)
            ->whereNull('meta_id')
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
            ->where('transacaos.tipo', 'entrada')
            ->whereNull('meta_id')
            ->whereDate('transacaos.data', today())
            ->orderBy('transacaos.created_at', 'desc')
            ->get([
                'transacaos.id',
                'transacaos.fonte as descricao',
                'transacaos.valor',
                'transacaos.data',
                'transacaos.created_at',
                'categorias.icone',
                'categorias.cor'
            ]);

        return response()->json($entradas);
    }

    public function getBalanco(Request $request)
    {
        $user = Auth::user();

        $creditoMes = $user->transacoes()
            ->where('tipo', 'entrada')
            ->whereNull('meta_id')
            ->whereYear('data', now()->year)
            ->whereMonth('data', now()->month)
            ->sum('valor');

        $debitoMes = $user->transacoes()
            ->where('tipo', 'saida')
            ->whereNull('meta_id')
            ->whereYear('data', now()->year)
            ->whereMonth('data', now()->month)
            ->sum('valor');

        $creditoTotal = $user->transacoes()->where('tipo', 'entrada')->whereNull('meta_id')->sum('valor');
        $debitoTotal = $user->transacoes()->where('tipo', 'saida')->whereNull('meta_id')->sum('valor');

        $saldoTotal = ($creditoTotal - $debitoTotal);

        $saldoMensal = $creditoMes - $debitoMes;

        $maiorGasto = $user->transacoes()
            ->where('tipo', 'saida')
            ->whereNull('meta_id')
            ->whereYear('data', now()->year)
            ->whereMonth('data', now()->month)
            ->join('categorias', 'transacaos.categoria_id', '=', 'categorias.id')
            ->select(
                'categorias.nome',
                'categorias.icone',
                'categorias.cor',
                DB::raw('SUM(transacaos.valor) as total')
            )
            ->groupBy('categorias.id', 'categorias.nome', 'categorias.icone', 'categorias.cor')
            ->orderByDesc('total')
            ->first();

        return response()->json([
            'credito_mes'   => (float) $creditoMes,
            'debito_mes'    => (float) $debitoMes,
            'saldo'         => (float) $saldoMensal,
            'saldo_total'   => (float) $saldoTotal,
            'maior_gasto'   => $maiorGasto->nome ?? null,
            'icone_maior_gasto' => $maiorGasto->icone ?? null,
            'cor_maior_gasto'   => $maiorGasto->cor ?? null,
        ]);
    }

    public function getPrincipaisTransacoes(Request $request)
    {
        $user = Auth::user();
        $tipo = $request->query('tipo');

        $query = $user->transacoes()
            ->join('categorias', 'transacaos.categoria_id', '=', 'categorias.id')
            ->orderBy('transacaos.valor', 'desc')
            ->whereNull('meta_id')
            ->limit(5);

        if ($tipo) {
            $query->where('transacaos.tipo', $tipo);
        }

        $transacoes = $query->get([
            'transacaos.id',
            'transacaos.fonte as descricao',
            'transacaos.valor',
            'transacaos.data',
            'transacaos.created_at',
            'transacaos.tipo',
            'categorias.icone',
            'categorias.cor'
        ])->whereNull('meta_id');

        return response()->json($transacoes);
    }
    public function getGastosPorDia(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'tipo' => 'required|in:entrada,saida',
            'periodo' => 'sometimes|in:semana,mes'
        ]);

        $tipo = $request->input('tipo', 'saida');
        $periodo = $request->input('periodo', 'semana');

        $query = $user->transacoes()
            ->where('tipo', $tipo)
            ->whereNull('meta_id')
            ->join('categorias', 'transacaos.categoria_id', '=', 'categorias.id')
            ->select(
                DB::raw('EXTRACT(DOW FROM data) as dia_semana'),
                'categorias.nome as categoria',
                'categorias.cor',
                DB::raw('SUM(transacaos.valor) as total')
            );

        if ($periodo === 'semana') {
            $query->whereBetween('transacaos.data', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($periodo === 'mes') {
            $query->whereYear('transacaos.data', now()->year)
                ->whereMonth('transacaos.data', now()->month);
        }

        $gastos = $query
            ->groupBy('dia_semana', 'categorias.id', 'categorias.nome', 'categorias.cor')
            ->orderBy('dia_semana')
            ->get();

        $dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        $dadosFormatados = [];
        foreach ($dias as $index => $diaNome) {
            $categoriasDia = $gastos->where('dia_semana', $index)->map(function ($item) {
                return [
                    'nome' => $item->categoria,
                    'valor' => (float) $item->total,
                    'cor' => $item->cor
                ];
            })->values();

            $dadosFormatados[] = [
                'dia' => $diaNome,
                'categorias' => $categoriasDia
            ];
        }

        return response()->json($dadosFormatados);
    }

    public function buscar(Request $request)
    {
        $user = Auth::user();

        $query = $user->transacoes()
            ->join('categorias', 'transacaos.categoria_id', '=', 'categorias.id')
            ->select(
                'transacaos.id',
                'transacaos.fonte as descricao',
                'transacaos.valor',
                'transacaos.data',
                'transacaos.tipo',
                'transacaos.recorrente',
                'transacaos.created_at',
                'categorias.icone',
                'categorias.cor'
            );

        if ($request->filled('nome')) {
            $query->where('transacaos.fonte', 'LIKE', '%' . $request->nome . '%');
        }

        if ($request->filled('valor_min')) {
            $query->where('transacaos.valor', '>=', $request->valor_min);
        }

        if ($request->filled('valor_max')) {
            $query->where('transacaos.valor', '<=', $request->valor_max);
        }

        if ($request->filled('categoria_id')) {
            $query->where('transacaos.categoria_id', $request->categoria_id);
        }

        if ($request->filled('tipo') && $request->tipo !== 'todos') {
            if ($request->tipo === 'recorrente') {
                $query->where('transacaos.recorrente', true);
            } else {
                $query->where('transacaos.tipo', $request->tipo);
            }
        }

        if ($request->filled('data_inicio')) {
            $query->whereDate('transacaos.data', '>=', $request->data_inicio);
        }

        if ($request->filled('data_fim')) {
            $query->whereDate('transacaos.data', '<=', $request->data_fim);
        }

        $resultados = $query->orderBy('transacaos.data', 'desc')->get();

        return response()->json($resultados);
    }

    public function getBalancoHistorico(Request $request)
    {
        $ano = $request->get('ano', date('Y'));
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuário não autenticado'], 401);
        }

        try {
            $historico = DB::table('transacaos')
                ->selectRaw('EXTRACT(MONTH FROM data) as mes, SUM(CASE WHEN tipo = \'entrada\' THEN valor ELSE -valor END) as saldo')
                ->where('user_id', $user->id)
                ->whereNull('meta_id')
                ->whereRaw('EXTRACT(YEAR FROM data) = ?', [$ano])
                ->groupBy('mes')
                ->orderBy('mes')
                ->get();

            return response()->json($historico);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar histórico',
                'mensagem' => $e->getMessage()
            ], 500);
        }
    }

    public function getDadosCategoriaEspecifica(Request $request)
    {
        $validatedData = $request->validate([
            'categoria_id' => 'required|integer|exists:categorias,id',
            'mes' => 'required|integer|between:1,12',
            'ano' => 'required|integer|date_format:Y',
            'tipo' => 'required|in:entrada,saida'
        ]);

        $user = Auth::user();

        $transacoesPorDia = DB::table('transacaos')
            ->select(
                DB::raw('EXTRACT(DAY FROM data) as dia'),
                DB::raw('SUM(valor) as total_dia')
            )
            ->where('user_id', $user->id)
            ->WhereNull('meta_id')
            ->where('categoria_id', $validatedData['categoria_id'])
            ->where('tipo', $validatedData['tipo'])
            ->whereYear('data', $validatedData['ano'])
            ->whereMonth('data', $validatedData['mes'])
            ->groupBy('dia')
            ->pluck('total_dia', 'dia');

        $labels = ["1-6", "7-12", "13-18", "19-24", "25-31"];
        $dadosAgrupados = [0, 0, 0, 0, 0];

        foreach ($transacoesPorDia as $dia => $total) {
            $diaInt = (int)$dia;
            if ($diaInt >= 1 && $diaInt <= 6) {
                $dadosAgrupados[0] += $total;
            } elseif ($diaInt >= 7 && $diaInt <= 12) {
                $dadosAgrupados[1] += $total;
            } elseif ($diaInt >= 13 && $diaInt <= 18) {
                $dadosAgrupados[2] += $total;
            } elseif ($diaInt >= 19 && $diaInt <= 24) {
                $dadosAgrupados[3] += $total;
            } elseif ($diaInt >= 25 && $diaInt <= 31) {
                $dadosAgrupados[4] += $total;
            }
        }

        $respostaFormatada = [
            'labels' => $labels,
            'datasets' => [
                [
                    'data' => $dadosAgrupados
                ]
            ]
        ];

        return response()->json($respostaFormatada);
    }
    public function getMaioresTransacoesPorCategoria(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'categoria_id' => 'required|integer|exists:categorias,id',
            'tipo'         => 'required|string|in:entrada,saida',
            'mes'          => 'required|integer|between:1,12',
            'ano'          => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $validatedData = $validator->validated();

            $maioresTransacoes = Transacao::where('user_id', auth()->id())
                ->where('categoria_id', $validatedData['categoria_id'])
                ->where('tipo', $validatedData['tipo'])
                ->WhereNull('meta_id')
                ->whereMonth('data', $validatedData['mes'])
                ->whereYear('data', $validatedData['ano'])
                ->orderBy('valor', 'desc')
                ->take(5)
                ->select('id', 'fonte as descricao', 'valor', 'data')->get();

            return response()->json($maioresTransacoes, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocorreu um erro interno ao buscar as transações.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
