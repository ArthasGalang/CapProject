<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class ShopOrderController extends Controller
{
    public function updateStatus(Request $request, $orderId)
    {
        $status = $request->input('status');
        if (!in_array($status, ['To Pay', 'Preparing', 'For Pickup/Delivery', 'Completed', 'Cancelled'])) {
            return response()->json(['error' => 'Invalid status'], 400);
        }
        $order = \DB::table('orders')->where('OrderID', $orderId);
        if (!$order->exists()) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        $order->update(['Status' => $status]);
        return response()->json(['success' => true, 'OrderID' => $orderId, 'Status' => $status]);
    }
    public function index()
    {
        // Prefer the view if it exists, but fall back to a safe join query
        try {
            $orders = DB::select('SELECT * FROM shop_orders');
        } catch (QueryException $ex) {
            // If the view/table doesn't exist, fallback to direct query
            $orders = DB::table('orders')
                ->leftJoin('shops', 'orders.ShopID', '=', 'shops.ShopID')
                ->leftJoin('users', 'orders.UserID', '=', 'users.UserID')
                ->select(
                    'orders.OrderID',
                    'orders.ShopID',
                    'shops.ShopName',
                    'orders.UserID',
                    DB::raw("CONCAT(users.FirstName, ' ', users.LastName) as BuyerName"),
                    DB::raw('orders.TotalAmount as TotalPrice'),
                    'orders.Status',
                    'orders.OrderDate'
                )
                ->get();
        }

        return response()->json($orders);
    }
}
