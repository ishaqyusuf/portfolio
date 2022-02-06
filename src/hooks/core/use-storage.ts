const prefix = "portfolio";
function getName(_name) {
  return [prefix, _name].join("_");
}
function set(name, value) {
  localStorage.setItem(
    getName(name),
    JSON.stringify({
      value: value,
    })
  );
}
function remove(name) {
  localStorage.removeItem(getName(name));
}
function clear() {
  localStorage.clear();
}
function get(name, _default: any = null) {
  let val = JSON.parse(localStorage.getItem(getName(name)) ?? "{}");
  return val?.value ?? _default;
}
export default {
  set,
  remove,
  clear,
  get,
};
