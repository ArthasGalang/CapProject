<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class AnnouncementController extends Controller
{
    // GET /api/announcements
    public function index()
    {
        $announcements = DB::table('announcement')->orderByDesc('AnnouncementID')->get();
        return response()->json($announcements);
    }

    // POST /api/announcements
    public function store(Request $request)
    {
        $data = $request->validate([
            'Content' => 'required|string',
            'ReceiverIDs' => 'required|string',
        ]);
        $announcementId = DB::table('announcement')->insertGetId([
            'Content' => $data['Content'],
            'ReceiverIDs' => $data['ReceiverIDs'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $announcement = DB::table('announcement')->where('AnnouncementID', $announcementId)->first();
        return response()->json($announcement, 201);
    }
}
