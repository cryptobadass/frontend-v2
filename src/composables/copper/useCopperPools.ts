import { computed, Ref, ref } from 'vue';

import { flatten } from 'lodash';

import useCopperPoolsQuery from '../queries/useCopperPoolsQuery';

export default function useCopperPools(
  poolsTokenList: Ref<string[]> = ref([])
) {
  // COMPOSABLES
  const poolsQuery = useCopperPoolsQuery(poolsTokenList);

  // COMPUTED
  const pools = computed(() =>
    poolsQuery.data.value
      ? flatten(poolsQuery.data.value.pages.map(page => page.pools))
      : []
  );

  const isLoadingPools = computed(
    () => poolsQuery.isLoading.value || poolsQuery.isIdle.value
  );

  const poolsHasNextPage = computed(() => poolsQuery.hasNextPage?.value);
  const poolsIsFetchingNextPage = computed(
    () => poolsQuery.isFetchingNextPage?.value
  );

  // METHODS
  function loadMorePools() {
    poolsQuery.fetchNextPage.value();
  }

  return {
    // computed
    pools,
    isLoadingPools,
    poolsHasNextPage,
    poolsIsFetchingNextPage,
    poolsQuery,

    // methods
    loadMorePools
  };
}
