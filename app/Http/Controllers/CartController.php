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

    // POST /api/cart/add
    public function add(Request $request)
    {
        $validated = $request->validate([
            'productId' => 'required|integer|exists:products,ProductID',
            'quantity' => 'required|integer|min:1',
        ]);

        // You may want to get the user from auth, but for demo, fallback to userId from request
        $userId = $request->input('userId') ?? ($request->user() ? ($request->user()->UserID ?? $request->user()->id) : null);
        if (!$userId) {
            return response()->json(['error' => 'User ID required'], 400);
        }

        // Get product and shop info
        $product = \DB::table('products')->where('ProductID', $validated['productId'])->first();
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        $shopId = $product->ShopID;
        $price = $product->Price;
        $subtotal = $price * $validated['quantity'];

        // Check if already in cart
        $existing = \App\Models\CartItem::where('UserID', $userId)
            ->where('ProductID', $validated['productId'])
            ->where('ShopID', $shopId)
            ->first();
        if ($existing) {
            $existing->Quantity += $validated['quantity'];
            $existing->Price = $price;
            $existing->Subtotal = $existing->Quantity * $price;
            $existing->save();
            return response()->json(['success' => true, 'message' => 'Cart updated', 'item' => $existing], 200);
        } else {
            $item = \App\Models\CartItem::create([
                'UserID' => $userId,
                'ProductID' => $validated['productId'],
                'ShopID' => $shopId,
                'Quantity' => $validated['quantity'],
                'Price' => $price,
                'Subtotal' => $subtotal,
            ]);
            return response()->json(['success' => true, 'message' => 'Added to cart', 'item' => $item], 201);
        }
    }
    /**
     * Return the number of cart items for the authenticated user.
     */
    public function countForAuthUser(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['count' => 0]);
        }

        // Adjust column name if your CartItem model uses a different foreign key
        $count = CartItem::where('UserID', $user->UserID ?? $user->id)->count();

        return response()->json(['count' => $count]);
    }
}
