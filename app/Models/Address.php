<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'addresses';
    protected $primaryKey = 'AddressID';
    public $timestamps = false;
    protected $fillable = [
        'UserID', 'HouseNumber', 'Street', 'Barangay', 'Municipality', 'ZipCode', 'name'
    ];
}
