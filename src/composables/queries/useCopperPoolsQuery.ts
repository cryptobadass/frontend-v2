import { computed, reactive, ref, Ref } from 'vue';
import { useInfiniteQuery } from 'vue-query';
import { UseInfiniteQueryOptions } from 'react-query/types';
import { flatten } from 'lodash';
import QUERY_KEYS from '@/constants/queryKeys';
import { POOLS } from '@/constants/pools';
import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import {
  DecoratedPool,
  LinearPool,
  Pool
} from '@/services/balancer/subgraph/types';
import useTokens from '../useTokens';
import useUserSettings from '../useUserSettings';
import useApp from '../useApp';
import { bnum, forChange } from '@/lib/utils';
import useNetwork from '../useNetwork';
import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { isStablePhantom, lpTokensFor } from '../usePool';
import { balancerContractsService } from '@/services/balancer/contracts/balancer-contracts.service';
import useWeb3 from '@/services/web3/useWeb3';
import { copperService } from '@/services/copper/coppper.service';
import { useRoute } from 'vue-router';
import { configService } from '@/services/config/config.service';

type PoolsQueryResponse = {
  pools: DecoratedPool[];
  // tokens: string[];
  currentPage?: number;
  // enabled?: boolean;
};

type FilterOptions = {
  poolIds?: Ref<string[]>;
  poolAddresses?: Ref<string[]>;
  isExactTokensList?: boolean;
  pageSize?: number;
};

export default function useCopperPoolsQuery(
  tokenList: Ref<string[]> = ref([]),
  options: UseInfiniteQueryOptions<PoolsQueryResponse> = {},
  filterOptions?: FilterOptions
) {
  // COMPOSABLES
  const { currency } = useUserSettings();
  const { appLoading } = useApp();
  const { networkId } = useNetwork();
  const { getProvider } = useWeb3();
  const route = useRoute();
  // DATA
  const queryKey = QUERY_KEYS.Pools.Copper(networkId);

  // COMPUTED
  const enabled = computed(() => !appLoading.value && options.enabled);

  // METHODS
  function removePreMintedBPT(pool: Pool): Pool {
    const poolAddress = balancerSubgraphService.pools.addressFor(pool.id);
    // Remove pre-minted BPT token if exits
    pool.tokensList = pool.tokensList.filter(
      address => address !== poolAddress.toLowerCase()
    );
    return pool;
  }

  /**
   * fetches StablePhantom linear pools and extracts
   * required attributes.
   */
  async function getLinearPoolAttrs(pool: Pool): Promise<Pool> {
    // Fetch linear pools from subgraph
    const linearPools = (await balancerSubgraphService.pools.get(
      {
        where: {
          address_in: pool.tokensList,
          totalShares_gt: -1 // Avoid the filtering for low liquidity pools
        }
      },
      { mainIndex: true, wrappedIndex: true }
    )) as LinearPool[];

    const linearPoolTokensMap: Pool['linearPoolTokensMap'] = {};

    linearPools.forEach(linearPool => {
      if (!pool.mainTokens) pool.mainTokens = [];
      if (!pool.wrappedTokens) pool.wrappedTokens = [];

      const index = pool.tokensList.indexOf(linearPool.address.toLowerCase());

      pool.mainTokens[index] = getAddress(
        linearPool.tokensList[linearPool.mainIndex]
      );
      pool.wrappedTokens[index] = getAddress(
        linearPool.tokensList[linearPool.wrappedIndex]
      );

      linearPool.tokens
        .filter(token => token.address !== linearPool.address)
        .forEach(token => {
          const address = getAddress(token.address);

          linearPoolTokensMap[address] = {
            ...token,
            address
          };
        });
    });

    pool.linearPoolTokensMap = linearPoolTokensMap;

    return pool;
  }

  const queryFn = async ({ pageParam = 1 }) => {
    const group = route.query.group as string;
    const pools = await copperService.pools.lbp.poolList(
      group ? parseInt(group) : configService.network.defaultLaunchpadGroupId,
      pageParam,
      POOLS.Pagination.PerPage
    );

    for (let i = 0; i < pools.length; i++) {
      const [lbpDetail] = await balancerSubgraphService.lbpDetail.get({
        where: { address: pools[i].pool_address }
      });
      pools[i].lbpDetail = lbpDetail;
    }
    return {
      pools,
      currentPage:
        pools.length < POOLS.Pagination.PerPage ? undefined : pageParam + 1
    };
  };
  const queryOptions = reactive({
    ...options,
    getNextPageParam: (lastPage: PoolsQueryResponse) => lastPage.currentPage,
    enabled
  });

  return useInfiniteQuery<PoolsQueryResponse>(queryKey, queryFn, queryOptions);
}
