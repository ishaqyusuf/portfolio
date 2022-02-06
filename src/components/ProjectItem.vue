<template>
  <router-link
    :to="{}"
    class="flex mobile:flex-col transition-all group sm:space-x-8 mx-5"
  >
    <div class="w-2/3 sm:w-1/2">
      <img
        class="object-contain w-4/5 h-52s shadow-xl border rounded-2xl group-hover:transistion-x-40"
        :src="project.avatar"
      />
      <!-- src="https://www.datocms-assets.com/38195/1621499794-feedhive-io-macbook-pro-3.png" -->
    </div>
    <div class="flex-1 py-4">
      <span
        :class="{
          'text-black-400 group-hover:border-black-400': !dark,
          'text-black-100 group-hover:border-yellow-400 group-hover:text-yellow-300': dark,
        }"
        class="font-semibold border-transparent border-b-2 py-1 text-3xl"
      >
        PRO-DESK: GND Millwork Construction Company
      </span>
      <p
        :class="{
          'text-gray-500': !dark,
          'text-yellow-400': dark,
        }"
        class="my-4 text-sm"
      >
        August 2, 2020
      </p>
      <p
        class="text-base sm:text-lg my-3"
        :class="{
          'text-black-300': !dark,
          'text-gray-400': dark,
        }"
      >
        Project Management System for a millwork construction company
        consisiting of several modules/systems such as the project management,
        employee managements, accounting, invoice management, tracking,
        statistics and reports.
      </p>
    </div>
  </router-link>
</template>
<script lang="ts">
import { useState } from "@/hooks/core/use-state";
import { toRefs } from "@vue/reactivity";

export default {
  props: {
    project: { type: Object, required: true },
  },
  components: {},
  setup(props, { emit }) {
    return {
      ...toRefs(useState),
    };
  },
};
</script>
