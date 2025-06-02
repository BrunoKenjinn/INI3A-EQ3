<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/',['as'=>'login.entrar',
'uses'=>'App\Http\Controllers\LoginController@entrar']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/categorias', [CategoriaController::class, 'index'])->name('categorias.index');
Route::post('/categorias', [CategoriaController::class, 'salvar'])->name('categorias.salvar');
Route::put('/categorias/{categoria}', [CategoriaController::class, 'atualizar'])->name('categorias.atualizar'); 
Route::delete('/categorias/{categoria}', [CategoriaController::class, 'excluir'])->name('categorias.excluir'); 

/*Route::middleware('auth:sanctum')->group(function () {
    Route::get('/categorias', [CategoriaController::class, 'index'])->name('categorias.index');
    Route::post('/categorias', [CategoriaController::class, 'salvar'])->name('categorias.salvar');
    Route::put('/categorias/{categoria}', [CategoriaController::class, 'atualizar'])->name('categorias.atualizar'); 
    Route::delete('/categorias/{categoria}', [CategoriaController::class, 'excluir'])->name('categorias.excluir'); 
});*/
