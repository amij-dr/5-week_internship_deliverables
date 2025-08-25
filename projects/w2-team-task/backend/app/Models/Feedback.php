<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'content',
        'rating',
    ];

    public function driver() 
    {
        return $this->belongsTo(Driver::class);
    }   
}