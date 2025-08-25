<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Sales data endpoint
Route::get('/sales', function () {
    $sales = [];
    $products = ['P001', 'P002', 'P003', 'P004', 'P005'];
    
    // Generate sales data for the last 30 days
    for ($i = 0; $i < 30; $i++) {
        $date = now()->subDays($i);
        
        foreach ($products as $index => $productId) {
            $sales[] = [
                'id' => $i * count($products) + $index + 1,
                'product_id' => $productId,
                'month' => $date->month,
                'year' => $date->year,
                'sales' => rand(5, 35),
                'date' => $date->format('Y-m-d')
            ];
        }
    }
    
    return response()->json($sales);
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'service' => 'Laravel API'
    ]);
});
