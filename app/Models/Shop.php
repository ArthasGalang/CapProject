<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
	protected $table = 'shops';
	protected $primaryKey = 'ShopID';
	protected $fillable = [
		'UserID', 'ShopName', 'ShopDescription', 'LogoImage', 'BackgroundImage', 'Address', 'BusinessPermit', 'isVerified', 'hasPhysical'
	];
}
