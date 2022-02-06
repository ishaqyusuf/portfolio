<template>
  <div
    class="py-10"
    :class="{
      '': dark,
      '': !dark,
    }"
  >
    <Container>
      <div class="">
        <p class="text-5xl mb-2 font-extrabold">Projects</p>
        <span
          class="font-bold uppercase tracking-wide"
          :class="{
            'text-yellow-500': dark,
            'text-purple-700': !dark,
          }"
          >Recent Projects</span
        >
      </div>
    </Container>
    <div class="space-y-4 sm:space-y-20 my-16">
      <ProjectItem
        v-for="(project, index) in projects"
        :project="project"
        :key="index"
      ></ProjectItem>
    </div>
  </div>
</template>
<script lang="ts">
import { useState } from "@/hooks/core/use-state";
import { toRefs } from "@vue/reactivity";
import Container from "./Container.vue";
import ProjectItem from "./ProjectItem.vue";
export default {
  props: {},
  components: { Container, ProjectItem },
  setup(props, { emit }) {
    return {
      projects: [
        "https://res.cloudinary.com/dba9u9ojd/image/upload/v1634252650/portfolio/gnd_0.png",
        "https://res.cloudinary.com/dba9u9ojd/image/upload/v1634252616/portfolio/gnd_1.png",
        "https://res.cloudinary.com/dba9u9ojd/image/upload/v1634252650/portfolio/gnd_3.png",
      ].map((p) => {
        return {
          avatar: p,
        };
      }),
      ...toRefs(useState),
    };
  },
};
</script>
