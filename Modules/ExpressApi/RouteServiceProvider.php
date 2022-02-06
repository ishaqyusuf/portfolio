<?php

namespace Modules\ExpressApi;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    protected $moduleNamespace = 'Modules\ExpressApi';

    public function boot()
    {
        parent::boot();
    }

    public function map()
    {
        $this->mapApiRoutes();
    }

    protected function mapApiRoutes()
    {
        Route::
            // prefix('api')
            // ->
            middleware('api')
            ->namespace($this->moduleNamespace)
            ->group(base_path('Modules/ExpressApi/api.php'));
        // ->group(module_path('ExpressApi', '/api.php'));
    }
}
