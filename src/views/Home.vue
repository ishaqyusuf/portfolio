<template>
  <div class="">
    <div
      class="min-h-screen flex items-center font-inter bg-gradient-to-br transition-all delay-500"
      :class="{
        'text-gray-300 from-black-600 to-black-700': useState.dark,
        'text-gray-800 to-gray-200 bg-gradient-to-b from-gray-100': !useState.dark,
      }"
    >
      <Container>
        <div class="flex">
          <div class="sm:justify-center sm:flex">
            <div>
              <span
                :class="{
                  'text-yellow-500': useState.dark,
                  'text-yellow-700': !useState.dark,
                }"
                class="font-extrabold tracking-wide sm:text-lg"
                >- Ishaq Yusuf</span
              >
              <p class="text-5xl font-bold">
                Hi, my name is
                <br class="sm:hidden" />
                Is-haq. <br />
                <span class="font-semibold block my-4 sm:my-6"
                  >I create
                  <span
                    :class="{
                      'from-red-400 to-yellow-600 bg-gradient-to-br border-yellow-400':
                        useState.dark,
                      'from-yellow-200 to-green-400 ': !useState.dark,
                    }"
                    class="border-b-4 px-1 rounded-md bg-gradient-to-br"
                    >beautiful</span
                  >
                  websites your users will love.</span
                >
              </p>
              <button
                class="p-4 bg-gradient-to-l from-green-400 to-green-300 text-black-700 font-semibold text-sm rounded-lg"
              >
                Make it happen
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
    <Projects></Projects>
    <Contact></Contact>
  </div>
</template>
<script lang="ts" setup>
import SkillSet from "@/components/SkillSet.vue";
import { useState } from "@/hooks/core/use-state";
import { toRefs } from "@vue/reactivity";
import Container from "@/components/Container.vue";
import Projects from "@/components/Projects.vue";
import Contact from "@/components/Contact.vue";

// defineExpose({
//   ...toRefs(useState),
// });
</script>
