<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transacao extends Model
{
    use HasFactory;

    protected $table = 'transacaos';

    protected $fillable = [
        'fonte',
        'valor',
        'tipo',
        'data',
        'recorrente',
        'frequencia',
        'proxima_execucao',
        'user_id',
        'categoria_id',
    ];

    protected $casts = [
        'valor' => 'float',
        'recorrente' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }
}
