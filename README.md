```
# Project Setup Guide

This guide explains how to set up the project in a WSL 2 environment.

## Prerequisites

- WSL 2
- Docker & Docker Compose
- PHP
- Composer
- Node.js & npm

cd api
composer install

cd ../spa
npm install

cd ..
docker-compose up -d

# Inside API container
php artisan migrate
php artisan db:seed

# Running tests inside API container
php artisan test --env=testing

# If the above command does not work
php artisan migrate --env=testing

# Seeded Users
# User One
#   email: user1@example.com
#   password: password
# User Two
#   email: user2@example.com
#   password: password

# Notes:
# - Make sure to run commands inside the correct Docker container
# - Ensure .env files are properly configured before starting the containers
```
