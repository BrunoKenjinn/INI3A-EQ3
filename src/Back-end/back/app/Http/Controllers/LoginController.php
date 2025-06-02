<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function entrar(Request $req) {
        Auth::attempt( [ 'email' => 'teste.bueno@unesp.br', 'password' => '123'] );
    }
}


