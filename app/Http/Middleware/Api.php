<?php

namespace App\Http\Middleware;

use App\Helpers\Transformer\_User;
use App\Http\Controllers\Controller;
use App\Models\Auth\UserSession;
use Closure;
use Illuminate\Support\Facades\Auth;

class Api
{
    public function handle($request, Closure $next)
    {
        $request->user_func = array(_User::class, 'minify');
        $token = $request->header('x-token');
        if ($token) {
            $session = UserSession::whereToken($token)->whereDeviceId(
                $request->header('x-device-id')
            )->first();
            if ($session)
                Auth::login($session->user);
            else return (new Controller)->_error('Invalid authorization token', [], 401);
        }
        return $next($request);
    }
}
