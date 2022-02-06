<?php

namespace App\Mixins;

use App\Helpers\Common\DataHelper;
use App\Helpers\Common\Transformer;
use Illuminate\Support\Arr;

class CollectionMixin
{
    public function _transform()
    {
        return function ($paginate = false, $mergeWith = []) {
            $data = collect($this);
            $helper = $data->first();
            $hc = $helper ? [Transformer::get($helper), 'transform'] : null; //->getHelperClass();
            return DataHelper::processItems($this, $hc, $paginate, $mergeWith);
        };
    }
    public function dot()
    {
        return function () {
            $string = json_encode(collect($this));
            $arr = json_decode($string, true);
            // return  Arr::dot($collect->toArray());
            return  Arr::dot($arr);
        };
    }
    public function mkv()
    {
        return function ($k, $v) {
            return collect($this)->map(fn ($i) => [$i[$k] => $i[$v]])->collapse();
        };
    }
    public function lkSort()
    {
        return function ($desc = false) {
            $col = collect($this);
            $kets = $col->keys();
            $fn = fn ($s) => strlen($s);
            $keys  = $desc ? $kets->sortBy($fn) : $kets->sortByDesc($fn);
            $value = collect();
            $keys->map(fn ($k) => $value[$k] = $col[$k]);
            return $value;
        };
    }
    public function metakv()
    {
        return function () {
            $value = $this;
            $mm = Collect();
            foreach ($value as $meta) {
                $val = $meta->value;
                $mk = $meta->meta_key;
                if (is_array($val) && Arr::has($val, 'bool_val')) $val = $val['bool_val'];
                if ($mm->has($mk)) {
                    $omv = $mm[$mk];
                    if (is_array($omv)) $omv[] = $val;
                    else $omv = [$omv, $val];
                    $mm[$mk] = $omv;
                } else {
                    $mm[$mk] = $val;
                }
            }
            return $mm;
        };
    }
    public function flatted()
    {
        return function ($only, $flats = []) {
            $c =  collect($this);
            if ($only) $c = $c->only($only);
            return collect([$c, ...$flats])->collapse();
        };
    }
    public function collectKey()
    {
        return function ($key) {
            return collect(collect($this)->get($key));
        };
    }
    public function blend()
    {
        return function (...$items) {
            return collect([$this, ...$items])->collapse();
        };
    }
    public function boolean()
    {
        return function ($key) {
            $c = collect($this);
            return $c->has($key) && $c->get($key) == true;
        };
    }
    public function wrapIn()
    {
        return function ($key) {
            return collect([$key => $this]);
        };
    }
    public function undot()
    {
        $array = array();
        foreach (collect($this) as $key => $value)
            Arr::set($array, $key, $value);
        return $array;
    }
}
