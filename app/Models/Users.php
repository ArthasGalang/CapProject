<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Users extends Authenticatable
{
	use HasApiTokens;

	protected $table = 'users';
	protected $primaryKey = 'UserID';
	public $timestamps = true;

	protected $fillable = [
		'FirstName',
		'LastName',
		'Email',
		'Password',
		'ContactNumber',
	];

	protected $hidden = [
		'Password',
		'remember_token',
	];
}
