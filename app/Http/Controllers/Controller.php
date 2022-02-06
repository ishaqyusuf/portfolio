<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    function ok($data = null, $alert = null, $paginated = false, $with = [])
    {
        return $this->_success($data ? $data->_transform($paginated, $with) : [], $alert);
    }
    function _success($data = [], $alert = null)
    {
        return response()->json([
            'alert' => $alert,
            'data' => $data, //Collect($data)->toArray(),
            'success' => true,
            'code' => 200
        ]);
    }
    function _error($msg = null, $errors = [], $statusCode = 301)
    {
        return response([
            'success' => false,
            'errors' => $errors,
            'reason' => $msg,
            'code' => $statusCode
        ], $statusCode);
    }
}
