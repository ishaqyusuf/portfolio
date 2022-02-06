<?php

/**
 * Created by PhpStorm.
 * User: ABOO SOFIYYAT
 * Date: 3/9/2019
 * Time: 6:45 PM
 */

namespace App\Helpers\Common;


use Carbon\Carbon;
use Illuminate\Http\Request;

abstract class Tokenfy
{
    public static function validateRequest(Request $r)
    {
        return self::validate($r->header('Authorization'));
    }
    public static function validate($token)
    {
        return true;
        try {
            $n = Carbon::now('Europe/London')->minute . "." . Carbon::now('Europe/London')->second;
            $token = str_replace("Bearer ", "", $token);
            $d =  Crypto::decrypt($token);
            if ($d > 59 && $n < 1) $n += 60;
            return ($n - $d) <= 2;
        } catch (\Exception $e) {
        }
        return false;
    }

    public static function companify($source, $target)
    {
        $target['company_id'] = $source->company_id;
        $target['div_id'] = $source->div_id;
        return $target;
    }
}
