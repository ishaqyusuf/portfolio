<?php

namespace Modules\ExpressApi;

abstract class _ExpressApi
{
    public static function getController()
    {
        return new ExpressApi;
    }
    public static function getTransformer($model = null)
    {
        foreach (ExpressApiBoot::$routes as $k => $v) {
            if ($model) {
                $service = new $v;
                if ($service->model)
                    if ($model instanceof $service->model)
                        return $v;
            }
            if (!$model && $k == request()->model)
                return $v;
        }
    }
    public static function transformItem($items, $transformer = null, $paginate = false, $mergeWith = [])
    {
        $pitems = $paginate ? Pager::Paginate($items) : collect(['items' => $items]);
        // return $pitems;
        $mItems = collect();
        // if($transformer)
        // $formattable = $with && $with[0] != null;
        // if ($formattable) {
        foreach ($pitems->get('items') ?? [] as $item)
            $mItems[] = $transformer ? ($transformer)->transform($item) : $item;
        $pitems['items'] = $mItems;
        // }
        return $pitems->merge($mergeWith);
    }
}
class ExpressApi
{
    public $model = null;
    public $transformer = null;
    public $transformerInstance = null;
    public function __construct()
    {
        $this->transformer = _ExpressApi::getTransformer();
        $this->transformerInstance = (new $this->transformer);
        $this->model = $this->transformerInstance->model;
    }
    public function keyName()
    {
        return $this->transformerInstance->keyName;
    }
    public function transform($data)
    {
        return $this->transformerInstance->transform($data);
    }
}

use Illuminate\Support\Arr;

class Pager
{
    public static function Paginate($items, $itemsPerPage = 20)
    {
        $r = request();
        if ($r->per_page)
            $itemsPerPage = $r->per_page;
        $total = $items->count();
        $lp = ceil(($total / $itemsPerPage));
        $pg = $r->page ?? 1;
        $pgIndex = $pg - 1;
        // $r->page = 1;

        $url = $r->fullUrl();
        $from = ($pgIndex * $itemsPerPage) + 1;
        $to = $from + $itemsPerPage;
        $pager = self::pageObject($url, $lp, [
            'total' => $total,
            'empty' => $total == 0,
            'current_page' => $pg + 0,
            'from' => $from,
            'to' => min($to, $total),
            'last_page' => $lp,
            'per_page' => +$itemsPerPage,
        ]);
        $paginated = [
            'pager' => $pager,
            'items' => collect($items->chunk($itemsPerPage)[$pgIndex] ?? [])->values()
        ];
        return collect($paginated);
    }
    public static function pageObject($url, $last_page, $mergeWith = [])
    {
        $urlSplit = collect(explode('?', $url));
        $baseUrl = $urlSplit[0];
        $params = [];
        if ($urlSplit->count() > 1)
            foreach (explode('&', $urlSplit[1]) as $us) {
                $psplit = explode('=', $us);
                $params[$psplit[0]] = $psplit[1];
            }
        $page = +Arr::get($params, 'page', 1);
        $obj = [
            'path' => $url,
            'base_url' => self::createUrl($baseUrl, $params, null, true)
        ];
        ($prev = $page - 1) >  0 && $obj['prev_page_url'] = self::createUrl($baseUrl, $params, $prev);
        ($next = $page + 1) <= $last_page && $obj['next_page_url'] = self::createUrl($baseUrl, $params, $next);
        return array_merge($obj, $mergeWith);
    }
    public static function createUrl($url, $params, $page = null, $unsetPage = false)
    {
        !$page && $page = Arr::get($params, 'page');
        unset($params['page']);
        $page && $params['page'] = $unsetPage ? "" : $page;
        return implode('?', [$url, http_build_query($params)]);
    }
}
