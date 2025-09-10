<?php

namespace Database\Factories;

use App\Models\Animal;
use App\Models\Farm;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition()
    {
        return [
            'farm_id' => Farm::factory(),
            'animal_number' => $this->faker->unique()->bothify('A###'),
            'type_name' => $this->faker->randomElement(['Cow', 'Sheep', 'Goat']),
            'years' => $this->faker->numberBetween(1, 10),
        ];
    }
}
