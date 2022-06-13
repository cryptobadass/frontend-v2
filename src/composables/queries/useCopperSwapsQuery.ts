import { reactive } from 'vue';
import { useInfiniteQuery } from 'vue-query';
import { UseInfiniteQueryOptions } from 'react-query/types';

import QUERY_KEYS from '@/constants/queryKeys';
import { POOLS } from '@/constants/pools';

import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import { PoolSwap } from '@/services/balancer/subgraph/types';
import useNetwork from '../useNetwork';

type PoolSwapsQueryResponse = {
  poolSwaps: PoolSwap[];
  skip?: number;
};

export default function useCopperSwapsQuery(
  id: string,
  subgraphQuery: Record<string, any> = {},
  options: UseInfiniteQueryOptions<PoolSwapsQueryResponse> = {}
) {
  // COMPOSABLES
  const { networkId } = useNetwork();

  // DATA
  const queryKey = reactive(
    QUERY_KEYS.Pools.Swaps(networkId, id, subgraphQuery)
  );

  // METHODS
  const queryFn = async ({ pageParam = 0 }) => {
    // console.log('aaaaa ', 1);
    // debugger;
    const poolSwaps = await balancerSubgraphService.lbpSwap.get(
      {
        where: Object.assign(
          {
            id: id
          },
          subgraphQuery
        )
      },
      {
        swaps: {
          __args: {
            first: POOLS.Pagination.PerPage,
            skip: pageParam,
            orderBy: 'timestamp',
            orderDirection: 'desc'
          },
          tokenIn: true,
          tokenOut: true,
          caller: true,
          tokenAmountIn: true,
          tokenAmountOut: true,
          tokenInSym: true,
          tokenOutSym: true,
          tx: true,
          timestamp: true,
          userAddress: {
            id: true
          }
        }
      }
    );
    // console.log('aaaaaa', poolSwaps);

    return {
      poolSwaps,
      skip:
        poolSwaps.length >= POOLS.Pagination.PerPage
          ? pageParam + POOLS.Pagination.PerPage
          : undefined
    };
  };

  const queryOptions = reactive({
    getNextPageParam: (lastPage: PoolSwapsQueryResponse) => lastPage.skip,
    ...options
  });

  return useInfiniteQuery<PoolSwapsQueryResponse>(
    queryKey,
    queryFn,
    queryOptions
  );
}
