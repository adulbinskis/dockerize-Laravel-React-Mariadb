<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\AnimalController;

Route::middleware(['api', 'auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('farms', FarmController::class);

    Route::prefix('farms/{farm}')->group(function () {
        Route::apiResource('animals', AnimalController::class);
    });
});
