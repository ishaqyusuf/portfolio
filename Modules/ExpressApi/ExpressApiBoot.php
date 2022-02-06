<?php

namespace Modules\ExpressApi;

class ExpressApiBoot
{
    static $routes = [];
    static $prefix = "express";
    static function registerRoutes($routes)
    {
        static::$routes = $routes;
    }
}
