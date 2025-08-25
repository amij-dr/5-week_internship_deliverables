<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Jobs\PredictDeliveryTime;
use App\Models\Delivery;

class DeliveryController extends Controller
{
    public function predict(Request $request)
    {
        $data = $request->only('distance_km', 'fuel_used');

        // Optional: validate input
        $request->validate([
            'distance_km' => 'required|numeric|min:0',
            'fuel_used' => 'required|numeric|min:0',
        ]);

        // 1. Save a new Delivery record to the DB
        $delivery = Delivery::create([
            'location' => 'Nairobi', // or $request->input('location') if sent from client
            'distance_km' => $data['distance_km'],
            'fuel_used' => $data['fuel_used'],
        ]);

        // 2. Send job to the queue
        PredictDeliveryTime::dispatch($delivery);

        // 3. (Optional) immediate estimate using direct API call
        $response = Http::post('http://127.0.0.1:5000/predict', $data);

        return response()->json([
            'predicted_time' => $response->json()['eta_minutes']
        ]);
    }
}