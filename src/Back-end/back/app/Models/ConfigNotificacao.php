<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfigNotificacao extends Model
{
    use HasFactory;
    protected $table = 'config_notificacoes';
    protected $fillable = [
        'user_id',
        'todas_ativas',
        'lembretes_ativos',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
