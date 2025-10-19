<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;

class OrderController extends Controller
{
    // Get authenticated user's orders with items and products
    public function userOrders(Request $request)
    {
        // Accept UserID from query param if not authenticated
        $user = $request->user();
        $userId = $user ? $user->UserID : $request->query('user_id');
        if (!$userId) {
            return response()->json(['error' => 'UserID required'], 400);
        }
        $orders = \App\Models\Order::where('UserID', $userId)
            ->with(['orderItems.product'])
            ->orderBy('OrderDate', 'desc')
            ->get();
        return response()->json(['orders' => $orders]);
    }

    public function storeMultiShop(Request $request)
    {
        $orders = $request->input('orders');
        if (!is_array($orders) || empty($orders)) {
            return response()->json(['success' => false, 'message' => 'No orders provided.'], 400);
        }
        $createdOrders = [];
        $cartItemIdsToDelete = [];
        foreach ($orders as $orderData) {
            $order = Order::create([
                'ShopID' => $orderData['ShopID'],
                'UserID' => $orderData['UserID'],
                'AddressID' => $orderData['AddressID'],
                'TotalAmount' => $orderData['TotalAmount'],
                'Status' => $orderData['Status'],
                'OrderDate' => $orderData['OrderDate'],
                'PaymentMethod' => $orderData['PaymentMethod'],
                'BuyerNote' => $orderData['BuyerNote'],
                'PaymentStatus' => $orderData['PaymentStatus'],
                'IsPickUp' => $orderData['IsPickUp'],
                'PickUpTime' => $orderData['PickUpTime'],
                'CompletionDate' => $orderData['CompletionDate'],
            ]);
            foreach ($orderData['items'] as $item) {
                OrderItem::create([
                    'OrderID' => $order->OrderID,
                    'ProductID' => $item['ProductID'],
                    'Quantity' => $item['Quantity'],
                    'Subtotal' => $item['Subtotal'],
                ]);
                if (isset($item['CartItemID'])) {
                    $cartItemIdsToDelete[] = $item['CartItemID'];
                }
            }
            $createdOrders[] = $order->OrderID;
        }
        // Remove posted cart items from cart_items table
        if (!empty($cartItemIdsToDelete)) {
            \App\Models\CartItem::whereIn('CartItemID', $cartItemIdsToDelete)->delete();
        }
        return response()->json(['success' => true, 'order_ids' => $createdOrders]);
    }
}
