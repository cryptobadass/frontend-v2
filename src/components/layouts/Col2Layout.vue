<script setup lang="ts">
import { computed } from 'vue';

/**
 * TYPES
 */
type Props = {
  mobileGuttersFirst?: boolean;
  mobileGuttersLast?: boolean;
  mobileHideGutters?: boolean;
  offsetGutters?: boolean;
};

/**
 * PROPS
 */
const props = withDefaults(defineProps<Props>(), {
  mobileGuttersFirst: false,
  mobileGuttersLast: false,
  mobileHideGutters: false,
  offsetGutters: false
});

/**
 * COMPUTED
 */
const gutterClasses = computed(() => ({
  'order-1 lg:order-2': props.mobileGuttersFirst,
  'order-3 lg:order-2': props.mobileGuttersLast,
  'hidden lg:block': props.mobileHideGutters
  // 'mt-6': props.offsetGutters
}));

const centerClasses = computed(() => ({
  'order-2': props.mobileGuttersFirst,
  'order-1 lg:order-2': props.mobileGuttersLast
}));
const rightClasses = computed(() => ({
  'order-2': props.mobileGuttersFirst,
  'order-1 lg:order-2': props.mobileGuttersLast
}));
</script>

<template>
  <div class="layout-container">
    <div :class="['gutter-col', 'box-line', gutterClasses]">
      <slot name="gutterLeft" />
    </div>
    <div :class="['right-col', 'box-line', rightClasses]">
      <div :class="['center-col-2', centerClasses]">
        <slot />
      </div>
      <div :class="['gutter-col-3', gutterClasses]">
        <slot name="gutterRight" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  @apply max-w-full mx-auto px-0 sm:px-4;
  @apply grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-0 lg:gap-x-8;
  max-width: 1720px;
}

.right-col {
  @apply grid grid-cols-5  w-full mx-auto lg:mx-0 col-span-9 bg-dark;
}

.center-col-2 {
  @apply w-full sm:max-w-xl mx-auto lg:mx-0 col-span-2;
}
.gutter-col {
  @apply col-span-3 bg-dark p-6;
}
.gutter-col-3 {
  @apply col-span-3;
}

.box-line {
  @apply rounded border border-gunmetal;
}
</style>
