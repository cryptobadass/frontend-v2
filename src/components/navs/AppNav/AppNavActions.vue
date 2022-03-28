<template>
  <div>
    <div v-if="account" class="flex items-center">
      <AppNavActivityBtn />
      <AppNavClaimBtn v-if="liquidityMiningSupported" />
      <AppNavAccountBtn />
    </div>
    <BalBtn
      v-else
      color="cyan"
      class="btn-cont flex justify-center items-center rounded-lg  "
      :size="upToLargeBreakpoint ? 'md' : 'sm'"
      @click="toggleWalletSelectModal"
    >
      <WalletIcon class="mr-2" />
      <span
        class="lg:inline-block text-dark font-bold"
        v-text="$t('connectWallet')"
      />
      <!-- <span class="lg:hidden text-dark font-bold" v-text="$t('connect')" /> -->
    </BalBtn>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { EXTERNAL_LINKS } from '@/constants/links';

import useFathom from '@/composables/useFathom';
import useBreakpoints from '@/composables/useBreakpoints';
import useNumbers from '@/composables/useNumbers';

import AppNavAccountBtn from './AppNavAccountBtn.vue';
import AppNavClaimBtn from './AppNavClaimBtn.vue';
import useWeb3 from '@/services/web3/useWeb3';
import AppNavActivityBtn from './AppNavActivityBtn/AppNavActivityBtn.vue';

export default defineComponent({
  name: 'AppNavActions',

  components: {
    AppNavAccountBtn,
    AppNavClaimBtn,
    AppNavActivityBtn
  },

  setup() {
    // COMPOSABLES
    const { upToSmallBreakpoint, upToLargeBreakpoint } = useBreakpoints();
    const { fNum } = useNumbers();
    const { trackGoal, Goals } = useFathom();
    const {
      connectWallet,
      account,
      toggleWalletSelectModal,
      isMainnet,
      isKovan,
      isPolygon,
      isFuji,
      isAvalanche,
      isArbitrum
    } = useWeb3();

    // COMPUTED
    const liquidityMiningSupported = computed(
      () =>
        isMainnet.value ||
        isPolygon.value ||
        isArbitrum.value ||
        isKovan.value ||
        isFuji.value ||
        isAvalanche.value
    );

    // METHODS
    function onClickConnect() {
      trackGoal(Goals.ClickNavConnectWallet);
    }

    return {
      // computed
      liquidityMiningSupported,
      account,
      upToSmallBreakpoint,
      upToLargeBreakpoint,
      // methods
      fNum,
      onClickConnect,
      connectWallet,
      toggleWalletSelectModal,
      // constants
      EXTERNAL_LINKS
    };
  }
});
</script>

<style scoped>
.btn-cont {
  height: 40px;
  width: 200px;
}
</style>
