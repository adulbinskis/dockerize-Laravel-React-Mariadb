In my case inside wsl 2 

api:
composer install

spa:
npm i

then in root dir:
docker-compose up -d

inside container API:

php artisan migrate

php artisan db:seed

for tests: 

  inside container API:
  
    php artisan test --env=testing
    
    (if php artisan test --env=testing not working){
    
      php artisan migrate --env=testing
      
    }

Seeded users:

        'name' => 'User One',
        
        'email' => 'user1@example.com',
        
        'password' => Hash::make('password'),


        'name' => 'User Two',
        
        'email' => 'user2@example.com',
        
        'password' => Hash::make('password'),


