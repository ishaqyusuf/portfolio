import useList from "./use-list";
import useDelay from "./use-time";

const alerts = useList({});

const register = (msg, error = false) => {
  if (!msg) return;
  const id = Date.now();
  alerts.addItem({ id, text: msg, success: !error });
  useDelay(2000).then((d) => {
    alerts.deleteItem({ id });
  });
};
const success = (msg) => {
  register(msg);
};
const error = (msg) => {
  register(msg, true);
};

export default {
  success,
  error,
  alerts,
  register,
};
