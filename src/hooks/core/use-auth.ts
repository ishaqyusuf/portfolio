import router from "@/router";
import { reactive, ref } from "vue";
import useStorage from "./use-storage";
import useForm from "./use-form";
import { useBaseApi } from "./use-api";
import { RoleActions } from "../data/use-role-actions";
// import roleList from "../role-list";
import useRoles from "./use-roles";
import { objectToString } from "@vue/shared";

function check() {
  return new Promise((resolve) => {
    const token = useStorage.get("token", null);

    // resolve(token != null);
    // return;

    if (!token) {
      logout(true);
      resolve(false);
    } else {
      auth.token = token;
      signIn({ token, user: useStorage.get("user") });
      resolve(token);
    }
  });
}
function signIn(data, callback: any = null, silentLogout = false) {
  const { user, token } = data;
  auth.can = {};
  if (token) {
    useStorage.set("token", token);
    useStorage.set("user", user);
    auth.user = user;
    auth.token = token;
    auth.isCustomer = !user.role;
    auth.loggedIn = true;
    initRoles(user.role);
    callback && callback();
  } else logout(silentLogout);
}
const apiPrinter = ref<any>();
const form = useForm({
  data: {
    email: null,
    password: null,
    remember: false,
  },
  rememberKey: "login",
  url: "auth",
  options: {
    onSuccess: (data) => {
      if (data.token) {
        signIn(data);
        // if(auth.can.viewDash)
        router.push({ name: hompePage() });
      }
    },
    print: apiPrinter,
  },
});
export let hompePage = () => {
  // console.log(auth.can);
  let homes = {
    dashboard: auth.can.viewDash,
    projects: auth.can.viewProject,
    productions: auth.can.viewProduction,
    installations: auth.can.viewInstallation,
    tasks: auth.can.viewTasks,
    login: true,
  };
  // console.log(homes);
  let name: any = null;
  Object.keys(homes).map((k) => !name && homes[k] && (name = k));
  // console.log(auth.can);
  return name;
};
const auth = reactive({
  user: {} as any,
  token: null,
  isCustomer: false,
  loggedIn: false,
  logout,
  form,
  apiPrinter,
  can: {} as { [id in any]: boolean },
  signIn,
  check,
  homePage: "dashboard",
  updateUser,
  checkPermission(...actions: RoleActions[]) {
    return actions.every((action) => auth.hasPermission(action));
  },
  hasPermission(action: RoleActions) {
    return auth.can[action as any];
  },
  goHome() {
    router.push(auth.homePage);
  },
});
function updateUser(_user) {}
async function logout(silent = false) {
  auth.user = auth.token = null;
  auth.loggedIn = auth.isCustomer = false;
  // auth.permissions = [];
  auth.can = {};
  const token = useStorage.get("token");
  // console.log(token);
  if (token) {
    auth.token = token;
    useBaseApi("auth/logout", {}, {}).index();
    useStorage.remove("token");
  }
  if (!silent) router.push({ name: "home" });
}
export default auth;

const initRoles = (role) => {
  auth.can = {};
  if (role) {
    auth.can = useRoles.permissions(role) as any;
    // console.log(auth.actions);
  }
};
