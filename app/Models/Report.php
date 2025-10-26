<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';
    protected $primaryKey = 'ReportID';
    protected $fillable = [
        'UserID', 'Reason', 'ReportStatus', 'ReportDate', 'AdminResponse', 'ReportedLink', 'TargetType', 'TargetID'
    ];
}
