<?php

namespace Tests\Unit;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Mockery;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_register_hashes_password_and_logs_in_user()
    {
        $repoMock = Mockery::mock(UserRepository::class, [new User()]);
        $authService = new AuthService($repoMock);

        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ];

        $repoMock->shouldReceive('create')
            ->once()
            ->with(Mockery::on(fn($data) => Hash::check('password', $data['password'])))
            ->andReturn(new User($userData));

        Auth::shouldReceive('login')->once();

        $user = $authService->register($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('test@example.com', $user->email);
    }

    public function test_login_attempts_authentication()
    {
        $repoMock = Mockery::mock(UserRepository::class, [new User()]);
        $authService = new AuthService($repoMock);

        Auth::shouldReceive('attempt')
            ->once()
            ->with(['email' => 'test@example.com', 'password' => 'password'])
            ->andReturn(true);

        $result = $authService->login(['email' => 'test@example.com', 'password' => 'password']);

        $this->assertTrue($result);
    }

    public function test_logout_calls_auth()
    {
        $repoMock = Mockery::mock(UserRepository::class, [new User()]);
        $authService = new AuthService($repoMock);

        Auth::shouldReceive('logout')->once();

        $authService->logout();

        $this->assertTrue(true);
    }
}
