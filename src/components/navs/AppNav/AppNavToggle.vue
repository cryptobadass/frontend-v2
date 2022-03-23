<template>
  <div :class="`app-nav-toggle bg-white text-black dark:bg-white`">
    <router-link
      :to="{ name: 'home' }"
      :class="[
        'toggle-link px-8 rounded-l-lg',
        { [activeClasses]: !isTradePage },
      ]"
      @click="trackGoal(Goals.ClickNavInvest)"
    >
      <InvestIcon :active="!isTradePage" />
      {{ $t('invest') }}
    </router-link>
    <router-link
      :to="{ name: 'trade' }"
      :class="[
        'toggle-link px-8 rounded-r-lg',
        { [activeClasses]: isTradePage },
      ]"
      @click="trackGoal(Goals.ClickNavTrade)"
    >
      <TradeIcon :active="isTradePage" />
      {{ $t('trade') }}
    </router-link>
  </div>
</template>

<script lang="ts">
import useFathom from '@/composables/useFathom';
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import TradeIcon from '@/components/images/TradeIcon.vue';
import InvestIcon from '@/components/images/InvestIcon.vue';

export default defineComponent({
  name: 'AppNavToggle',
  components: {
    TradeIcon,
    InvestIcon,
  },

  props: {
    darkModeBg: { type: String, default: '800' },
  },

  setup() {
    const route = useRoute();
    const activeClasses = 'bg-blue-lightish text-white';
    const isTradePage = computed(() => route.name === 'trade');
    const { trackGoal, Goals } = useFathom();

    return {
      isTradePage,
      activeClasses,
      trackGoal,
      Goals,
    };
  },
});
</script>

<style scoped>
.app-nav-toggle {
  @apply h-10 flex items-center rounded-lg shadow;
  font-variation-settings: 'wght' 600;
}

.toggle-link {
  @apply h-full flex items-center;
}
</style>
