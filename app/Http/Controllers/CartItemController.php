<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;

class CartItemController extends Controller
{
    // POST /api/cart-items
    public function store(Request $request)
    {
        $validated = $request->validate([
            'UserID' => 'required|integer|exists:users,UserID',
            'ProductID' => 'required|integer|exists:products,ProductID',
            'ShopID' => 'required|integer|exists:shops,ShopID',
            'Quantity' => 'required|integer|min:1',
            'Price' => 'required|numeric',
            'Subtotal' => 'required|numeric',
            'Options' => 'nullable|json',
        ]);

        // Check if the product is already in the user's cart
        $existing = CartItem::where('UserID', $validated['UserID'])
            ->where('ProductID', $validated['ProductID'])
            ->where('ShopID', $validated['ShopID'])
            ->first();

        if ($existing) {
            $existing->Quantity += $validated['Quantity'];
            $existing->Price = $validated['Price'];
            $existing->Subtotal = $existing->Price * $existing->Quantity;
            $existing->Options = $validated['Options'] ?? $existing->Options;
            $existing->save();
            return response()->json(['success' => true, 'item' => $existing, 'updated' => true], 200);
        } else {
            $item = CartItem::create([
                'UserID' => $validated['UserID'],
                'ProductID' => $validated['ProductID'],
                'ShopID' => $validated['ShopID'],
                'Quantity' => $validated['Quantity'],
                'Price' => $validated['Price'],
                'Subtotal' => $validated['Subtotal'],
                'Options' => $validated['Options'] ?? null,
            ]);
            return response()->json(['success' => true, 'item' => $item, 'created' => true], 201);
        }
    }

    // GET /api/cart-items?userId=...
    public function index(Request $request)
    {
        $userId = $request->query('userId');
        if (!$userId) {
            return response()->json([], 200);
        }
        $items = \DB::table('cart_items')
            ->where('cart_items.UserID', $userId)
            ->join('products', 'cart_items.ProductID', '=', 'products.ProductID')
            ->select(
                'cart_items.*',
                'products.ProductName',
                'products.Image',
                'products.ShopID as ProductShopID'
            )
            ->get();
        return response()->json($items, 200);
    }

    // PATCH /api/cart-items/{id}
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'Quantity' => 'required|integer|min:1',
        ]);
        $item = CartItem::find($id);
        if (!$item) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }
        $item->Quantity = $validated['Quantity'];
        // Recalculate subtotal and price if needed
        $product = \DB::table('products')->where('ProductID', $item->ProductID)->first();
        if ($product) {
            $item->Price = $product->Price;
            $item->Subtotal = $product->Price * $item->Quantity;
        }
        $item->save();
        return response()->json([
            'Quantity' => $item->Quantity,
            'Subtotal' => $item->Subtotal,
            'Price' => $item->Price
        ], 200);
    }

    // DELETE /api/cart-items/{id}
    public function destroy($id)
    {
        $item = CartItem::find($id);
        if (!$item) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }
        $item->delete();
        return response()->json(['success' => true], 200);
    }
}
