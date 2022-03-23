<template>
  <div :class="['app-hero', 'h-40']">
    <div class="w-full max-w-3xl mx-auto flex items-center justify-center">
      <template v-if="isWalletReady">
        <h1
          v-text="$t('myInvestments')"
          class="text-base font-medium text-white opacity-90 font-body mb-2"
        />
        <BalLoadingBlock
          v-if="isLoadingUserPools"
          class="h-10 w-40 mx-auto"
          white
        />
        <span v-else class="text-3xl font-bold text-white">
          {{
            fNum2(totalInvestedAmount || '', {
              style: 'currency',
              dontAdjustLarge: true
            })
          }}
        </span>
      </template>
      <template v-else>
        <div v-text="$t('selectBlockchain')" class="text-white text-center" />
        <div class="flex justify-center items-center btns">
          <AppNavNetworkSelect class="mr-8" />
          <AppNavActions />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import useNumbers from '@/composables/useNumbers';
import usePools from '@/composables/pools/usePools';

import { EXTERNAL_LINKS } from '@/constants/links';
import useFathom from '@/composables/useFathom';
import useWeb3 from '@/services/web3/useWeb3';
import useDarkMode from '@/composables/useDarkMode';
import AppNavNetworkSelect from '@/components/navs/AppNav/AppNavNetworkSelect.vue';
import AppNavActions from '@/components/navs/AppNav/AppNavActions.vue';

export default defineComponent({
  name: 'AppHero',
  components: {
    AppNavNetworkSelect,
    AppNavActions
  },

  setup() {
    // COMPOSABLES
    const { fNum2 } = useNumbers();
    const { isWalletReady, toggleWalletSelectModal } = useWeb3();
    const { trackGoal, Goals } = useFathom();
    const { totalInvestedAmount, isLoadingUserPools } = usePools();
    const { darkMode } = useDarkMode();

    const classes = computed(() => ({
      ['h-72']: !isWalletReady.value,
      ['h-40']: isWalletReady.value
    }));

    function onClickConnect() {
      toggleWalletSelectModal(true);
      trackGoal(Goals.ClickHeroConnectWallet);
    }

    return {
      // data
      totalInvestedAmount,
      isLoadingUserPools,
      Goals,

      // computed
      isWalletReady,
      classes,
      darkMode,

      // methods
      toggleWalletSelectModal,
      fNum2,
      onClickConnect,
      trackGoal,
      // constants
      EXTERNAL_LINKS
    };
  }
});
</script>

<style>
.app-hero {
  @apply bg-cover bg-center flex justify-center  text-center px-4;
  transition: all 0.3s ease-in-out;
  /* background-image: url('/images/backgrounds/bg-header.svg'); */
  border-top: 1px solid #424658;
  background-color: #222531;
}
.btns{
  padding-left: 20px;
}
</style>
