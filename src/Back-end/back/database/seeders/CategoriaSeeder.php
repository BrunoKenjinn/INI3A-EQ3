<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoriasModelo = [
            ['nome' => 'Alimentação',   'icone' => 'cutlery'],
            ['nome' => 'Transporte',    'icone' => 'bus'],
            ['nome' => 'Saúde',         'icone' => 'heart'],
            ['nome' => 'Despesas',      'icone' => 'file-text'],
            ['nome' => 'Moradia',       'icone' => 'home'],
            ['nome' => 'Educação',      'icone' => 'graduation-cap'],
            ['nome' => 'Lazer',         'icone' => 'smile-o'],
            ['nome' => 'Investimentos', 'icone' => 'line-chart'],
        ];

        foreach ($categoriasModelo as $categoria) {
            Categoria::updateOrCreate(
                [
                    'nome' => $categoria['nome'],
                    'user_id' => null 
                ],
                [
                    'icone' => $categoria['icone'] 
                ]
            );
        }
    }
}
