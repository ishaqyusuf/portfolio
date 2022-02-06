<template>
  <div
    class="font-inter"
    :class="{
      'bg-black-900 text-gray-200': dark,
      'text-gray-700': !dark,
    }"
  >
    <AgencyHeader></AgencyHeader>
    <Header class=""></Header>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { onMounted, toRefs } from "vue";
import Header from "./components/Header.vue";
import AgencyHeader from "./components/AgencyHeader.vue";
import { useState } from "./hooks/core/use-state";
export default {
  props: {},
  components: { Header, AgencyHeader },
  setup(props, { emit }) {
    onMounted(() => {});
    return {
      ...toRefs(useState),
    };
  },
};
</script>

<style scoped></style>
