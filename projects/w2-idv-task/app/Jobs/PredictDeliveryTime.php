<?php

namespace App\Jobs;

use App\Models\Delivery;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class PredictDeliveryTime implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $delivery;

    /**
     * Create a new job instance.
     */
    public function __construct(Delivery $delivery)
    {
        $this->delivery = $delivery;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $data = [
            'distance_km' => $this->delivery->distance_km,
            'fuel_used' => $this->delivery->fuel_used
        ];

        $response = Http::post('http://127.0.0.1:5000/predict', $data);
        $this->delivery->time_minutes = $response['eta_minutes'];
        $this->delivery->save();
    }
}