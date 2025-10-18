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
			'Address' => 'required|string',
			'hasPhysical' => 'boolean',
			'LogoImage' => 'nullable|file|image',
			'BackgroundImage' => 'nullable|file|image',
			'BusinessPermit' => 'nullable|file|image',
		]);

		$data = $validated;
		// Handle file uploads
		foreach ([['LogoImage', 'logos'], ['BackgroundImage', 'banners'], ['BusinessPermit', 'permits']] as [$field, $folder]) {
			if ($request->hasFile($field)) {
				$data[$field] = $request->file($field)->store("shops/$folder", 'public');
			} else {
				$data[$field] = null;
			}
		}
		$shop = \App\Models\Shop::create([
			...$data,
			'isVerified' => false
		]);
		return response()->json(['success' => true, 'shop' => $shop], 201);
	}
}
