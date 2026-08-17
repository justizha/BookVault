<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Masters\BookController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');


Route::middleware('auth:sanctum')->group(function () {
    // read — any authenticated role (admin, staff, cashier)
    Route::get('books', [BookController::class, 'index']);
    Route::get('books/{book}', [BookController::class, 'show']);

    // write — admin or staff only
    Route::middleware('role:admin,staff')->group(function () {
        Route::post('books', [BookController::class, 'store']);
        Route::put('books/{book}', [BookController::class, 'update']);
        Route::patch('books/{book}', [BookController::class, 'update']);
        Route::delete('books/{book}', [BookController::class, 'destroy']);
    });

    // restore — admin only (more sensitive than a regular delete)
    Route::middleware('role:admin')->group(function () {
        Route::post('books/{book}/restore', [BookController::class, 'restore']);
    });
});