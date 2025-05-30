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
        $dados=['nome'=>"Thomaz", 'email'=>"thomaz.bueno@unesp.br",'cpf'=>"212",'celular'=>"9999",'data_nascimento'=>'12/12/12','password'=>bcrypt("123")];
        User::create($dados);
    }
}
