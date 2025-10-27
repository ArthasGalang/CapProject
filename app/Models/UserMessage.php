<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserMessage extends Model
{
    use SoftDeletes;
    protected $table = 'usermessages';
    protected $primaryKey = 'UserMessageID';
    protected $fillable = [
        'SenderID',
        'ReceiverID',
        'MessageBody',
        'IsRead',
        'ReadAt',
    ];
}
