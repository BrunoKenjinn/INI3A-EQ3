<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/testlog', function () {
    try {
        // Teste 1: Escrever num arquivo de texto simples
        Storage::disk('local')->put('teste-de-escrita.txt', 'A escrita direta de arquivo funcionou em: ' . now());

        // Teste 2: Escrever no log
        Log::info('Esta é a nova mensagem de teste do log.');
        
        return 'Teste concluído. Verifique os arquivos.';

    } catch (\Exception $e) {
        // Se houver qualquer erro, vamos tentar registrar e mostrar na tela
        Log::error('Erro na rota /testlog: ' . $e->getMessage());
        return 'Ocorreu um erro: ' . $e->getMessage();
    }
});
