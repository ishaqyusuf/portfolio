<?php

use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['oauth']], function () {
});
