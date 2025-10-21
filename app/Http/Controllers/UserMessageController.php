<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserMessageController extends Controller
{
    // GET /api/usermessages?sender_id=...&other_id=...
    public function index(Request $request)
    {
        $senderId = $request->query('sender_id');
        $otherId = $request->query('other_id');
        if (!$senderId) {
            return response()->json(['error' => 'sender_id required'], 400);
        }
        $query = DB::table('usermessages')
            ->where(function($q) use ($senderId, $otherId) {
                $q->where('SenderID', $senderId);
                if ($otherId) $q->where('ReceiverID', $otherId);
            })
            ->orWhere(function($q) use ($senderId, $otherId) {
                if ($otherId) {
                    $q->where('SenderID', $otherId)->where('ReceiverID', $senderId);
                }
            });
        $messages = $query->orderBy('UserMessageID')->get();
        return response()->json($messages);
    }

    // POST /api/usermessages
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_id' => 'required|integer',
            'receiver_id' => 'required|integer',
            'message' => 'required|string',
        ]);
        $id = DB::table('usermessages')->insertGetId([
            'SenderID' => $validated['sender_id'],
            'ReceiverID' => $validated['receiver_id'],
            'MessageBody' => $validated['message'],
            'IsRead' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $msg = DB::table('usermessages')->where('UserMessageID', $id)->first();
        return response()->json($msg, 201);
    }
}
