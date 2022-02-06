import { RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    name: "home",
    // redirect: "dashboard",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/portfolio",
    name: "portfolio",
    component: () => import("../views/Portfolio.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/Home.vue"),

    meta: { layout: "default-layout" },
  },
];

export default { routes };
