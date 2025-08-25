<?php

use Illuminate\Database\Seeder;
use App\Models\Driver;
use App\Models\DrugTestResult;
use App\Models\Violation;
use App\Models\Feedback;
use App\Models\Credential;
use App\Models\Infraction;

class TestDriverSeeder extends Seeder
{
public function run(): void
{
$driver = Driver::create([
'name' => 'Jane Driver',
'license_number' => 'XYZ7890',
'birthdate' => '1985-04-20',
'contact' => '555-8765'
]);

DrugTestResult::factory()->count(3)->create(['driver_id' => $driver->id]);
Violation::factory()->count(2)->create(['driver_id' => $driver->id]);
Feedback::factory()->count(5)->create(['driver_id' => $driver->id]);
Credential::factory()->count(2)->create(['driver_id' => $driver->id]);
Infraction::factory()->count(2)->create(['driver_id' => $driver->id]);
}
}