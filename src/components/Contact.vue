<template>
  <div class="py-10">
    <Container>
      <div class="flex flex-col items-center justify-center space-x-5">
        <p class="text-5xl mb-10 font-extrabold">Get In Touch</p>
        <span class="w-3/5 text-lg text-center"
          >Have an awesome project you want me to work on? Get in touch with me
          for discussion about your projects and
        </span>
        <button
          class="p-4 text-black-500s rounded-lg px-6 text-black-700 font-bold border-2 bg-gradient-to-l from-blue-200 to-blue-100"
        >
          <span> Say Hello</span>
          <i-carbon-email />
        </button>
      </div>
      <!-- <div class="">
        <p class="text-5xl mb-2 font-extrabold">Contact Me</p>
        <span class="font-bold uppercase tracking-wide text-purple-700"
          >Let's Work together!</span
        >
        <div class="sm:flex justify-between">
          <div class="p-4 inline-flex space-x-4 items-center">
            <i-carbon-email class="text-2xl text-red-400" />
            <span>ishaqyusuf024@gmail.com</span>
          </div>
        </div>
      </div> -->
    </Container>
  </div>
</template>
<script lang="ts">
import Container from "./Container.vue";
import ProjectItem from "./ProjectItem.vue";
export default {
  props: {},
  components: { Container, ProjectItem },
  setup(props, { emit }) {
    return {};
  },
};
</script>
