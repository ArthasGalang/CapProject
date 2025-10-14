<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $primaryKey = 'UserID';

    protected $fillable = [
        'FirstName',
        'LastName',
        'email',
        'Password',
        'ContactNumber',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
