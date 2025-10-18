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
        // Get paginated products with category name
        $limit = intval(request()->query('limit', 20));
        $page = intval(request()->query('page', 1));
        $shopId = request()->query('shop_id');
        $query = Product::with('category');
        if ($shopId) {
            $query->where('ShopID', $shopId);
        }
        $products = $query->skip(($page - 1) * $limit)->take($limit)->get();

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
