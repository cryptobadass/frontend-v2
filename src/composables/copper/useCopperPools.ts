import { computed, Ref, ref } from 'vue';

import { flatten } from 'lodash';

// import usePoolsQuery from '@/composables/queries/usePoolsQuery';
import useUserPoolsQuery from '@/composables/queries/useUserPoolsQuery';
import useCopperPoolsQuery from '../queries/useCopperPoolsQuery';

export default function usePools(poolsTokenList: Ref<string[]> = ref([])) {
  // COMPOSABLES
  const poolsQuery = useCopperPoolsQuery(poolsTokenList);
  // const userPoolsQuery = useUserPoolsQuery();

  // COMPUTED
  const pools = computed(() =>
    poolsQuery.data.value
      ? flatten(poolsQuery.data.value.pages.map(page => page.pools))
      : []
  );

  // const tokens = computed(
  //   () => poolsQuery.data.value
  //   // ? flatten(poolsQuery.data.value.pages.map(page => page.tokens))
  //   // : []
  // );

  // const userPools = computed(() => userPoolsQuery.data.value?.pools || []);

  // const totalInvestedAmount = computed(
  //   () => userPoolsQuery.data.value?.totalInvestedAmount
  // );
  // console.log('aaaaaaa-20',userPoolsQuery.data.value)

  const isLoadingPools = computed(
    () => poolsQuery.isLoading.value || poolsQuery.isIdle.value
  );

  // const isLoadingUserPools = computed(
  //   () => userPoolsQuery.isLoading.value || userPoolsQuery.isIdle.value
  // );

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
    // tokens,
    // userPools,
    // totalInvestedAmount,
    isLoadingPools,
    // isLoadingUserPools,
    poolsHasNextPage,
    poolsIsFetchingNextPage,
    poolsQuery,

    // methods
    loadMorePools
  };
}