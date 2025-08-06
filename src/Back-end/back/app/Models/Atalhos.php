<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atalhos extends Model
{
    protected $fillable = [
        'nome', 'icone', 'rota','user_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
