<?php

namespace Modules\ExpressApi;

use Illuminate\Support\Collection;
use Illuminate\Support\ServiceProvider;

class ExpressApiServiceProvider extends ServiceProvider
{
    protected $moduleName = 'ExpressApi';

    protected $moduleNameLower = 'expressApi';

    public function boot()
    {
        $this->registerConfig();

        Collection::macro('__transform',   function ($transformer = null, $paginate = false, $mergeWith = []) {
            $data = collect($this);
            $helper = $data->first();
            // $hc = $helper ? // [_ExpressApi::getTransformer($helper), 'transform'] : null; //->getHelperClass();
            return _ExpressApi::transformItem($this, $transformer, $paginate, $mergeWith);
        });
    }

    public function register()
    {
        $this->app->register(RouteServiceProvider::class);
    }
    protected function registerConfig()
    {
        // $this->publishes([
        //     module_path($this->moduleName, 'config.php') => config_path($this->moduleNameLower . '.php'),
        // ], 'config');
        // $this->mergeConfigFrom(
        //     module_path($this->moduleName, 'config.php'),
        //     $this->moduleNameLower
        // );
    }
    public function provides()
    {
        return [];
    }
}
