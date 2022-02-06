<?php

namespace App\Http\Middleware;

use Closure;

class TokenAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $next($request);
        $token = $request->header('X-API-TOKEN');
        if ('a' != $token) {
            abort(401, 'Err');
        }
        return $next($request);
    }
}
