<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { flatten } from 'lodash';

import usePoolSwapsQuery from '@/composables/queries/usePoolSwapsQuery';

import { FullPoolCopper } from '@/services/balancer/subgraph/types';

import Table from './Table.vue';

/**
 * TYPES
 */
type Props = {
  pool: FullPoolCopper;
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
const route = useRoute();

/**
 * STATE
 */
const id = route.params.id as string;

/**
 * QUERIES
 */
const poolSwapsQuery = usePoolSwapsQuery(id);

/**
 * COMPUTED
 */
const poolSwaps = computed(() =>
  poolSwapsQuery.data.value
    ? flatten(poolSwapsQuery.data.value.pages.map(page => page.poolSwaps))
    : []
);
const isLoadingPoolSwaps = computed(() => poolSwapsQuery.isLoading.value);
const poolSwapsHasNextPage = computed(() => poolSwapsQuery.hasNextPage?.value);
const poolSwapsIsFetchingNextPage = computed(
  () => poolSwapsQuery.isFetchingNextPage?.value
);
const tokens = computed(() => {
  if (!props.pool) return [];
  // return [
  //   '0x08d707c1ddea1a46d568926d168ee7be7ea8c06b',
  //   '0xfad1257bd61131b6bb60bee08289167099014ac6'
  // ];
  return [props.pool.main_token, props.pool.base_token];
});

/**
 * METHODS
 */
function loadMorePoolSwaps() {
  poolSwapsQuery.fetchNextPage.value();
}
</script>

<template>
  <Table
    :tokens="tokens"
    :pool-swaps="poolSwaps"
    :is-loading="loading || isLoadingPoolSwaps"
    :is-loading-more="poolSwapsIsFetchingNextPage"
    :is-paginated="poolSwapsHasNextPage"
    @load-more="loadMorePoolSwaps"
    :no-results-label="$t('poolTransactions.noResults.swaps')"
  />
</template>
