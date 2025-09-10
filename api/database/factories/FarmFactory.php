<?php

namespace Database\Factories;

use App\Models\Farm;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FarmFactory extends Factory
{
    protected $model = Farm::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->company,
            'email' => $this->faker->unique()->safeEmail,
            'website' => $this->faker->url,
        ];
    }
}
