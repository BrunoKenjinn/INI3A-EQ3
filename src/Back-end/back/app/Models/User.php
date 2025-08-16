<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     * 
     */

    protected $appends = ['idade']; // Adiciona o campo extra na resposta JSON

    public function getIdadeAttribute()
    {
        return $this->data_nascimento 
            ? Carbon::parse($this->data_nascimento)->age 
            : null;
    }

    protected $fillable = [
        'nome',
        'email',
        'cpf',
        'celular',
        'data_nascimento',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function categorias()
    {
        return $this->hasMany(Categoria::class);
    }

    public function transacoes()
    {
        return $this->hasMany(Transacao::class);
    }
}
