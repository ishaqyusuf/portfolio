import alertHook from "@/hooks/core/use-alert";
export default {
  /**
   * Equivalent to console.error but in dev mode only
   * @param  {...any} args
   */
  error: (...args) => {
    if (import.meta.env.MODE !== "production") {
      // console.error(...args);
      // alertHook.register("Oops Snap!. Something went wrong, try again!", true);
    } else {
      console.error("Something is wrong");
    }
  },
  /**
   * Equivalent to console.log but in dev mode only
   * @param  {...any} args
   */
  log: (...args) => {
    if (import.meta.env.MODE !== "production") {
    } else {
    }
  },
  /**
   * Equivalent to console.warn but in dev mode only
   * @param  {...any} args
   */
  warn: (...args) => {
    if (import.meta.env.MODE !== "production") {
      console.warn(...args);
    } else {
      console.warn("Something is wrong");
    }
  },
};
