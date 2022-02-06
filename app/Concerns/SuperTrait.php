<?php

namespace App\Concerns;

use App\Builder\SuperBuilder;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\ExpressApi\ExpressModelTraits;

// use Modules\ExpressApi\ExpressModelTraits;

trait SuperTrait
{
    // use MetaFields;
    use SoftDeletes;
    use ExpressModelTraits;
    use HasFactory;
    // protected $dates = ['deleted_at'];
    // protected $guarded = [];

    public function newEloquentBuilder($query)
    {
        return new SuperBuilder($query);
    }

    // public function _transform($paginated = false, $mergeWith = [])
    // {
    //     $helper = Transformer::get($this);
    //     $formatter = [$helper, 'transform'];
    //     $casted = $helper ? $formatter($this, $mergeWith) : $this;
    //     $merged = collect($casted)->merge($mergeWith);
    //     return  $merged;
    // }
    public function _toArray()
    {
        return Collect($this)->except(['deleted_at', 'updated_at'])->toArray();
    }
    public function getForm()
    {
        return Collect(request()->all())->only($this->fillable)->except($this->guarded)->toArray();
    }
    public function saveForm()
    {
        foreach ($this->getForm() as $k => $v)
            $this->$k = $v;
        $this->save();
        return $this;
    }
    use Sluggable;
    public function sluggable(): array
    {
        return $this->slugData ?? [];
    }
}
