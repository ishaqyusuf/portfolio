import { IApiConfig } from "@/hooks/core/use-api";
import { ref } from "vue";
import useStorage from "./use-storage";

const cache = (response, url, option: IApiConfig) => {
  if (!response.error) {
    if (option.softCache) softCache.value[url] = response;
    if (option.deepCache) useStorage.set(url, response);
  }
};
const softCache = ref<any>({});
const get = (url, option: IApiConfig) => {
  const cdata = option.deepCache ? useStorage.get(url) : softCache.value[url];
  return cdata;
};
export default {
  get,
  cache,
};
