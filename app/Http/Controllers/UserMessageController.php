<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserMessageController extends Controller
{
// ...existing code...
    // POST /api/usermessages/read
    public function markAsRead(Request $request)
    {
        $ids = $request->input('ids');
        if (!is_array($ids) || empty($ids)) {
            return response()->json(['error' => 'No message IDs provided'], 400);
        }
        $affected = \DB::table('usermessages')
            ->whereIn('UserMessageID', $ids)
            ->update([
                'IsRead' => true,
                'ReadAt' => now(),
                'updated_at' => now(),
            ]);
        return response()->json(['updated' => $affected]);
    }
    // GET /api/usermessages?sender_id=...&other_id=...
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        $senderId = $request->query('sender_id');
        $otherId = $request->query('other_id');
        if ($userId) {
            // Return all messages where user is sender or receiver
            $messages = DB::table('usermessages')
                ->where('SenderID', $userId)
                ->orWhere('ReceiverID', $userId)
                ->orderBy('UserMessageID')
                ->get();
            return response()->json($messages);
        }
        // Fallback to old logic if sender_id is provided
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
        $msg = \App\Models\UserMessage::find($id);
    // Broadcast UserMessageSent event for real-time updates
    broadcast(new \App\Events\UserMessageSent($msg))->toOthers();
        return response()->json($msg, 201);
    }
}
