import { computed } from "vue";
export const emits = ["update:modelValue", "onUpdate:modelValue"];
export function useModelWrapper<T>(
    props,
    emit,
    name = "modelValue",
    getFn: any = null,
    setFn: any = null
) {
    return computed<T>({
        get: () => (getFn ? getFn() : props[name]),
        set: (value) => emit(`update:${name}`, setFn ? setFn(value) : value),
    });
}
