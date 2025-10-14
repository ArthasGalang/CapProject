<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class ProductsController extends Controller
{
    // GET /api/products
    public function index()
    {
        // Get all products with category name
        $products = Product::with('category')->get();

        // Format response for frontend
        $result = $products->map(function($product) {
            return [
                'ProductID' => $product->ProductID ?? $product->id,
                'ProductName' => $product->ProductName ?? $product->name,
                'CategoryName' => $product->category->CategoryName ?? $product->category->name ?? null,
                'Price' => $product->Price ?? $product->price,
                'Image' => $product->Image ?? $product->image,
                'Stock' => $product->Stock ?? $product->stock,
                // Add other fields as needed
            ];
        });

        return response()->json($result);
    }
}
