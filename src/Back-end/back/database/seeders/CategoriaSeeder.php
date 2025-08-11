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
            ['nome' => 'Alimentação',  'icone' => 'cutlery',       'cor' => '#FF6384'],
            ['nome' => 'Transporte',    'icone' => 'bus',           'cor' => '#36A2EB'],
            ['nome' => 'Saúde',         'icone' => 'heart',         'cor' => '#E74C3C'],
            ['nome' => 'Despesas',      'icone' => 'file-text',     'cor' => '#95A5A6'],
            ['nome' => 'Moradia',       'icone' => 'home',          'cor' => '#F39C12'],
            ['nome' => 'Educação',      'icone' => 'graduation-cap','cor' => '#9B59B6'],
            ['nome' => 'Lazer',         'icone' => 'smile-o',       'cor' => '#4BC0C0'],
            ['nome' => 'Investimentos', 'icone' => 'line-chart',    'cor' => '#2ECC71'],
        ];

        foreach ($categoriasModelo as $categoria) {
            Categoria::updateOrCreate(
                [
                    'nome' => $categoria['nome'],
                    'user_id' => null 
                ],
                [
                    'icone' => $categoria['icone'],
                    'cor' => $categoria['cor']
                ]
            );
        }
    }
}
