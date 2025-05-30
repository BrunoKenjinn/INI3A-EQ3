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
        $dados = [
            ['nome' => 'Alimentação',   'icone' => 'MaterialCommunityIcons/silverware-fork-knife', 'user_id' => null],
            ['nome' => 'Transporte',    'icone' => 'MaterialCommunityIcons/bus-outline', 'user_id' => null],
            ['nome' => 'Saúde',         'icone' => 'MaterialCommunityIcons/hospital-box-outline', 'user_id' => null],
            ['nome' => 'Despesas',      'icone' => 'MaterialCommunityIcons/receipt-text-outline', 'user_id' => null],
            ['nome' => 'Moradia',       'icone' => 'MaterialCommunityIcons/home-outline', 'user_id' => null],
            ['nome' => 'Educação',      'icone' => 'MaterialCommunityIcons/school-outline', 'user_id' => null],
            ['nome' => 'Lazer',         'icone' => 'MaterialCommunityIcons/gamepad-variant-outline', 'user_id' => null],
            ['nome' => 'Investimentos', 'icone' => 'MaterialCommunityIcons/chart-line', 'user_id' => null],
        ];
        Categoria::updateOrCreate($dados);
    }
}
