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
                'nome'=>"Thomaz",
                'email'=>"thomaz.bueno@unesp.br",
                'cpf'=>"21211111111",
                'celular'=>"99299",
                'data_nascimento'=>'2012-12-12', // Formato YYYY-MM-DD
                'password'=>bcrypt("123"),
                'foto'=>"",
            ];
        User::create($dados);
    }
}
