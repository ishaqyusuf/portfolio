<?php

namespace Modules\ExpressApi;


class ExpressRoute
{
    // public $model;
    // public $service;
    // public $route;

    public function __construct($route, $model, $service = null)
    {
        $this->model = $model;
        $this->route = $route;
        $this->service = $service;
    }
}
