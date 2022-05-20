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

type PoolsQueryResponse = {
  pools: DecoratedPool[];
  // tokens: string[];
  // skip?: number;
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
  const {
    injectTokens,
    dynamicDataLoading,
    prices,
    getTokens,
    searchTokens
  } = useTokens();
  const { currency } = useUserSettings();
  const { appLoading } = useApp();
  const { networkId } = useNetwork();
  const { getProvider } = useWeb3();
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

    // Inject main/wrapped tokens into pool schema
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

  // const queryFn = async ({ pageParam = 0 }) => {
  //   const tokensListFilterKey = filterOptions?.isExactTokensList
  //     ? 'tokensList'
  //     : 'tokensList_contains';
  //   const queryArgs: any = {
  //     first: filterOptions?.pageSize || POOLS.Pagination.PerPage,
  //     skip: pageParam,
  //     where: {
  //       [tokensListFilterKey]: tokenList.value,
  //       poolType_not_in: POOLS.ExcludedPoolTypes
  //     }
  //   };
  //   if (filterOptions?.poolIds?.value.length) {
  //     queryArgs.where.id_in = filterOptions.poolIds.value;
  //   }
  //   if (filterOptions?.poolAddresses?.value.length) {
  //     queryArgs.where.address_in = filterOptions.poolAddresses.value;
  //   }
  //   // console.log('aaaaaa', queryArgs)
  //   const pools = await balancerSubgraphService.pools.get(queryArgs);
  //   // console.log('aaaaaa_2',pools)

  //   for (let i = 0; i < pools.length; i++) {
  //     const isStablePhantomPool = isStablePhantom(pools[i].poolType);

  //     if (isStablePhantomPool) {
  //       pools[i] = removePreMintedBPT(pools[i]);
  //       pools[i] = await getLinearPoolAttrs(pools[i]);
  //     }
  //   }
  //   // [1, [2, [3, [4]], 5]] => [1, 2, [3, [4]], 5]
  //   const tokens = flatten(
  //     pools.map(pool => [
  //       ...pool.tokensList,
  //       ...lpTokensFor(pool),
  //       balancerSubgraphService.pools.addressFor(pool.id)
  //     ])
  //   );
  //   // ['0x1c8e3bcb3378a443cc591f154c5ce0ebb4da9648', '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1', '0x647c1FD457b95b75D0972fF08FE01d7D7bda05dF']
  //   await injectTokens(tokens);
  //   await forChange(dynamicDataLoading, false); // waiting dynamicDataLoading (prices, balances and allowances) changed to false
  //   const decoratedPools = await balancerSubgraphService.pools.decorate(
  //     pools,
  //     '24h',
  //     prices.value,
  //     currency.value
  //   );
  //   // add dynamic :{} , hasLiquidityMiningRewards,

  //   // TODO - cleanup and extract elsewhere in refactor
  //   for (let i = 0; i < decoratedPools.length; i++) {
  //     const isStablePhantomPool = isStablePhantom(decoratedPools[i].poolType);

  //     if (isStablePhantomPool) {
  //       const decoratedPool = decoratedPools[i];

  //       const poolTokenMeta = getTokens(
  //         decoratedPool.tokensList.map(address => getAddress(address))
  //       );

  //       const onchainData = await balancerContractsService.vault.getPoolData(
  //         decoratedPool.id,
  //         decoratedPool.poolType,
  //         poolTokenMeta
  //       );

  //       if (
  //         onchainData != null &&
  //         onchainData.linearPools != null &&
  //         decoratedPool.linearPoolTokensMap != null
  //       ) {
  //         let totalLiquidity = bnum(0);
  //         const tokensMap = getTokens(
  //           Object.keys(decoratedPool.linearPoolTokensMap)
  //         );

  //         Object.entries(onchainData.linearPools).forEach(
  //           ([address, token]) => {
  //             const tokenShare = bnum(onchainData.tokens[address].balance).div(
  //               token.totalSupply
  //             );

  //             const mainTokenBalance = formatUnits(
  //               token.mainToken.balance,
  //               tokensMap[token.mainToken.address].decimals
  //             );

  //             const wrappedTokenBalance = formatUnits(
  //               token.wrappedToken.balance,
  //               tokensMap[token.wrappedToken.address].decimals
  //             );

  //             const mainTokenPrice =
  //               prices.value[token.mainToken.address] != null
  //                 ? prices.value[token.mainToken.address].usd
  //                 : null;

  //             if (mainTokenPrice != null) {
  //               const mainTokenValue = bnum(mainTokenBalance)
  //                 .times(tokenShare)
  //                 .times(mainTokenPrice);

  //               const wrappedTokenValue = bnum(wrappedTokenBalance)
  //                 .times(tokenShare)
  //                 .times(mainTokenPrice)
  //                 .times(token.wrappedToken.priceRate);

  //               totalLiquidity = bnum(totalLiquidity)
  //                 .plus(mainTokenValue)
  //                 .plus(wrappedTokenValue);
  //             }
  //           }
  //         );

  //         decoratedPools[i].onchain = onchainData;
  //         decoratedPools[i].totalLiquidity = totalLiquidity.toString();

  //         const miningTotalLiquidity = balancerSubgraphService.pools.removeExcludedAddressesFromTotalLiquidity(
  //           decoratedPools[i],
  //           decoratedPools[i].totalLiquidity
  //         );

  //         decoratedPools[i].miningTotalLiquidity = miningTotalLiquidity;
  //       }
  //     }
  //   }

  //   return {
  //     pools: decoratedPools,
  //     tokens,
  //     skip:
  //       pools.length >= POOLS.Pagination.PerPage
  //         ? pageParam + POOLS.Pagination.PerPage
  //         : undefined
  //   };
  // };

  const queryFn = async () => {
    // const provider = getProvider();
    const pools = await copperService.pools.lbp.poolList(5);
    // {
    //   "lbp_name":"xxx",
    //   "price": 0,
    //   "start_time": 0,
    //   "end_time": 0,
    //   "network": 1,
    //   "image_url": "xxx",
    //     "id":1
    // }
    // const tokens = Array(pools.length);

    // for (let i = 0; i < pools.length; i++) {
    //   const item = await searchTokens(pools[i], []);
    //   tokens[i] = item[pools[i]];
    // }
    for (let i = 0; i < pools.length; i++) {
      // pools[i].info = await copperService.pools.lbp.poolDetail(pools[i].id);
      const [lbpDetail] = await balancerSubgraphService.lbpDetail.get({
        where: { address: pools[i].pool_address }
      });
      pools[i].lbpDetail = lbpDetail;
    }
    // console.log('aaaaaaa', pools);
    return { pools };
  };
  const queryOptions = reactive({
    ...options,
    // getNextPageParam: (lastPage: PoolsQueryResponse) => lastPage.skip,
    enabled
  });

  return useInfiniteQuery<PoolsQueryResponse>(queryKey, queryFn, queryOptions);
}
