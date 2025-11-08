<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Notificacao;
use App\Models\ConfigNotificacao;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class VerificarFinancasUsuarios extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:verificar-financas-usuarios';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica finanças dos usuários e cria notificações agendadas.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando verificação...');
        $hoje = Carbon::now();
        $usuarios = User::with('configNotificacao')->get();

        foreach ($usuarios as $user) {
            $config = $user->configNotificacao()->firstOrCreate();
            if (!$config->todas_ativas || !$config->lembretes_ativos) continue;

            if ($hoje->day == 1) {
                $this->verificarResultadosMesAnterior($user); 
            }

            if ($hoje->day == 25) { 
                $this->verificarGastoExcessivoMesAtual($user);
            }

            $this->verificarMetasProximas($user, $hoje);
            $this->verificarContasRecorrentes($user, $hoje);

            if ($hoje->dayOfWeek == Carbon::SUNDAY) $this->verificarGastoSemanalCategoria($user);
        }
        $this->info('Verificação concluída.');
    }

    private function verificarResultadosMesAnterior(User $user)
    {
        $mesAnterior = Carbon::now()->subMonth();
        $inicioMesAnterior = $mesAnterior->copy()->startOfMonth();
        $fimMesAnterior = $mesAnterior->copy()->endOfMonth();

        $rendaMesAnterior = $user->transacoes()->where('tipo', 'entrada')->whereNull('meta_id')->whereBetween('data', [$inicioMesAnterior, $fimMesAnterior])->sum('valor');
        $gastosMesAnterior = $user->transacoes()->where('tipo', 'saida')->whereNull('meta_id')->whereBetween('data', [$inicioMesAnterior, $fimMesAnterior])->sum('valor');
        $balanco = $rendaMesAnterior - $gastosMesAnterior;
        $mesStr = $mesAnterior->translatedFormat('F');

        $tituloBalanço = "Balanço de {$mesStr}";
        $mensagemBalanço = $balanco >= 0
            ? "Você fechou o mês com saldo positivo de R$ " . number_format($balanco, 2, ',', '.')
            : "Atenção! Você fechou o mês com saldo negativo de R$ " . number_format(abs($balanco), 2, ',', '.');

        if (Notificacao::where('user_id', $user->id)->where('titulo', $tituloBalanço)->whereMonth('created_at', Carbon::now()->month)->doesntExist()) {
            Notificacao::create(['user_id' => $user->id, 'titulo' => $tituloBalanço, 'mensagem' => $mensagemBalanço]);
        }

        if ($rendaMesAnterior > 0) {
            $percentualGastoAnterior = ($gastosMesAnterior / $rendaMesAnterior) * 100;
            $percentualSobraAnterior = 100 - $percentualGastoAnterior;

            if ($percentualSobraAnterior > 35) {
                $tituloSobra = "Resultado de {$mesStr}: Economia Acima de 30%";
                $mensagemSobra = "Parabéns! No mês de {$mesStr}, você utilizou apenas " . number_format($percentualGastoAnterior, 0) . "% da sua renda para gastos, sobrando " . number_format($percentualSobraAnterior, 0) . "%. Ótimo resultado!";
                if (Notificacao::where('user_id', $user->id)->where('titulo', $tituloSobra)->whereMonth('created_at', Carbon::now()->month)->doesntExist()) {
                    Notificacao::create(['user_id' => $user->id, 'titulo' => $tituloSobra, 'mensagem' => $mensagemSobra]);
                }
            }
        }
    }

    private function verificarGastoExcessivoMesAtual(User $user)
    {
        $inicioMes = Carbon::now()->startOfMonth();
        $fimMes = Carbon::now();
        $rendaMes = $user->transacoes()->where('tipo', 'entrada')->whereNull('meta_id')->whereBetween('data', [$inicioMes, $fimMes])->sum('valor');
        $gastosMes = $user->transacoes()->where('tipo', 'saida')->whereNull('meta_id')->whereBetween('data', [$inicioMes, $fimMes])->sum('valor');

        if ($rendaMes > 0) {
            $percentualGasto = ($gastosMes / $rendaMes) * 100;
            if ($percentualGasto > 70) {
                $titulo = 'Alerta: Gastos Acima do Limite (70%)';
                $mensagem = "Atenção! Você já utilizou " . number_format($percentualGasto, 0) . "% da sua renda mensal para gastos.";
                if (Notificacao::where('user_id', $user->id)->where('titulo', $titulo)->whereMonth('created_at', Carbon::now()->month)->doesntExist()) {
                    Notificacao::create(['user_id' => $user->id, 'titulo' => $titulo, 'mensagem' => $mensagem]);
                }
            }
        }
    }

    private function verificarMetasProximas(User $user, Carbon $hoje)
    {
        $dataAlvo = $hoje->copy()->addDays(7)->toDateString();
        $metas = $user->metas()->with('transacoes')->whereDate('data_limite', $dataAlvo)->get();

        foreach ($metas as $meta) {
            $valorAtual = $meta->transacoes->sum('valor');
            if ($valorAtual < $meta->valor_alvo) {
                $titulo = 'Meta próxima do vencimento!';
                $mensagem = "Atenção! Sua meta '{$meta->nome}' vence em 7 dias. Faltam R$ " . number_format($meta->valor_alvo - $valorAtual, 2, ',', '.');
                if (Notificacao::where('user_id', $user->id)->where('titulo', $titulo)->where('mensagem', $mensagem)->whereDate('created_at', $hoje)->doesntExist()) {
                    Notificacao::create(['user_id' => $user->id, 'titulo' => $titulo, 'mensagem' => $mensagem]);
                }
            }
        }
    }

    private function verificarContasRecorrentes(User $user, Carbon $hoje)
    {
        $dataAlvo = $hoje->copy()->addDays(2)->toDateString();
        $contas = $user->transacoes()->where('recorrente', true)->whereDate('proxima_execucao', $dataAlvo)->get();

        foreach ($contas as $conta) {
            $titulo = 'Lembrete de Conta';
            $mensagem = "Sua conta recorrente '{$conta->fonte}' no valor de R$ " . number_format($conta->valor, 2, ',', '.') . " vence em 2 dias.";
            if (Notificacao::where('user_id', $user->id)->where('titulo', $titulo)->where('mensagem', $mensagem)->whereDate('created_at', $hoje)->doesntExist()) {
                Notificacao::create(['user_id' => $user->id, 'titulo' => $titulo, 'mensagem' => $mensagem]);
            }
        }
    }
    private function verificarGastoSemanalCategoria(User $user)
    {
        $inicioSemana = Carbon::now()->startOfWeek();
        $fimSemana = Carbon::now()->endOfWeek();
        $gastoCategoria = $user->transacoes()
            ->where('tipo', 'saida')->whereNull('meta_id')->whereBetween('data', [$inicioSemana, $fimSemana])
            ->join('categorias', 'transacaos.categoria_id', '=', 'categorias.id')
            ->select('categorias.nome as categoria_nome', DB::raw('SUM(transacaos.valor) as total_gasto'))
            ->groupBy('categorias.nome')->orderByDesc('total_gasto')->first();

        if ($gastoCategoria) {
            $titulo = 'Resumo da Semana';
            $mensagem = "Sua categoria com mais gastos nesta semana foi '{$gastoCategoria->categoria_nome}', totalizando R$ " . number_format($gastoCategoria->total_gasto, 2, ',', '.');
            if (Notificacao::where('user_id', $user->id)->where('titulo', $titulo)->whereBetween('created_at', [$inicioSemana, $fimSemana])->doesntExist()) {
                Notificacao::create(['user_id' => $user->id, 'titulo' => $titulo, 'mensagem' => $mensagem]);
            }
        }
    }
}
