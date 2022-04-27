<script setup lang="ts">
type Props = {
  hasBalance: boolean;
  symbol: string;
  weight: string;
  isSelected: boolean;
};

withDefaults(defineProps<Props>(), {
  hasBalance: false,
  isSelected: false
});
</script>

<template>
  <div
    :class="[
      'pill',
      {
        'pill-selected': isSelected
      }
    ]"
  >
    <div v-if="hasBalance" class="balance-indicator" />
    <span>
      {{ symbol }}
    </span>
    <span class="pill-weight">
      {{ weight }}
    </span>
  </div>
</template>

<style scoped>
.pill {
  @apply flex text-white items-center px-2 mr-2 my-1 py-1 rounded-lg bg-dark-2 dark:bg-dark-2 relative;
}
.pill:last-child {
  @apply mr-0;
}

.pill-selected {
  @apply bg-cornflower-600 dark:bg-cornflower-600;
  @apply text-white;
}

.pill-weight {
  @apply font-medium text-white text-xs;
  @apply mt-px ml-1;
}

.balance-indicator {
  @apply w-3 h-3;
  @apply rounded-full border-2 border-white dark:border-gray-850 group-hover:border-gray-50 dark:group-hover:border-gray-800;
  @apply bg-green-200 dark:bg-green-500;
  @apply absolute top-0 right-0 -mt-1 -mr-1;
}
</style>
