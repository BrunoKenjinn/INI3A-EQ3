<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    public function index(){
        $rows = Categoria::all();
        return view('admin.alunos.index',compact('rows'));
    }

    public function adicionar() {
        return view('admin.alunos.adicionar');
    }

    public function salvar(Request $req) {
        $dados = $req->all();

        Categoria::create($dados);
        return redirect()->route('admin.alunos');
    }

    public function atualizar(Request $req,$id){
        $dados = $req->all();
        Categoria::find($id)->update($dados);
        return redirect()->route('admin.alunos');
    }

    public function editar($id) {
        $linha = Categoria::find($id);
        return view('admin.alunos.editar',compact('linha'));
    }
    public function excluir($id) {
        Categoria::find($id)->delete();
        return redirect()->route('admin.alunos');
    }
}
