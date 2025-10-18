<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;

class CartController extends Controller
{
    public function getCheckoutItems(Request $request)
    {
        $ids = $request->query('ids');
        if (!$ids) {
            return response()->json([]);
        }
        $idArray = explode(',', $ids);
        $items = CartItem::whereIn('CartItemID', $idArray)
            ->leftJoin('products', 'cart_items.ProductID', '=', 'products.ProductID')
            ->select('cart_items.*', 'products.ProductName', 'products.Image')
            ->get();
        return response()->json($items);
    }
}
