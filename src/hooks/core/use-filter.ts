import useDebouncedRef from "./use-debounce";
import useForm from "./use-form";
import useRouteData from "./use-route-data";
import { watch } from "vue";
import router from "@/router";
export function composeFilterQuery(data, defaults) {
  let od: any = { ...useRouteData.query };
  Object.keys(data).map((k) => {
    if (k != "_default") {
      let v = data[k];
      if (v == "" || v == [] || v == {} || v == null) {
        delete od[k];
      } else od[k] = typeof v == "string" ? v : v.join(",");
    }
  });
  delete od["page"];
  Object.keys(defaults ?? {}).map((k) => {
    if (od[k] == defaults[k]) delete od[k];
  });
  return od;
}
export interface IFilter {
  data?: any;
  defaults?: any;
}
export function useFilter(_filter: IFilter, load: any) {
  const { data, defaults } = _filter;
  let fdata: any = {
    _default: { ...(defaults ?? {}) },
  };
  const q = useRouteData.query;
  Object.keys(data ?? {}).map((k) => {
    // console.log(q[k] ?? data[k]);
    fdata[k] = useDebouncedRef(q[k] ?? data[k]);
  });
  const filter = useForm({
    data: fdata,
  });
  if (data) {
    watch(
      () => filter.data(),
      (value) => {
        const _data = composeFilterQuery(value, defaults ?? {});
        load({ ..._data }, true);
        router.push({
          query: {
            ..._data,
          },
        });
      }
    );
  }
  return filter;
}
