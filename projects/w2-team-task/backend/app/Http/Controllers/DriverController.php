<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    public function profile($id)
    {
        $driver = Driver::with([
            'drugTestResults',
            'violations',
            'feedback',
            'credentials',
            'infractions'
        ])->findOrFail($id);

        return response()->json($driver);
    }
}