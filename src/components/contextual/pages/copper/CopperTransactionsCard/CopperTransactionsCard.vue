<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { FullPool } from '@/services/balancer/subgraph/types';

import { usePool } from '@/composables/usePool';

import LBPDetails from './CopperLBPDetails/LBPDetails.vue';
import LBPSettings from './CopperLBPSettings/LBPSettings.vue';
import Swaps from './CopperSwaps/Swaps.vue';

import { CopperTransactionsTab } from './types';
import { settings } from 'cluster';

/**
 * TYPES
 */
type Props = {
  pool: FullPool;
  loading: boolean;
};

/**
 * PROPS
 */
const props = withDefaults(defineProps<Props>(), {
  loading: false
});

/**
 * COMPOSABLES
 */
const { isStablePhantomPool } = usePool(toRef(props, 'pool'));
const { t } = useI18n();

/**
 * COMPUTED
 */
const tabs = computed(() => [
  {
    value: CopperTransactionsTab.LBP_DETAILS,
    label: 'LBP Details'
  },
  {
    value: CopperTransactionsTab.SWAP,
    label: 'Swap History'
  },
  {
    value: CopperTransactionsTab.SETTINGS,
    label: 'LBP Settings'
  }
]);

/**
 * STATE
 */
const activeTab = ref(tabs.value[0].value);
</script>

<template>
  <div
    class="px-4 sm:px-0 flex justify-between items-end border-b dark:border-gray-900 mb-6"
  >
    <BalTabs v-model="activeTab" :tabs="tabs" no-pad class="-mb-px" />
  </div>

  <LBPDetails
    v-if="activeTab === CopperTransactionsTab.LBP_DETAILS"
    :pool-activity-type="CopperTransactionsTab.LBP_DETAILS"
    :pool="pool"
    :loading="loading"
  />
  <Swaps
    v-else-if="activeTab === CopperTransactionsTab.SWAP"
    :pool="pool"
    :loading="loading"
  />
  <LBPSettings
    v-if="activeTab === CopperTransactionsTab.SETTINGS"
    :pool-activity-type="CopperTransactionsTab.SETTINGS"
    :pool="pool"
    :loading="loading"
  />
</template>
