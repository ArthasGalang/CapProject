<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';
    protected $primaryKey = 'ReviewID';
    public $timestamps = true;

    protected $fillable = [
        'UserID',
        'ProductID',
        'Rating',
        'Comment',
        'ReviewDate',
    ];
}
