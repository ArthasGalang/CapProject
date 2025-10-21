<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSent;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('sender_id');
        if (!$userId) {
            return response()->json([]);
        }
        $messages = Message::where('SenderID', $userId)
            ->orWhere('ReceiverID', $userId)
            ->orderBy('created_at')
            ->get();
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $userId = $request->input('sender_id');
        $message = Message::create([
            'SenderID' => $userId,
            'ReceiverID' => $request->input('receiver_id'),
            'MessageBody' => $request->input('message'),
        ]);
        broadcast(new MessageSent($message))->toOthers();
        return response()->json($message);
    }
}
