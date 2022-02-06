<?php

namespace Modules\ExpressApi;

use Exception;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function index(Request $request)
    {
        $ea = _ExpressApi::getController();
        $ti = $ea->transformerInstance;
        $ti->onBeforeIndex($request);
        if ($override = $this->overrideAction($ti))
            return $override;

        $index = $ea->transformerInstance->index($request, $ea->transformerInstance->model::query());
        if ($ti->latest) $index->latest();
        // $builder = Builder::class;
        // if(!$index instanceof $builder)  {
        //     return $this->_success($index);
        // }
        try {
            $isSingle = ($request->single_request || $ti->single);
            return $this->ok(
                $ea->transformerInstance,
                $isSingle ? $index->first() : $index->get(),
                null,
                !$isSingle
            );
        } catch (Exception $e) {
        }

        return $this->_success($index);
    }
    public function get(Request $request)
    {
        $mc = _ExpressApi::getController();
        $service = $mc->transformerInstance;
        $service->onBeforeGet($request);

        if ($override = $this->overrideAction($service))
            return $override;
        $data = ($mc->model)::where($mc->keyName(), $request->__id)->first();
        $mc->transformerInstance->onAfterGet($request, $data);
        if ($data)
            return $this->_success($mc->transform($data));
        return $this->_error('Not Found');
    }

    public function overrideAction($service)
    {
        // $isSingle = ($->single_request || $service->single);
        if ($owt = $service->overrideWithTransformer)
            return $this->ok(
                $service,
                $owt,
                $service->alert,
                $service->paginate
            );
        if (($od = $service->overrideData) || $service->overrideWithoutData)
            return $this->_success($od, $service->alert);
        $err = $service->errorData;
        if ($err || $service->error)
            return $this->_error($err, $service->errors, $service->statusCode);
        return null;
    }
    public function create(Request $request)
    {
        $mc = _ExpressApi::getController();
        $ti = $mc->transformerInstance;
        $ti->onBeforePost($request);
        if ($override = $this->overrideAction($ti))
            return $override;

        $form = $ti->saveFormRequestWithMeta(null);
        if ($form->data) {
            $mc->transformerInstance->onAfterPost($request, $form->data);
            return $this->_success($mc->transform($form->data));
        }
        return $this->_error(null, $form->errors);
    }
    public function update(Request $request)
    {
        $mc = _ExpressApi::getController();
        $data = ($mc->model)::where($mc->keyName(), $request->__id)->first();
        $mc->transformerInstance->existing = $data;
        if ($data) {
            $ti =  $mc->transformerInstance;
            $ti->onBeforePatch($request, $data);
            if ($override = $this->overrideAction($ti))
                return $override;

            if ($ti->ignoreDefaultUpdate) return $this->_success($mc->transform($data));

            $form = $ti->saveFormRequestWithMeta($data);
            $ti->onAfterPatch($request, $data, $form);
            if ($form->data)
                return $this->_success($mc->transform($data));
            return $this->_error(null, $form->errors);
            // return $form->response();
        }
        return $this->_error('Not Found');
    }
    public function delete(Request $request)
    {
        $mc = _ExpressApi::getController();
        $data = ($mc->model)::where($mc->keyName(), $request->__id)->first();
        if ($data) {
            $ti =  $mc->transformerInstance;
            $ti->onBeforeDelete($request, $data);
            $data->delete();
            $ti->onAfterDelete($request);
            return $this->ok();
        }
        return $this->_error('Not Found');
    }
}
