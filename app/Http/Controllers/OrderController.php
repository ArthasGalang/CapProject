<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;

class OrderController extends Controller
{
    public function storeMultiShop(Request $request)
    {
        $orders = $request->input('orders');
        if (!is_array($orders) || empty($orders)) {
            return response()->json(['success' => false, 'message' => 'No orders provided.'], 400);
        }
        $createdOrders = [];
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
            }
            $createdOrders[] = $order->OrderID;
        }
        return response()->json(['success' => true, 'order_ids' => $createdOrders]);
    }
}
