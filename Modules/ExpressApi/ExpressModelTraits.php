<?php

namespace Modules\ExpressApi;

trait ExpressModelTraits
{

    public function transform()
    {
        return $this->__transform();
    }
    public function __transform()
    {
        $transformer = _ExpressApi::getTransformer($this);
        // return $this;
        $data = Collect($transformer ?   (new $transformer)->transform($this) : $this);
        return $data;
        // return array_merge(
        //     $data->toArray(),
        //     $mergeWith
        // );
    }
}
