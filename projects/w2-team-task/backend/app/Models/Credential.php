<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Credential extends Model
{
    use HasFactory;
    protected $fillable = [
        'driver_id',
        'type',
        'document_path',
        'is_valid',
        'remarks',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
}