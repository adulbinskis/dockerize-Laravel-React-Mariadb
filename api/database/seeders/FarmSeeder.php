<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Farm;

class FarmSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            for ($i = 1; $i <= 2; $i++) {
                Farm::create([
                    'user_id' => $user->id,
                    'name' => "Farm {$i} of {$user->name}",
                    'email' => "farm{$i}_{$user->id}@example.com",
                    'website' => "https://farm{$i}_{$user->id}.example.com",
                ]);
            }
        }
    }
}
