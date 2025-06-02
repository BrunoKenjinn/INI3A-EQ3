<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            $dados=[
                'nome'=>"Thomazz",
                'email'=>"teste.bueno@unesp.br",
                'cpf'=>"212111111111",
                'celular'=>"99299",
                'data_nascimento'=>'2012-12-12', // Formato YYYY-MM-DD
                'password'=>bcrypt("123")
            ];
        User::create($dados);
    }
}
