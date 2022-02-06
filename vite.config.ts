import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";

import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import { HeadlessUiResolver } from "unplugin-vue-components/resolvers";
import analyze from "rollup-plugin-analyzer";
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [analyze()],
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@views": resolve(__dirname, "src/views"),
      "@services": resolve(__dirname, "src/core/services"),
      "@use": resolve(__dirname, "src/use"),
      "@utils": resolve(__dirname, "src/utils"),
      "@locales": resolve(__dirname, "src/locales"),
      "@mixins": resolve(__dirname, "src/mixins"),
      "@core": resolve(__dirname, "src/core"),
      "@assets": resolve(__dirname, "src/assets"),
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        IconsResolver(),
        //  AntDesignVueResolver({}),
        HeadlessUiResolver({ prefix: "Tw" }),
      ],
      dirs: ["src/core/components", "src/components/shared"],
      deep: true,
    }),
    Icons({}),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
  ],
  // ssgOptions: {
  //   script: "async",
  //   formatting: "minify",
  // },
});
