<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'license_number',
        'birthdate',
        'contact',
    ];

    public function drugTestResults() 
    {
        return $this->hasMany(DrugTestResult::class);
    }

    public function violations() 
    {
        return $this->hasMany(Violation::class);
    }

    public function feedback() 
    {
        return $this->hasMany(Feedback::class);
    }

    public function credentials() 
    {
        return $this->hasMany(Credential::class);
    }

    public function infractions() 
    {
        return $this->hasMany(Infraction::class);
    }
}