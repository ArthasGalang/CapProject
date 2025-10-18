<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';
    protected $primaryKey = 'OrderID';
    protected $fillable = [
        'ShopID', 'UserID', 'AddressID', 'TotalAmount', 'Status', 'OrderDate', 'PaymentMethod', 'BuyerNote', 'PaymentStatus', 'IsPickUp', 'PickUpTime', 'CompletionDate'
    ];
}
