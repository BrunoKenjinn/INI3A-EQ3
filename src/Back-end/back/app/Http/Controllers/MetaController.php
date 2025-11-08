<?php

namespace App\Http\Controllers;

use App\Models\Meta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Notificacao;
use App\Models\ConfigNotificacao;
use App\Models\Transacao;
use Illuminate\Support\Facades\DB;

class MetaController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();
        $query = $user->metas()->with('transacoes');

        if ($request->query('status') === 'incompletas') {
            $query->where(function ($q) {
                $q->whereExists(function ($sub) {
                    $sub->select(DB::raw(1))
                        ->from('transacaos')
                        ->whereColumn('transacaos.meta_id', 'metas.id')
                        ->havingRaw('SUM(transacaos.valor) < metas.valor_alvo');
                })
                    ->orWhereDoesntHave('transacoes');
            });
        }

        $metas = $query->orderBy('created_at', 'desc')->get();

        $metas = $metas->map(function ($meta) {
            $valorAtual = $meta->transacoes->sum('valor');
            $progresso = 0;
            if ($meta->valor_alvo > 0) {
                $progresso = ($valorAtual / $meta->valor_alvo) * 100;
            }
            $meta->progress = round($progresso);
            $meta->goalAmount = "R$" . number_format($meta->valor_alvo, 2, ',', '.');
            $meta->subtitle = $meta->nome;
            $meta->date = $meta->data_limite ? Carbon::parse($meta->data_limite)->format('d/m/Y') : null;
            $meta->valor_atual = $valorAtual;
            $meta->valor_atual_formatado = "R$" . number_format($valorAtual, 2, ',', '.');
            return $meta;
        });

        return response()->json($metas);
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'valor_alvo' => 'required|numeric|min:0',
            'data_limite' => 'nullable|date',
        ]);
        $user = Auth::user();
        $meta = $user->metas()->create($validatedData);

        $configNotificacao = $user->configNotificacao()->firstOrCreate();
        if ($configNotificacao->todas_ativas && $configNotificacao->lembretes_ativos) {
            if ($user->metas()->count() == 1) {
                Notificacao::create([
                    'user_id' => $user->id,
                    'titulo' => 'Sua primeira meta foi criada!',
                    'mensagem' => "Excelente! Criar metas é o primeiro passo para alcançá-las. Continue assim!",
                ]);
            }
        }

        return response()->json($meta, 201);
    }


    public function show($id)
    {
        $meta = Meta::where('user_id', Auth::id())->findOrFail($id);
        return response()->json($meta);
    }


    public function update(Request $request, $id)
    {
        $meta = Meta::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'valor_alvo' => 'sometimes|required|numeric|min:0',
            'data_limite' => 'nullable|date',
        ]);

        $meta->update($request->only(['nome', 'valor_alvo', 'data_limite']));

        return response()->json($meta);
    }
    public function destroy($id)
    {
        $meta = Meta::where('user_id', Auth::id())->findOrFail($id);
        $meta->delete();

        return response()->json(['message' => 'Meta removida com sucesso']);
    }

    public function getSugestaoInvestimento()
    {
        $user = Auth::user();

        $inicioMesAtual = Carbon::now()->startOfMonth();
        $fimMesAtual = Carbon::now()->endOfMonth();

        $receitaHistorica = Transacao::where('user_id', $user->id)
            ->where('tipo', 'entrada')
            ->where('data', '<', $inicioMesAtual)
            ->whereNull('meta_id')
            ->sum('valor');

        $orcamentoGastosHistorico = $receitaHistorica * 0.70;

        $despesasReaisHistoricas = Transacao::where('user_id', $user->id)
            ->where('tipo', 'saida')
            ->whereNull('meta_id')
            ->where('data', '<', $inicioMesAtual)
            ->whereNull('meta_id')
            ->sum('valor');

        $ajusteHistoricoAcumulado = $orcamentoGastosHistorico - $despesasReaisHistoricas;

        $receitaMesAtual = Transacao::where('user_id', $user->id)
            ->where('tipo', 'entrada')
            ->whereBetween('data', [$inicioMesAtual, $fimMesAtual])
            ->whereNull('meta_id')
            ->sum('valor');

        $despesasAtuais = Transacao::where('user_id', $user->id)
            ->where('tipo', 'saida')
            ->whereNull('meta_id')
            ->whereBetween('data', [$inicioMesAtual, $fimMesAtual])
            ->whereNull('meta_id')
            ->sum('valor');


        $orcamentoMetasBaseAtual = $receitaMesAtual * 0.30;

        $potencialIdeal = $orcamentoMetasBaseAtual + $ajusteHistoricoAcumulado;

        $receitaTotal = $receitaHistorica + $receitaMesAtual;
        $despesasTotais = $despesasReaisHistoricas + $despesasAtuais;
        $saldoTotalDisponivel = $receitaTotal - $despesasTotais;

        $capacidadeReal = $saldoTotalDisponivel;

        $baseSugerida = min($potencialIdeal, $capacidadeReal);

        $jaDepositadoMesAtual = Transacao::where('user_id', $user->id)
            ->whereNotNull('meta_id')
            ->whereBetween('data', [$inicioMesAtual, $fimMesAtual])
            ->sum('valor');

        $sugestaoFinal = $baseSugerida - $jaDepositadoMesAtual;

        return response()->json([
            'receita_mensal' => (float) $receitaMesAtual,
            'valor_sugerido' => max(0, $sugestaoFinal),
            'ajuste_mes_anterior' => (float) $ajusteHistoricoAcumulado,
        ]);
    }
    public function depositarEmMetas(Request $request)
    {
        $validatedData = $request->validate([
            'depositos' => 'required|array',
            'depositos.*.meta_id' => 'required|integer|exists:metas,id',
            'depositos.*.valor' => 'required|numeric|min:0.01',
        ]);

        $user = Auth::user();
        $categoriaInvestimentos = $user->categorias()->where('nome', 'Investimentos')->first();
        if (!$categoriaInvestimentos) {
            return response()->json(['message' => 'A categoria padrão "Investimentos" não foi encontrada.'], 400);
        }

        $configNotificacao = $user->configNotificacao()->firstOrCreate();

        $errors = [];

        foreach ($validatedData['depositos'] as $index => $deposito) {
            $meta = Meta::with('transacoes')
                ->where('id', $deposito['meta_id'])
                ->where('user_id', $user->id)
                ->first();

            if ($meta) {
                $valorAtual = $meta->transacoes->sum('valor');
                $valorRestante = $meta->valor_alvo - $valorAtual;

                if ($valorRestante <= 0) {
                    $errors["depositos.{$index}.valor"] = "A meta '{$meta->nome}' já está completa.";
                    continue;
                }
                if ($deposito['valor'] > $valorRestante) {
                    $errors["depositos.{$index}.valor"] = "O valor para '{$meta->nome}' excede o necessário (restante: R$ " . number_format($valorRestante, 2, ',', '.') . ").";
                    continue;
                }


                Transacao::create([
                    'user_id' => $user->id,
                    'meta_id' => $meta->id,
                    'valor' => $deposito['valor'],
                    'fonte' => 'Depósito para a meta: ' . $meta->nome,
                    'data' => Carbon::now(),
                    'tipo' => 'saida',
                    'categoria_id' => $categoriaInvestimentos->id,
                ]);

                if ($configNotificacao->todas_ativas && $configNotificacao->lembretes_ativos) {
                    $meta->load('transacoes');
                    $valorAtualAposDeposito = $meta->transacoes->sum('valor');
                    $progresso = ($meta->valor_alvo > 0) ? min(100, ($valorAtualAposDeposito / $meta->valor_alvo) * 100) : 0;

                    if ($progresso >= 100) {
                        $titulo = 'Meta Concluída!';
                        $mensagem = "Parabéns! Você atingiu sua meta '{$meta->nome}'.";
                        $notificacaoExistente = Notificacao::where('user_id', $user->id)
                            ->where('titulo', $titulo)
                            ->where('mensagem', $mensagem)
                            ->exists();
                        if (!$notificacaoExistente) {
                            Notificacao::create(['user_id' => $user->id, 'titulo' => $titulo, 'mensagem' => $mensagem]);
                        }
                    }
                }
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }


        return response()->json(['message' => 'Depósitos realizados com sucesso!'], 201);
    }
}
