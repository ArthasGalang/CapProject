<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class ShopOrderController extends Controller
{
    public function index()
    {
        // Prefer the view if it exists, but fall back to a safe join query
        try {
            $orders = DB::select('SELECT * FROM order_summary_view');
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
                    'orders.TotalAmount',
                    'orders.Status',
                    'orders.OrderDate'
                )
                ->get();
        }

        return response()->json($orders);
    }
}
