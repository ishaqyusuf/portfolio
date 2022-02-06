import { reactive } from "vue";
import useStorage from "./use-storage";

export let useState = reactive({
  dark: false,
  toggle() {
    this.dark = !this.dark;
    this.save();
  },
  save() {
    let _state: any = {};
    Object.keys(useState).map((k) => {
      if (typeof useState[k] !== "function") _state[k] = useState[k];
    });
    useStorage.set("state", _state);
  },
  load() {
    let _states = useStorage.get("state", {});
    Object.keys(_states).map((s) => (useState[s] = _states[s]));
  },
});
