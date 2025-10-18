<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'ProductID';
    public $timestamps = true;
    protected $fillable = [
        'ShopID', 'CategoryID', 'SKU', 'ProductName', 'Description', 'Price', 'Stock', 'Image', 'AdditionalImages', 'Status',
        'SoldAmount', 'Discount', 'IsFeatured', 'Attributes', 'PublishedAt', 'IsActive', 'BoughtBy', 'Tags'
    ];
}
