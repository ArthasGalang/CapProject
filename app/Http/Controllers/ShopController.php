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

	// Register a new shop
	public function store(Request $request)
	{
		$validated = $request->validate([
			'UserID' => 'required|integer',
			'ShopName' => 'required|string',
			'ShopDescription' => 'required|string',
			'LogoImage' => 'nullable|string',
			'BackgroundImage' => 'nullable|string',
			'Address' => 'required|string',
			'BusinessPermit' => 'nullable|string',
			'hasPhysical' => 'boolean',
		]);
		$shop = \App\Models\Shop::create([
			...$validated,
			'isVerified' => false
		]);
		return response()->json(['success' => true, 'shop' => $shop], 201);
	}
}
