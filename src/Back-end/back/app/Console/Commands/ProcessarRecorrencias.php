<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Transacao;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessarRecorrencias extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'recorrencias:processar';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Processa as transações recorrentes para criar os lançamentos que venceram.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('Iniciando o processamento de transações recorrentes...');
        $this->info('Iniciando o processamento de transações recorrentes...');

        $transacoesModelo = Transacao::where('recorrente', true)
            ->whereNotNull('proxima_execucao')
            ->whereDate('proxima_execucao', '<=', Carbon::today())
            ->get();

        if ($transacoesModelo->isEmpty()) {
            Log::info('Nenhuma transação recorrente para processar hoje.');
            $this->info('Nenhuma transação recorrente para processar hoje.');
            return 0; 
        }

        $this->info("Encontradas {$transacoesModelo->count()} transações para processar.");

        foreach ($transacoesModelo as $modelo) {
            DB::transaction(function () use ($modelo) {
                $novaTransacao = $modelo->replicate(); 
                $novaTransacao->data = $modelo->proxima_execucao; 
                $novaTransacao->recorrente = true; 
                $novaTransacao->frequencia = null;
                $novaTransacao->proxima_execucao = null;
                $novaTransacao->save();

                $proximaData = Carbon::parse($modelo->proxima_execucao);
                switch ($modelo->frequencia) {
                    case 'diaria':
                        $modelo->proxima_execucao = $proximaData->addDay();
                        break;
                    case 'semanal':
                        $modelo->proxima_execucao = $proximaData->addWeek();
                        break;
                    case 'mensal':
                        $modelo->proxima_execucao = $proximaData->addMonth();
                        break;
                    case 'anual':
                        $modelo->proxima_execucao = $proximaData->addYear();
                        break;
                }
                $modelo->save();

                Log::info("Transação recorrente #{$modelo->id} processada. Nova transação #{$novaTransacao->id} criada. Próxima execução em: {$modelo->proxima_execucao->toDateString()}");
            });
        }

        $this->info('Processamento de transações recorrentes finalizado com sucesso.');
        Log::info('Processamento de transações recorrentes finalizado.');
        return 0; 
    }
}
