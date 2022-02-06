<template>
  <div
    class="h-16 shadow-xl bg-gradient-to-b transform transition-all"
    :class="{
      'from-black-500 to-black-500 text-gray-100': dark,
      'text-gray-700': !dark,
    }"
  >
    <div
      class="px-4 sm:px-0 sm:mx-auto h-full sm:max-w-3/4 flex justify-between items-center"
    >
      <router-link to="/" class="font-bold">Is-haq Yusuf</router-link>
      <div class="inline-flex items-center space-x-4">
        <div
          class="inline-flex items-center space-x-4 font-semibold"
          :class="{}"
        >
          <router-link
            class="rounded-lg p-2 px-4 transform hover:shadow-sm transition-all hover:-translate-y-0.5"
            :class="{
              'hover:bg-blue-400': dark,
              'hover:bg-gray-200': !dark,
            }"
            :to="{ name: 'portfolio' }"
          >
            Portfolio
          </router-link>
          <!-- <router-link :to="{}"> Services </router-link> -->
          <router-link
            :to="{}"
            class="rounded-lg p-2 px-4 transform hover:shadow-sm transition-all hover:-translate-y-1"
            :class="{
              'bg-blue-400': dark,
              'bg-gray-200': !dark,
            }"
          >
            <span>Hire me today</span>
          </router-link>
          <a target="_blank" class="p-2" href="https://github.com/ishaqyusuf">
            <i-carbon-logo-github />
          </a>
          <a target="_blank" class="p-2" href="https://twitter.com/ishaqyusuf">
            <i-carbon-logo-twitter />
          </a>
          <button @click="toggle()">
            <!-- <i-carbon-light v-if="dark" /> -->
            <i-carbon-asleep v-if="dark" />
            <!-- <i-carbon-light-filled v-else /> -->
            <i-carbon-asleep-filled v-else />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useState } from "@/hooks/core/use-state";
import { toRefs } from "@vue/reactivity";

export default {
  props: {},
  components: {},
  setup(props, { emit }) {
    return {
      ...toRefs(useState),
    };
  },
};
</script>
