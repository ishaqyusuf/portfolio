import useStorage from "@/hooks/core/use-storage";
import { ref } from "vue";
import axios from "axios";

import NProgress from "@/utils/progress";
import qs from "qs";
import device from "./use-device";
import auth from "./use-auth";
import useApiCache from "./use-api-cache";
import useAlert from "./use-alert";

const $clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  },
});
$clientApi.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response.data;
  },
  (error) => {
    // console.log(error);
    NProgress.done();

    let data = error?.response?.data ?? {};
    console.log(data);
    throw data;
    let errors: any = {};

    if (data?.errors)
      Object.keys(errors).map((k) => (errors[k] = data.errors[k][0] ?? null));
    throw {
      ...data,
      ...{ errors },
    }; //error?.response?.data; //new Error(error.response);
  }
);
const authentify = async (request) => {
  const _device: any = device.get();
  // request.headers["device"] = JSON.stringify(_device);
  request.headers["x-device-id"] = _device.visitor_id;

  const token = auth.token;
  useStorage.get("token");
  if (token) request.headers["x-token"] = token;
  // console.log([token, request.url]);
  return request;
};
// function
$clientApi.interceptors.request.use(
  async (request) => {
    NProgress.start();
    if (request.data) {
      for (var key in request.data) {
        if (typeof request.data[key] === "boolean")
          request.data[key] = request.data[key] ? "1" : "0";
      }
      request.data = qs.stringify(request.data);
    }
    return await authentify(request);
  },
  (error) => {
    throw new Error(error);
  }
);
const request = async (
  type: "index" | "get" | "create" | "update" | "delete",
  path: any,
  data: any = null,
  options: IApiConfig = {}
) => {
  let url = getUrl(type, path, data, options);
  let req, response;
  if (
    (type == "index" || type == "get") &&
    (options.softCache || options.deepCache)
  ) {
    response = useApiCache.get(url, options);
    // console.log(response);
  }
  const resolve = ref();
  const reject = ref();
  const promiseMe = new Promise<any>((_resolve, _reject) => {
    resolve.value = _resolve;
    reject.value = _reject;
  });
  if (response) {
    const { data, alert } = response;
    // console.log(response);
    if (options.onSuccess) options.onSuccess(data);
    resolve.value(data);
  } else {
    req = getReq(type, url, data);
    req
      .then((response) => {
        // console.log(response);
        const { data, alert } = response;
        if ((alert || options.alert) && !options.silent)
          useAlert.success(options.alert ?? alert);
        options.print?.value?.show(options.alert ?? alert);
        useApiCache.cache(response, url, options);
        if (options.onSuccess) options.onSuccess(data);
        resolve.value(data);
      })
      .catch((error) => {
        if (error) {
          const { reason, errors, code } = error;

          if (code == 401) auth.logout();
          if ((reason || options.error) && !options.hideError)
            useAlert.error(options.error ?? reason);
          if (errors) useAlert.error(Object.values(errors).join("\n"));
          options.print?.value?.show(options.error ?? reason, true);
          options.onError && options.onError(error);
        }
      });
  }
  return promiseMe;
};
function getReq(type, url, data) {
  let req;
  switch (type) {
    case "get":
      req = $clientApi.get(url);
      break;
    case "create":
      req = $clientApi.post(url, data);
      break;
    case "update":
      req = $clientApi.patch(url, data);
      break;
    case "delete":
      req = $clientApi.delete(url);
      break;
  }
  return req;
}
function getUrl(type, path, data, options) {
  if (typeof path === "string") path = [path];
  if (!options.simple) path.unshift("express");
  let url = path.filter(Boolean).join("/");
  return ["/", url, type == "get" && `?${qs.stringify(data)}`]
    .filter(Boolean)
    .join("");
}

export function useBaseApi(path: any, q = {}, _options: IApiConfig = {}) {
  // console.log(path);
  async function create(form, options: IApiConfig = {}) {
    const data = await useSmartApi.request(
      "create",
      path,
      { ...q, ...form },
      { ..._options, ...options }
    );
    // useSmartApi.toast(data, options);
    return data;
  }
  async function update(id, form, options: IApiConfig = {}) {
    const data = await useSmartApi.request(
      "update",
      [path, id],
      {
        ...q,
        ...form,
      },
      { ..._options, ...options }
    );
    return data;
  }
  return {
    save: async (id, form, options: IApiConfig = {}) => {
      return await (id
        ? update(id, form, { ..._options, ...options })
        : create(form, { ..._options, ...options }));
    },
    index: async (query = {}, options: IApiConfig = {}) => {
      const data = await useSmartApi.request(
        "get",
        path,
        { ...q, ...query },
        { ..._options, ...options }
      );
      return data;
    },
    get: async (id = null, query = {}, options: IApiConfig = {}) => {
      const data = await useSmartApi.request(
        "get",
        [path, id].filter(Boolean),
        { ...q, ...query },
        { ..._options, ...options }
      );
      return data;
    },
    post: create,
    update,
    delete: async (id, options: IApiConfig = {}) => {
      const data = await useSmartApi.request("delete", [path, id], {
        ..._options,
        ...options,
      });
      return data;
    },
  };
}
export interface IApiConfig {
  success?: String;
  alert?: String;
  error?: String;
  silent?: Boolean;
  simple?: Boolean;
  hideError?: Boolean;
  softCache?: Boolean;
  deepCache?: Boolean;
  onSuccess?(data);
  onError?(error);
  formKeyName?: string;
  print?: any;
  errorAlert?: Boolean;
}
export const useSmartApi = {
  request,
};
export function expressApi(path: any, q = {}, _options: IApiConfig = {}) {
  const baseApi = useBaseApi(["express", path].join("/"), q, _options);
  return {
    ...baseApi,
  };
}
const url = (path) => (typeof path == "string" ? path : path.join("/"));
const getId = (form, keyName) => form[keyName ?? "id"];
export function useGetApi(path, options: IApiConfig = {}, query = {}) {
  return useBaseApi(url(path), query, options).index();
}
export function usePostApi(path, form, options: IApiConfig = {}, query = {}) {
  return useBaseApi(url(path), query, options).post(form);
}
export function useUpdateApi(path, form, options: IApiConfig = {}, query = {}) {
  return useBaseApi(url(path), query, options).update(null, form);
}
export function useDeleteApi(path, options: IApiConfig = {}, query = {}) {
  return useBaseApi(url(path), query, options).delete(null);
}
