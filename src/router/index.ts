import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import NProgress from "@/utils/progress";

import useRouteTitle from "@/hooks/core/use-route-title";
import useRouteData from "@/hooks/core/use-route-data";

const _routes: any = [];
Object.values(import.meta.globEager("../**/*.routes.ts")).map((v) => {
  _routes.push(...v.default.routes);
});
export const routes: Array<RouteRecordRaw> = _routes;

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to: any, from: any, next: any) => {
  NProgress.start();
  useRouteTitle(to, from, next);

  const _redirect = to.matched.some((route) => route.redirect);
  if (_redirect) {
    return next();
  }

  // useAuth.check().then((authorized) => {
  //   // console.log(useAuth.can.viewProduction);
  //   let r = to.matched.find((route) => route?.meta?.auth);
  //   const _auth = r?.meta?.auth;
  //   // console.log(auth && _auth(useAuth.can));
  //   if (_auth && !_auth(useAuth.can)) {
  //     if (authorized)
  //       return next({
  //         name: hompePage(),
  //       });
  //     else return redirectLogin();
  //   }
  //   // console.log(to);
  //   if (to?.name == "home") {
  //     // console.log(hompePage());
  //     return next({
  //       name: hompePage(),
  //     });
  //   }
  //   // if (_auth && !authorized)
  // });
  return next();

  function redirectLogin() {
    next({ name: "login", query: { redirectFrom: to.fullPath } });
  }
});
// When each route is finished evaluating...
router.afterEach((routeTo, routeFrom) => {
  useRouteData.params = routeTo.params;
  useRouteData.query = routeTo.query;

  // Complete the animation of the route progress bar.
  NProgress.done();
});
export default router;
