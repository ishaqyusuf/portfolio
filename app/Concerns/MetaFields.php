<?php

namespace App\Concerns;

use App\Models\AddressBook;
use App\Models\CrashReport;
use App\Models\CrashReportMeta;
use App\Models\Department;
use App\Models\DepartmentMeta;
use App\Models\Invoice;
use App\Models\InvoiceMeta;
use App\Models\InvoiceTemplateMeta;
use App\Models\InvoiceTemplate;
use App\Models\Organization;
use App\Models\OrganizationMeta;
use App\Models\Parcel;
use App\Models\ParcelMeta;
use App\Models\Shipment;
use App\Models\ShipmentMeta;
use App\Models\ShipmentRoute;
use App\Models\ShipmentRouteMeta;
use App\Models\Tracking;
use App\Models\TrackingMeta;
use App\Models\WebLog;
use App\Models\WebLogMeta;
use App\Post;
use App\PostMeta;
use App\User;
use App\UserMeta;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use UnexpectedValueException;

/**
 * Trait HasMetaFields
 *
 * @package Corcel\Traits
 * @author Junior Grossi <juniorgro@gmail.com>
 */
trait MetaFields
{
    /**
     * @var array
     */
    protected $builtInClasses = [
        Post::class => PostMeta::class,
        User::class => UserMeta::class,
        Invoice::class => InvoiceMeta::class,
        Department::class => DepartmentMeta::class,
        Organization::class => OrganizationMeta::class,
        InvoiceTemplate::class => InvoiceTemplateMeta::class,
        Parcel::class => ParcelMeta::class,
        Shipment::class => ShipmentMeta::class,
        ShipmentRoute::class => ShipmentRouteMeta::class,
        Tracking::class => TrackingMeta::class,
        WebLog::class => WebLogMeta::class,
        CrashReport::class => CrashReportMeta::class,
        // AddressBook::class => AddressBook
        // AddressBook::class => AddressBookMeta::class
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function fields()
    {
        return $this->meta();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function meta()
    {
        return $this->hasMany($this->getMetaClass(), $this->getMetaForeignKey());
    }

    /**
     * @return string
     * @throws \UnexpectedValueException
     */
    protected function getMetaClass()
    {
        foreach ($this->builtInClasses as $model => $meta) {
            if ($this instanceof $model) {
                return $meta;
            }
        }

        throw new UnexpectedValueException(sprintf(
            '%s must extends one of Corcel built-in models: Comment, Post, Term or User.',
            static::class
        ));
    }

    /**
     * @return string
     * @throws \UnexpectedValueException
     */
    protected function getMetaForeignKey(): string
    {
        foreach ($this->builtInClasses as $model => $meta) {
            if ($this instanceof $model) {
                return sprintf('%s_id', strtolower(class_basename($model)));
            }
        }

        throw new UnexpectedValueException(sprintf(
            '%s must extends one of Corcel built-in models: Comment, Post, Term or User.',
            static::class
        ));
    }

    /**
     * @param Builder $query
     * @param string|array $meta
     * @param mixed $value
     * @param string $operator
     * @return Builder
     */
    public function scopeHasMeta(Builder $query, $meta, $value = null, string $operator = '=')
    {
        if (!is_array($meta)) {
            $meta = [$meta => $value];
        }

        foreach ($meta as $key => $value) {
            $query->whereHas('meta', function (Builder $query) use ($key, $value, $operator) {
                if (!is_string($key)) {
                    return $query->where('meta_key', $operator, $value);
                }
                $query->where('meta_key', $operator, $key);

                return is_null($value) ? $query :
                    $query->where('meta_value', $operator, $value);
            });
        }

        return $query;
    }

    /**
     * @param Builder $query
     * @param string $meta
     * @param mixed $value
     * @return Builder
     */
    public function scopeHasMetaLike(Builder $query, $meta, $value = null)
    {
        return $this->scopeHasMeta($query, $meta, $value, 'like');
    }


    /**
     * @param string $key
     * @param mixed $value
     * @return bool
     */
    public function saveField($key, $value)
    {
        return $this->saveMeta($key, $value);
    }

    /**
     * @param string|array $key
     * @param mixed $value
     * @return bool
     */
    public function saveMeta($key, $value = null, $fresh = false)
    {
        if (!$key) return null;
        if (is_array($key)) {
            foreach ($key as $k => $v) {
                if ($fresh) $this->deleteMeta($k);
                $this->saveOneMeta($k, $v);
            }
            $this->load('meta');

            return true;
        }
        if ($fresh) $this->deleteMeta($key);
        return $this->saveOneMeta($key, $value);
    }
    /**
     * @param string $key
     * @param mixed $value
     * @return bool
     */
    private function saveOneMeta($key, $value)
    {
        $meta = $this->meta()->where('meta_key', $key)
            ->firstOrNew(['meta_key' => $key]);
        // return $meta;
        is_bool($value) && $value = ['bool_val' => $value];
        $result = $meta->fill(['meta_value' => is_array($value) ? serialize($value) : $value])->save();
        $this->load('meta');

        return $result;
    }

    /**
     * @param string $key
     * @param mixed $value
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function createField($key, $value)
    {
        return $this->createMeta($key, $value);
    }

    /**
     * @param string|array $key
     * @param mixed $value
     * @return \Illuminate\Database\Eloquent\Model|\Illuminate\Support\Collection
     */
    public function createMeta($key, $value = null)
    {
        if (is_array($key)) {
            return collect($key)->map(function ($value, $key) {
                return $this->createOneMeta($key, $value);
            });
        }
        return $this->createOneMeta($key, $value);
    }

    /**
     * @param string $key
     * @param mixed $value
     * @return \Illuminate\Database\Eloquent\Model
     */
    private function createOneMeta($key, $mv)
    {
        $meta = $this->meta()->whereMetaKey($key)->whereMetaValue($mv)->first();
        $meta = $meta ??    $this->meta()->create([
            'meta_key' => $key,
            'meta_value' => is_array($mv) ? serialize($mv) : $mv,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        // $result = $meta->fill(['meta_value' => $value])->save();
        $this->load('meta');
        return $meta;
    }

    /**
     * @param string $attribute
     * @return mixed|null
     */
    public function getMeta($attribute, $default = null)
    {
        // $this->metaModel($attribute)->first()->value;
        if ($meta = $this->metaModel($attribute)->first()) {
            $val = $meta->value;
            return is_array($val) ? (Arr::get($val, 'bool_val', null) ?? $val) : $val;
        }
        return $default;
    }
    public function metaModel($key)
    {
        return $this->meta()->whereMetaKey($key);
    }

    public function kvMeta($where = [], $get = null)
    {
        $meta = $this->meta()->whereLike('meta_key', $where);
        return $get ? $meta->get($get) : $meta->get()->metakv();
    }
    public function deleteMeta($key)
    {
        $this->meta()->whereMetaKey($key)->delete();
    }
    //$min = false, $onlyParents = null, $onlyMetas = null
    public function merged($options = [])
    {
        $opts = new Request($options);
        $p = collect($this);
        $m = collect($this->kvMeta());
        if ($opts->minify)
            $p = $p->except(['created_at', 'updated_at', 'deleted_at'])->all();
        if ($opts->onlyParent)
            $p = $p->only($opts->only)->all();
        if ($opts->onlyMeta)
            $m = $m->only($opts->onlyMeta)->all();
        if ($opts->except)
            $p = $p->except($opts->exceptParent)->all();
        if ($opts->exceptMeta)
            $m = $m->except($opts->exceptMeta)->all();

        $fin = [];
        if ($opts->parentOnly) $fin = $p;
        if ($opts->metaOnly) $fin = $m;
        if (!$opts->parentOnly && !$opts->metaOnly)
            $fin = collect($p)->merge($m);
        if ($opts->only) $fin = $fin->only($opts->only)->all();
        if ($opts->except) $fin = $fin->only($opts->excep)->all();
        return $fin;
        //collect($this)->merge($this->kvMeta());
    }
}
