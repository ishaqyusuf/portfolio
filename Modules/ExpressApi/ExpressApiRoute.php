<?php

namespace Modules\ExpressApi;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ExpressApiRoute
{

    public $indexRequest = true;
    public $postRequest = true;
    public $updateReuqest = true;
    public $deleteRequest = true;
    public $latest = true;

    public $model = null;
    public $existing = null;
    public $keyName = 'id';
    public $ignoreDefaultUpdate = false;
    public $ignoreDefaultCreate = false;
    public $ignoreDefaultDelete = false;
    public $ignoreDefaultIndex = false;
    public $post = false;


    public $paginate = false;

    public $uniqueCols = null;
    public $single = false;
    public $alert = null;

    public $statusCode  = 301;
    public $errors = [];



    public $error = false;
    public $errorData = null;
    public $overrideData = null;
    public $overrideWithTransformer = null;
    public $overrideWithoutData = false;
    public function rules()
    {
        return [];
    }
    public function transform($item)
    {
        return $item;
    }
    public function prepareRules($rules = [], $complexRules = [], $postRules = [], $patchRules = [])
    {
        $__rules = [];
        if ($rules)
            foreach ($rules as $k => $v)
                $__rules[$k] = is_array($v) ? Collect($v)->filter(fn ($v) => $v)->values()->toArray() : $v;
        foreach ([
            'post' => $postRules,
            'patch' => $patchRules
        ] as $m => $_rules)
            if (request()->isMethod($m) && $_rules)
                $__rules = array_merge($__rules, $_rules);
        foreach ($complexRules as $k => $v)
            foreach ($v as $_k) $__rules[$_k] = $k;
        return $__rules;
    }
    public function unique($table, $column)
    {
        return Rule::unique($table)->where(
            function ($query) use ($column) {
                // $department && $query->where('department_id', Auth::user()->department->id);
                if ($this->existing) $query->where($column, '!=', $this->existing->$column);
                return $query;
            }
        );
    }
    public function saveFormRequestWithMeta($existing = null)
    {
        return $this->saveFormRequest($existing);
    }
    public function saveFormRequest($existing = null)
    {
        $this->existing = $existing;
        $rules = $this->rules();
        $validator = Validator::make(request()->all(), $rules);
        if ($validator->fails()) return new SaveFormResult(null, $validator->errors());
        $data = $validator->validate();
        if ($existing)
            $existing->update($data);
        else {

            if ($this->uniqueCols) {
                $existing = ($this->model)::updateOrCreate(
                    Collect($data)->only($this->uniqueCols)->toArray(),
                    Collect($data)->except($this->uniqueCols)->toArray()
                );
            } else
                $existing = ($this->model)::create($data);
        }
        if ($existing && ($meta = request()->meta)) $existing->saveMeta($meta);
        return new SaveFormResult($existing);
    }

    public function saveFormWithResponse($existing = null, $uniqueCols = null, $meta = null)
    {
        $form = $this->saveFormRequest($existing, $uniqueCols, $meta);
        return $form->response();
    }
    public function onBeforeIndex($request)
    {
    }
    public function onAfterIndex($request)
    {
    }
    public function onBeforePost($request)
    {
    }
    public function onBeforeGet($request)
    {
    }
    public function onAfterGet($request, $model)
    {
    }
    public function onAfterPost($request, $model)
    {
    }
    public function onBeforePatch($request, $model)
    {
    }
    public function onAfterPatch($request, $model, $form)
    {
    }
    public function onBeforeDelete($request, $model)
    {
    }
    public function onAfterDelete($request)
    {
    }
    public function index($request, $query)
    {
        return $query;
    }
}
class SaveFormResult
{
    public $data;
    public $errors;
    public function __construct($data, $errors = null)
    {
        $this->data = $data;
        $this->errors = $errors;
    }
    public function success()
    {
        return (new Controller)->_success($this->data->fresh()->_transform());
    }
    public function error()
    {
        return (new Controller)->_error(null, $this->errors); //($this->data->_transform);
    }
    public function response()
    {
        // return $this->data;
        if ($this->data)
            return $this->success();
        return $this->error();
    }
}
