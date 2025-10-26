<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // Return count of open reports (Pending + In Review)
    public function openReportsCount()
    {
        $count = Report::whereIn('ReportStatus', ['Pending', 'In Review'])->count();
        return response()->json(['open_reports' => $count]);
    }
}
