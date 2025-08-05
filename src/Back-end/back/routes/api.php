<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UsuarioController;

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

Route::post('/register', [UsuarioController::class, 'registrar'])->name('usuario.registrar');

Route::post('/login', [LoginController::class, 'entrar']);

Route::middleware('auth:sanctum')->group(function () {
    //usuario
    Route::get('/usuario', [UsuarioController::class, 'index'])->name('usuario.index');
    Route::put('/usuario', [UsuarioController::class, 'atualizar'])->name('usuario.atualizar');
    Route::delete('/usuario', [UsuarioController::class, 'excluir'])->name('usuario.excluir');
    
    //home
    Route::get('/atalhos', [CategoriaController::class, 'index'])->name('atalhos.index');
    Route::post('/atalhos', [CategoriaController::class, 'salvar'])->name('atalhos.salvar');
    Route::put('/atalhos/{atalho}', [CategoriaController::class, 'atualizar'])->name('atalhos.atualizar'); 
    Route::delete('/atalhos/{atalho}', [CategoriaController::class, 'excluir'])->name('atalhos.excluir');

    //categorias
    Route::get('/categorias', [CategoriaController::class, 'index'])->name('categorias.index');
    Route::post('/categorias', [CategoriaController::class, 'salvar'])->name('categorias.salvar');
    Route::put('/categorias/{categoria}', [CategoriaController::class, 'atualizar'])->name('categorias.atualizar'); 
    Route::delete('/categorias/{categoria}', [CategoriaController::class, 'excluir'])->name('categorias.excluir');

    Route::post('/logout', [LoginController::class, 'sair']);

    
});
