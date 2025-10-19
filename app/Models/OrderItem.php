<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'order_items';
    protected $primaryKey = 'OrderItemID';
    protected $fillable = [
        'OrderID', 'ProductID', 'Quantity', 'Subtotal'
    ];
    // Relationship: OrderItem belongs to Product
    public function product()
    {
        return $this->belongsTo(\App\Models\Product::class, 'ProductID', 'ProductID');
    }
}
