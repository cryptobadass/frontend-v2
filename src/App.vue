<script lang="ts">
import { defineComponent, onBeforeMount, watch, ref } from 'vue';
import { VueQueryDevTools } from 'vue-query/devtools';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import BigNumber from 'bignumber.js';
import * as Layouts from '@/pages/_layouts';
import useWeb3Watchers from '@/composables/watchers/useWeb3Watchers';
import WalletSelectModal from '@/components/web3/WalletSelectModal.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { DEFAULT_TOKEN_DECIMALS } from '@/constants/tokens';
import Notifications from '@/components/notifications/Notifications.vue';
import useGnosisSafeApp from './composables/useGnosisSafeApp';
import useGlobalQueryWatchers from './composables/watchers/useGlobalQueryWatchers';
import usePoolCreationWatcher from './composables/watchers/usePoolCreationWatcher';

import useExploitWatcher from './composables/watchers/useExploitWatcher';
import useBackgroundColor from './composables/useBackgroundColor';
import AppSidebar from './components/navs/AppNav/AppSidebar/AppSidebar.vue';
import { useSidebar } from './composables/useSidebar';
import useNavigationGuards from './composables/useNavigationGuards';
import GlobalModalContainer from './components/modals/GlobalModalContainer.vue';
import { copperService } from './services/copper/coppper.service';

BigNumber.config({ DECIMAL_PLACES: DEFAULT_TOKEN_DECIMALS });

export default defineComponent({
  components: {
    ...Layouts,
    VueQueryDevTools,
    WalletSelectModal,
    Notifications,
    AppSidebar,
    GlobalModalContainer
  },

  setup() {
    /**
     * STATE
     */
    const layout = ref('DefaultLayout');

    /**
     * COMPOSABLES
     */
    useWeb3Watchers();
    usePoolCreationWatcher();
    useGlobalQueryWatchers();
    useGnosisSafeApp();
    useExploitWatcher();
    useNavigationGuards();
    const { isWalletSelectVisible, toggleWalletSelectModal } = useWeb3();
    const route = useRoute();
    const store = useStore();

    const { newRouteHandler: updateBgColorFor } = useBackgroundColor();
    const { sidebarOpen } = useSidebar();

    /**
     * CALLBACKS
     */
    onBeforeMount(async () => {
      store.dispatch('app/init');
      copperService.pools.lbp.getToken();
    });

    /**
     * WATCHERS
     */
    watch(route, newRoute => {
      updateBgColorFor(newRoute);
      if (newRoute.meta.layout) {
        layout.value = newRoute.meta.layout as string;
      } else {
        layout.value = 'DefaultLayout';
      }
    });

    return {
      // state
      layout,
      // computed
      isWalletSelectVisible,
      sidebarOpen,
      // methods
      toggleWalletSelectModal
    };
  }
});
</script>

<template>
  <div id="modal" />
  <div id="app">
    <component :is="layout" />
    <VueQueryDevTools />
    <WalletSelectModal
      :isVisible="isWalletSelectVisible"
      @close="toggleWalletSelectModal"
    />
    <Notifications />
    <AppSidebar v-if="sidebarOpen" />
  </div>
  <GlobalModalContainer />
</template>

<style>
.VueQueryDevtoolsPanel + button {
  @apply text-black bg-gray-100 p-2 rounded text-sm;
}

#intercom-activator {
  z-index: 2147483004;
}
</style>
