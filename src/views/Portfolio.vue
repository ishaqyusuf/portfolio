<template>
  <div>
    <div class="sm:min-h-screen overflow-x-hidden flex items-center">
      <Container class="w-full sm:flex items-center">
        <div class="sm:flex">
          <div class="sm:w-1/2">
            <p class="text-3xl pb-10 sm:text-7xl font-extrabold">portfolio.</p>
            <p class="text-3xl font-light">
              Check out some of my latest <br />
              projects.
            </p>
            <p class="py-5 text-lg font-light tracking-wide">
              Over the past couple of years, i have worked on several projects
              from small to large scaled, private, business and company
              projects. Developing websites and desktop apps and mobile apps;
            </p>
          </div>
          <div
            class="sm:w-1/2 relative transition-all transform translate-x-44 -translate-y-12"
          >
            <img
              class="absolute scale-125 hover:scale-110 -skew-x-12 skew-y-3 hover:z-10 bg-red-400 hover:border-blue-400 transform border-2 rounded-lg border-blue-200 transition-all delay-100 inset-0 object-contain"
              :class="[
                `-translate-x-${index * 10} translate-y-${index * 12}`,
                {},
              ]"
              :src="src"
              v-for="(src, index) in imgs"
              :key="index"
            />
          </div>
        </div>
      </Container>
    </div>
    <Projects></Projects>
  </div>
</template>
<script lang="ts">
import Projects from "@/components/Projects.vue";
import Container from "@/components/Container.vue";
export default {
  props: {},
  components: { Projects, Container },
  setup(props, { emit }) {
    return {
      imgs: [
        "https://res.cloudinary.com/dba9u9ojd/image/upload/v1634252650/portfolio/gnd_0.png",
        "https://res.cloudinary.com/dba9u9ojd/image/upload/v1634252616/portfolio/gnd_1.png",
        "https://res.cloudinary.com/dba9u9ojd/image/upload/v1634252650/portfolio/gnd_3.png",
      ],
    };
  },
};
</script>
