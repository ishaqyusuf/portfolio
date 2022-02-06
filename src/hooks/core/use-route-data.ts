import { reactive } from "vue";

const useRouteData = reactive<{ params: any; query: any; meta: any }>({
    params: {},
    query: {},
    meta: {},
});
export default useRouteData;
