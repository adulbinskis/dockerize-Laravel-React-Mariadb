<?php

namespace Tests\Feature;

use App\Models\Animal;
use App\Models\Farm;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnimalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guest_cannot_access_animals()
    {
        $farm = Farm::first();
        $animal = $farm->animals()->first();

        $this->getJson("/api/farms/{$farm->id}/animals")->assertStatus(401);
        $this->getJson("/api/farms/{$farm->id}/animals/{$animal->id}")->assertStatus(401);
        $this->postJson("/api/farms/{$farm->id}/animals", [])->assertStatus(401);
        $this->putJson("/api/farms/{$farm->id}/animals/{$animal->id}", [])->assertStatus(401);
        $this->deleteJson("/api/farms/{$farm->id}/animals/{$animal->id}")->assertStatus(401);
    }

    public function test_user_can_list_their_farm_animals()
    {
        $user = User::first();
        $farm = $user->farms()->first();
        $this->actingAs($user, 'sanctum');

        $this->getJson("/api/farms/{$farm->id}/animals")
            ->assertStatus(200)
            ->assertJsonFragment([
                'farm_id' => $farm->id,
            ]);
    }

    public function test_user_can_view_their_own_animal()
    {
        $user = User::first();
        $farm = $user->farms()->first();
        $animal = $farm->animals()->first();
        $this->actingAs($user, 'sanctum');

        $this->getJson("/api/farms/{$farm->id}/animals/{$animal->id}")
            ->assertStatus(200)
            ->assertJsonFragment([
                'id' => $animal->id,
                'farm_id' => $farm->id,
            ]);
    }

    public function test_user_cannot_view_other_users_animal()
    {
        $users = User::all();
        $user = $users->first();
        $otherAnimal = $users->last()->farms()->first()->animals()->first();
        $this->actingAs($user, 'sanctum');

        $this->getJson("/api/farms/{$otherAnimal->farm_id}/animals/{$otherAnimal->id}")
            ->assertStatus(403);
    }

    public function test_user_can_create_animal_in_their_farm()
    {
        $user = User::first();
        $farm = Farm::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user, 'sanctum');

        $payload = [
            'animal_number' => 'A001',
            'type_name' => 'Cow',
            'years' => 2,
        ];

        $this->postJson("/api/farms/{$farm->id}/animals", $payload)
            ->assertStatus(201)
            ->assertJsonFragment([
                'animal_number' => 'A001',
                'farm_id' => $farm->id,
            ]);

        $this->assertDatabaseHas('animals', [
            'animal_number' => 'A001',
            'farm_id' => $farm->id,
        ]);
    }


    public function test_user_can_update_their_animal()
    {
        $user = User::first();
        $farm = $user->farms()->first();
        $animal = $farm->animals()->first();
        $this->actingAs($user, 'sanctum');

        $payload = [
            'animal_number' => $animal->animal_number,
            'type_name' => 'Sheep',
            'years' => $animal->years,
        ];

        $this->putJson("/api/farms/{$farm->id}/animals/{$animal->id}", $payload)
            ->assertStatus(200)
            ->assertJsonFragment([
                'type_name' => 'Sheep',
            ]);

        $this->assertDatabaseHas('animals', [
            'id' => $animal->id,
            'type_name' => 'Sheep',
        ]);
    }

    public function test_user_cannot_update_other_users_animal()
    {
        $users = User::all();
        $user = $users->first();
        $otherAnimal = $users->last()->farms()->first()->animals()->first();
        $this->actingAs($user, 'sanctum');

        $payload = [
            'animal_number' => $otherAnimal->animal_number,
            'type_name' => 'Goat',
            'years' => $otherAnimal->years,
        ];

        $this->putJson("/api/farms/{$otherAnimal->farm_id}/animals/{$otherAnimal->id}", $payload)
            ->assertStatus(403);
    }

    public function test_user_can_delete_their_animal()
    {
        $user = User::first();
        $farm = $user->farms()->first();
        $animal = $farm->animals()->first();
        $this->actingAs($user, 'sanctum');

        $this->deleteJson("/api/farms/{$farm->id}/animals/{$animal->id}")
            ->assertStatus(200)
            ->assertJson(['message' => 'Animal deleted']);

        $this->assertDatabaseMissing('animals', [
            'id' => $animal->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_animal()
    {
        $users = User::all();
        $user = $users->first();
        $otherAnimal = $users->last()->farms()->first()->animals()->first();
        $this->actingAs($user, 'sanctum');

        $this->deleteJson("/api/farms/{$otherAnimal->farm_id}/animals/{$otherAnimal->id}")
            ->assertStatus(403);
    }
}
