import App from "./App.vue";
import "./styles.css";
import router from "./router";
import { createApp } from "vue";
import Dayjs from "@/hooks/core/use-day-js";

let app = createApp(App);

app
  .use(router)
  .use(Dayjs, { lang: "en" })
  // .use((ctx) => {
  //   Object.values(import.meta.globEager("./modules/*.ts")).map((i) =>
  //     i.install?.(ctx, router)
  //   );
  // })
  // .use(clientApiPlugin)
  // .use(utils)
  .mount("#app");
// export const createApp = ViteSSG(App, { }, (ctx) => {
//   ctx.use(clientAppPlugin);
// });
