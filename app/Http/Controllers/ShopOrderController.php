<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopOrderController extends Controller
{
    public function index()
    {
        // Query the view created in MySQL
        $orders = DB::select('SELECT * FROM order_summary_view');
        return response()->json($orders);
    }
}
