<template>
  <div>
    <router-link :to="{ name: 'home' }" class="toggle-link text-cyan text-sm">
      {{ $t('backToYoteiSite') }}
      <BackIcon class="ml-2" :active="!isTradePage" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BackIcon from '@/components/images/BackIcon.vue';

export default defineComponent({
  name: 'AppNavBack',
  components: {
    BackIcon
  }
});
</script>
<style scoped>
.toggle-link {
  @apply h-full flex items-center;
}
</style>
