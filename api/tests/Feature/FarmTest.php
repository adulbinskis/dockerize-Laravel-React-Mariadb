<?php

namespace Tests\Feature;

use App\Models\Farm;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FarmTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guest_cannot_access_farms()
    {
        $farm = Farm::first();

        $this->getJson('/api/farms')->assertStatus(401);
        $this->getJson("/api/farms/{$farm->id}")->assertStatus(401);
        $this->postJson('/api/farms', [])->assertStatus(401);
        $this->putJson("/api/farms/{$farm->id}", [])->assertStatus(401);
        $this->deleteJson("/api/farms/{$farm->id}")->assertStatus(401);
    }

    public function test_authenticated_user_can_list_their_farms()
    {
        $user = User::first();
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/farms');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'user_id' => $user->id,
            ]);
    }

    public function test_user_can_view_their_own_farm()
    {
        $user = User::first();
        $farm = $user->farms()->first();

        $this->actingAs($user, 'sanctum');

        $this->getJson("/api/farms/{$farm->id}")
            ->assertStatus(200)
            ->assertJsonFragment([
                'id' => $farm->id,
                'user_id' => $user->id,
            ]);
    }

    public function test_user_cannot_view_other_users_farm()
    {
        $users = User::all();
        $user = $users->first();
        $otherFarm = $users->last()->farms()->first();

        $this->actingAs($user, 'sanctum');

        $this->getJson("/api/farms/{$otherFarm->id}")
            ->assertStatus(403); // authorization fails
    }

    public function test_authenticated_user_can_create_farm()
    {
        $user = User::first();
        $this->actingAs($user, 'sanctum');

        $payload = [
            'name' => 'New Farm',
            'email' => 'newfarm@example.com',
            'website' => 'https://newfarm.example.com',
        ];

        $response = $this->postJson('/api/farms', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'New Farm',
                'user_id' => $user->id,
            ]);

        $this->assertDatabaseHas('farms', [
            'name' => 'New Farm',
            'user_id' => $user->id,
        ]);
    }

    public function test_authenticated_user_can_update_their_farm()
    {
        $user = User::first();
        $farm = $user->farms()->first();

        $this->actingAs($user, 'sanctum');

        $payload = [
            'name' => 'Updated Farm Name',
            'email' => $farm->email,
            'website' => $farm->website,
        ];

        $this->putJson("/api/farms/{$farm->id}", $payload)
            ->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Updated Farm Name',
            ]);

        $this->assertDatabaseHas('farms', [
            'id' => $farm->id,
            'name' => 'Updated Farm Name',
        ]);
    }

    public function test_user_cannot_update_other_users_farm()
    {
        $users = User::all();
        $user = $users->first();
        $otherFarm = $users->last()->farms()->first();

        $this->actingAs($user, 'sanctum');

        $payload = ['name' => 'Hacked Name'];

        $this->putJson("/api/farms/{$otherFarm->id}", $payload)
            ->assertStatus(403);
    }

    public function test_authenticated_user_can_delete_their_farm()
    {
        $user = User::first();
        $farm = $user->farms()->first();

        $this->actingAs($user, 'sanctum');

        $this->deleteJson("/api/farms/{$farm->id}")
            ->assertStatus(200)
            ->assertJson(['message' => 'Farm deleted']);

        $this->assertDatabaseMissing('farms', ['id' => $farm->id]);
    }

    public function test_user_cannot_delete_other_users_farm()
    {
        $users = User::all();
        $user = $users->first();
        $otherFarm = $users->last()->farms()->first();

        $this->actingAs($user, 'sanctum');

        $this->deleteJson("/api/farms/{$otherFarm->id}")
            ->assertStatus(403);
    }

    public function test_user_cannot_create_more_than_3_animals_in_a_farm()
    {
        $user = User::first();
        $farm = Farm::factory()->create(['user_id' => $user->id]);
        $this->actingAs($user, 'sanctum');

        for ($i = 1; $i <= 3; $i++) {
            $this->postJson("/api/farms/{$farm->id}/animals", [
                'animal_number' => 'A00' . $i,
                'type_name' => 'Cow',
                'years' => $i,
            ])->assertStatus(201);
        }

        $this->postJson("/api/farms/{$farm->id}/animals", [
            'animal_number' => 'A004',
            'type_name' => 'Sheep',
            'years' => 2,
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['farm_id']);
    }

}
