<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DrugTestResult extends Model
{    use HasFactory;
    protected $fillable = [
        'driver_id',
        'test_date',
        'result',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function scopePositive($query)
    {
        return $query->where('result', 'positive');
    }

    public function scopeNegative($query)
    {
        return $query->where('result', 'negative');
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('test_date', '>=', now()->subDays($days));
    }

    public function scopeOlderThan($query, $days = 30)
    {
        return $query->where('test_date', '<', now()->subDays($days));
    }
}