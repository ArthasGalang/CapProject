<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $table = 'cart_items';
    protected $primaryKey = 'CartItemID';

    protected $fillable = [
        'UserID',
        'ProductID',
        'ShopID',
        'Quantity',
        'Price',
        'Subtotal',
        'Options',
    ];
}
