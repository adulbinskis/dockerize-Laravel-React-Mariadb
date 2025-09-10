<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Farm;
use App\Models\Animal;

class AnimalSeeder extends Seeder
{
    public function run(): void
    {
        $farms = Farm::all();

        foreach ($farms as $farm) {
            for ($i = 1; $i <= 3; $i++) {
                Animal::create([
                    'farm_id' => $farm->id,
                    'animal_number' => $i,
                    'type_name' => "Type {$i}",
                    'years' => rand(1, 10),
                ]);
            }
        }
    }
}
