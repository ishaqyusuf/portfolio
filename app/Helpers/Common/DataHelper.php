<?php

/**
 * Created by PhpStorm.
 * User: ABOO SOFIYYAT
 * Date: 3/9/2019
 * Time: 6:45 PM
 */

namespace App\Helpers\Common;

use App\Helpers\Common\Pager;

abstract class DataHelper
{
    public static function processItems($items, $with = null, $paginate = false, $mergeWith = [])
    {
        $pitems = $paginate ? Pager::Paginate($items) : collect(['items' => $items]);
        // return $pitems;
        $mItems = collect();
        $formattable = $with && $with[0] != null;
        if ($with) {
            foreach ($pitems->get('items') ?? [] as $item)
                $mItems[] = $formattable ? ($with)($item) : $item;
            $pitems['items'] = $mItems;
        }
        return $pitems->merge($mergeWith);
    }
}
