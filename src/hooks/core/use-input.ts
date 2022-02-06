import { computed, isRef, PropType, reactive, ref } from "vue";
import { IGeo } from "./use-geo";
import { useModelWrapper } from "./use-model-wrapper";
import useTime from "./use-time";

export function useInputFn(props, emit) {
  const getValue = () => {
    const { itemText, valueFormat, itemValue, items, modelValue } = props;
    if (itemText || itemValue || items) {
      const isObject = typeof modelValue === "object";
      if (!isObject) {
        if (itemValue && modelValue) {
          const realItem = (items as any).find(
            (item) => item[itemValue] == modelValue
          );
          if (itemText && realItem) return realItem[itemText];
        }
      }
      if (isObject && itemText && modelValue && !itemValue) {
        // returned value is an object
        return (modelValue as any)[itemText];
      }
      if (modelValue && props.items) {
        if (isObject) {
          if (itemText) return (modelValue as any)[itemText];
          if (itemValue && !itemText)
            return itemList().find((item) => item[itemValue] == modelValue);
        }
      }
    }
    return valueFormat ? valueFormat(modelValue) : modelValue;
  };
  const setValue = (value) => {
    const { itemText, itemValue, autoComplete, source } = props;
    const isObject = typeof value === "object";
    if (itemText) {
      const val = isObject
        ? value
        : itemList().find((item) => item[itemText] == value);
      if (val) {
        if (itemValue) return val[itemValue];
        return val;
      }
      if (!autoComplete) return val;
    }
    return value;
  };

  const itemList = (): any[] => {
    const _items = props.items;
    return (isRef(_items) ? _items.value : _items) as any[];
  };
  const useCustomGetter: any =
    props.itemText || props.itemValue || props.valueFormat;
  // console.log(props.modelValue);

  const { custom, modelValue } = props;
  const model = useModelWrapper<any>(
    props,
    emit,
    "modelValue",
    (custom && modelValue.get) || (useCustomGetter && getValue),
    (custom && modelValue.set) || (useCustomGetter && setValue)
  );
  const showList = ref(false);
  const state = reactive({
    preventBlur: false,
    index: -1,
    listOpened: false,
    focused: false,
    isTyping: false,
    hideText: false,
    value: "",
  });
  if (props.password) state.hideText = true;
  const selectItem = (value) => {
    // console.log(value);
    // state.preventBlur = true;
    model.value = value;
    emit("enter", value);
  };
  const inputFocus = () => {
    if (!(props.disabled && props.readonly)) {
      showList.value = (props.items || props.source) != null;
      state.focused = true;
      state.isTyping = false;
      state.value = validateInput(model.value);
      emit("focus");
    }
  };
  const safeString = (str) => {
    return str;
  };
  const result = computed(() => {
    const { items, itemText } = props;
    let rt = ["^", model.value].filter(Boolean).join("");
    const re = new RegExp(rt, `i`);
    return items?.filter(
      (item) =>
        !state.isTyping || re.test(safeString(itemText ? item[itemText] : item))
    );
  });
  const inputBlur = async () => {
    if (props.autoComplete || props.select || props.combobox)
      await useTime(500);
    if (state.preventBlur) state.preventBlur = false;
    else {
      state.focused = showList.value = state.isTyping = false;
      const { autoComplete, combobox, itemText, itemValue } = props;
      if (autoComplete) {
        const item = validateInput(model.value);

        if (!item) model.value = state.value;
        // else
      }
      if (!autoComplete || model.value != state.value) {
        emit("selected", model.value);
        if (props.geo) props.geo.dataChange();
      }
    }
  };
  const validateInput = (value) => {
    const { autoComplete, combobox, source, itemText, itemValue } = props;
    if (autoComplete) {
      const item = itemList().find(
        (item) => (itemText ? item[itemText] : item) == value
      );
      return item;
    }
    return value;
  };
  const multiChoice = () => {
    if (result.value?.length > 0) return true;
    return false;
  };
  const input = ref();
  const isReadonly = computed(
    () =>
      props.readonly ||
      props.disabled ||
      props.select ||
      (props.form &&
        (props.name || props.formName) &&
        props.form.readonly[props.formName ?? props.name])
  );
  return {
    input,
    state,
    isReadonly,
    selectItem,
    result,
    inputFocus,
    inputBlur,
    showList,
    model,
    up($event) {
      if (!multiChoice()) return;
      $event.preventDefault();
      state.index = Math.max(0, state.index - 1);
    },
    down($event) {
      if (!multiChoice()) return;

      $event.preventDefault();
      state.index = Math.min(result.value.length, state.index + 1);
    },
    closeInput($event) {
      inputBlur();
      state.listOpened = false;
      input.value.parent?.focus();
    },
    enter($e) {
      if (!multiChoice()) {
        emit("enter");
        return;
      }
      if (state.index) {
        model.value = result[state.index];
        state.listOpened = state.focused = false;
        input.value.blur();
        emit("enter");
      }
    },
    getObjectValue(item, key, defaultValue: any = null) {
      return typeof item === "object" && key && item ? item[key] : defaultValue;
    },
  };
}

export default {
  props: {
    flexed: Boolean,
    container: String,
    grid: Boolean,
    static: Boolean,
    form: Object,
    centerGrid: Boolean,
    dark: Boolean,
    password: Boolean,
    value: {},
    items: Array,
    name: String,
    light: Boolean,
    formName: String,
    pilot: Boolean,
    id: String,
    itemText: String,
    itemValue: String,
    type: { default: "text" },
    valueFormat: Function,
    combobox: Boolean,
    select: Boolean,
    autoComplete: Boolean,
    rounded: Boolean,
    menu: Boolean,
    textarea: Boolean,
    inputClass: String,
    loading: Boolean,
    plain: Boolean,
    modelValue: [String, Object, Number],
    centerText: Boolean,
    tile: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    geo: Object as PropType<IGeo>,
    dense: Boolean,
    clearable: Boolean,
    prependIcon: String,
    placeholder: String,
    maxlength: Number,
    prependInnerIcon: String,
    prefix: String,
    suffix: String,
    appendIcon: String,
    appendInnerIcon: String,
    label: String,
    source: String,
    custom: Boolean,
  },
};
export function useDimension({ form, key = "dimension", style = " * " }) {
  return {
    transform() {
      const _t: any = {};
      this.get()
        .replace(/[^.\d]/g, ":")
        .split(":")
        .map((v, i) => {
          i == 0 && (_t.length = v);
          i == 1 && (_t.width = v);
          i == 2 && (_t.height = v);
        });
      // form.refresh(_t);
      return _t;
    },
    get: () => {
      return form.data()[key];
    },
    set(value) {
      const dims = (value as string)
        .replace(/[^.\d]/g, ":")
        .split(":")
        .filter((v) => v)
        .filter((v, i) => i < 3);
      let data: any = {};
      data[key] = dims.join(style);
      form.refresh(data);
    },
  };
}
