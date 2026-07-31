<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Masters\BookController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::prefix('v1')->group(function () {
        Route::apiResource('books', BookController::class);
    });
});
