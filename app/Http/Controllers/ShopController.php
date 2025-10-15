<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;

class ShopController extends Controller
{
	// Return all shops as JSON for BrowseShop
	public function index(Request $request)
	{
		$shops = Shop::all();
		return response()->json($shops);
	}
}
