<?php

use App\Http\Controllers\Core\UserController;
use Illuminate\Support\Facades\Route;


Route::prefix('auth')->group(function () {
    // Route::get('', [UserController::class, 'index']);
    // Route::get('profile', [UserController::class, 'profile']);
    // Route::get('logout', [UserController::class, 'index']);
    // Route::get('authenticate/{session}', [UserController::class, 'verify']);
    Route::post('login', [UserController::class, 'login']);
    Route::post('', [UserController::class, 'create']);
    Route::patch('{user}', [UserController::class, 'update']);
    Route::delete('{user}', [UserController::class, 'delete']);
});
