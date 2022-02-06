<?php

namespace App\Providers;

use App\ExpressApi\ExpressApiRoutes;
use App\Mixins\CollectionMixin;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Response;
use Modules\ExpressApi\ExpressApiBoot;
use Modules\ExpressApi\ExpressApiServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->register(ExpressApiServiceProvider::class);
    }
    public function boot()
    {
        ExpressApiBoot::$prefix = 'express';
        ExpressApiBoot::registerRoutes(ExpressApiRoutes::$routes);

        Response::macro('success', function ($data = [], $alert = null) {
            return response()->json([
                'alert' => $alert,
                'data' => Collect($data)->toArray(),
                'success' => true,
                'code' => 200
            ]);
        });
        Response::macro('error', function ($msg = null, $errors = [], $statusCode = 301) {
            return response([
                'success' => false,
                'errors' => $errors,
                'reason' => $msg,
                'code' => $statusCode
            ], $statusCode);
        });
        Response::macro('restrict', function ($reason = null) {
            return response()->json([
                'error' => 'Invalid session',
                'auth_access_error' => true,
                'reason' => $reason
            ]);
        });
        Collection::mixin(new CollectionMixin());
    }
}
