<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'firstName',
        'lastName',
        'email',
        'password',
        'contactNumber',
        'barangay',
        'municipality',
        'zipcode',
        'houseNumber',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
