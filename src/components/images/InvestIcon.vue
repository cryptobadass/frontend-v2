<template>
  <img
    v-if="active"
    src="~@/assets/images/invest-active.svg"
    width="24"
    height="24"
    class="mr-2"
  />
  <img
    v-else
    src="~@/assets/images/invest.svg"
    width="24"
    height="24"
    class="mr-2"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import useDarkMode from '@/composables/useDarkMode';

export default defineComponent({
  name: 'InvestIcon',

  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  setup() {
    // const { darkMode } = useDarkMode();

    return {
      // darkMode
    };
  }
});
</script>
