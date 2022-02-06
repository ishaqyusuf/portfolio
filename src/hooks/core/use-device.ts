import FingerprintJs from "@fingerprintjs/fingerprintjs";
import useStorage from "./use-storage";
const load = () =>
  new Promise(async (resolve) => {
    var device = useStorage.get("device");
    if (!device) {
      const fpl = await FingerprintJs.load();
      const { visitorId } = await fpl.get();

      device = { visitor_id: visitorId };
    }
    useStorage.set("device", device);
    resolve(device);
  });

export default {
  get: () => {
    const device = useStorage.get("device_id", {});
    if (!device.visitor_id) {
      device.visitor_id = [...Array(30)]
        .map(() => Math.random().toString(36)[2])
        .join("");
      useStorage.set("device_id", device);
    }
    return device;
  },
};
