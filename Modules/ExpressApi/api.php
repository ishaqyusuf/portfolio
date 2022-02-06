<?php

use Illuminate\Support\Facades\Route;
use Modules\ExpressApi\ApiController;
use Modules\ExpressApi\ExpressApiBoot;

$base = ExpressApiBoot::$prefix;
Route::prefix($base)->group(function () {
    Route::get('{model}', [ApiController::class, 'index']);
    Route::post('{model}/{__id?}', [ApiController::class, 'create']);
    Route::patch('{model}/{__id}', [ApiController::class, 'update']);
    Route::get('{model}/{__id}', [ApiController::class, 'get']);
    Route::delete('{model}/{__id}', [ApiController::class, 'delete']);
});
