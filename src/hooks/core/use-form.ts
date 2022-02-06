import qs from "qs";
import { IApiConfig, useBaseApi } from "./use-api";

import { reactive, watch } from "vue";
import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import useStorage from "./use-storage";

interface IFormArg {
  rememberKey?;
  data?;
  config?;
  options?: IApiConfig;
  url?;
  dataKey?;
  onSubmit?(data, config: IApiConfig);
  query?;
  transform?;
  printData?;
  hidden?;
  readonly?;
  ready?;
  onDirty?(old, value);
}
interface IForm {
  // hidden: any,
  // readonly: any
}
export default function useForm(args: IFormArg = {}) {
  let { rememberKey, data, hidden, readonly } = args;
  if (!data) data = {};
  const dataKey = args.dataKey ? args.dataKey : "id";
  //   const rememberKey = typeof args[0] === "string" ? args[0] : null;
  //   const data = (typeof args[0] === "string" ? args[1] : args[0]) || {};
  const restored = rememberKey ? useStorage.get(rememberKey) : null;
  // console.log(cloneDeep);
  let defaults;
  let cancelToken = null;
  let recentlySuccessfulTimeoutId: any = null;
  let transform = (data) => (args.transform ? args.transform(data) : data);
  function getFormKey() {
    return form.data()[dataKey];
  }
  let form = reactive({
    ...(restored ? restored.data : data),
    hidden: hidden ?? {},
    readonly: readonly ?? {},
    isDirty: false,
    watching: false,
    errors: restored ? restored.errors : {},
    hasErrors: false,
    processing: false,
    progress: null,
    wasSuccesful: false,
    recentlySuccessful: false,
    data(transformed = false) {
      let __data = Object.keys(data).reduce((carry, key) => {
        carry[key] = this[key];
        return carry;
      }, {});
      return transformed ? form.transform(__data) : __data;
    },
    transform(callback) {
      transform = callback;
      return this;
    },
    refresh(fields) {
      // console.log(fields);
      let clonedDefaults = cloneDeep(defaults);
      const fks = Object.keys(fields);
      Object.assign(
        this,
        Object.keys(clonedDefaults)
          // .filter((k) => fks.includes(k))
          .filter((k) => fields[k])
          .reduce((carry, key) => {
            carry[key] = fields[key];
            return carry;
          }, {})
      );
    },
    reset(...fields) {
      let clonedDefaults = cloneDeep(defaults);
      if (fields.length == 0) {
        Object.assign(this, clonedDefaults);
      } else {
        Object.assign(
          this,
          Object.keys(clonedDefaults)
            .filter((key) => fields.includes(key))
            .reduce((carry, key) => {
              carry[key] = clonedDefaults[key];
              return carry;
            }, {})
        );
      }
      return this;
    },
    clearErrors(...fields) {
      this.errors = Object.keys(this.errors).reduce(
        (carry, field) => ({
          ...carry,
          ...(fields.length > 0 && !fields.includes(field)
            ? { [field]: this.errors[field] }
            : {}),
        }),
        {}
      );

      this.hasErrors = Object.keys(this.errors).length > 0;
      return this;
    },
    submit(silentData = null, option2: any = {}) {
      const _data = silentData ? silentData : transform(form.data());
      // const _data = transform(form.data());
      // if (args.printData) console.log(qs.stringify(_data));
      form.wasSuccessful = false;
      form.recentlySuccessful = false;
      form.processing = true;
      let opts: IApiConfig = {
        ...args.options,
        ...option2,
        onSuccess(response) {
          form.processing = false;
          form.progress = null;
          form.clearErrors();
          form.wasSuccessful = true;
          form.recentlySuccessful = true;
          form.recentlySuccessfulTimeoutId = setTimeout(
            () => (form.recentlySuccessful = false),
            2000
          );
          // defaults = cloneDeep(this.data());
          form.isDirty = false;
          if (args.options?.onSuccess) args.options?.onSuccess(response);
        },
        onError(err) {
          form.processing = false;
          form.progress = null;
          form.errors = err?.errors ?? {};
          form.hasErrors = true;
          if (args.options?.onError) args.options?.onError(err);
        },
      };
      args.onSubmit
        ? args.onSubmit(_data, opts)
        : useBaseApi(args.url, args.query, opts).save(getFormKey(), _data);
      // ).then((data) => {});
    },
    __rememberable: rememberKey === null,
    __remember() {
      return { data: this.data(), errors: this.errors };
    },
    __restore(restored) {
      Object.assign(this, restored.data);
      Object.assign(this.errors, restored.errors);
      this.hasErrors = Object.keys(this.errors).length > 0;
    },
  });
  defaults = cloneDeep(data);
  // form.watching = true;
  watch(
    form,
    (newValue) => {
      if (form.watching) {
        form.isDirty = !isEqual(form.data(), defaults);
        if (rememberKey) {
          useStorage.set(rememberKey, cloneDeep(newValue.__remember()));
        }
        // if (args.onDirty) args.onDirty(form.data(), defaults);
      }
    },
    { immediate: true, deep: true }
  );
  return form;
}
