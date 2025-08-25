<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'type',
        'description',
        'date',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}