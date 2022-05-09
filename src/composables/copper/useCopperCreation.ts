import { ref, reactive, toRefs, computed } from 'vue';

import { useI18n } from 'vue-i18n';
import usePoolsQuery from '@/composables/queries/usePoolsQuery';
import useTransactions from '@/composables/useTransactions';
import useEthers from '@/composables/useEthers';
import useTokens from '../useTokens';
import useWeb3 from '@/services/web3/useWeb3';

import BigNumber from 'bignumber.js';
import { flatten, sumBy } from 'lodash';
import { bnum, lsRemove, lsSet, scale } from '@/lib/utils';

import { PoolType } from '@/services/balancer/subgraph/types';
import { balancerService } from '@/services/balancer/balancer.service';
import { configService } from '@/services/config/config.service';
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers';
import { POOLS } from '@/constants/pools';
import { copperService } from '@/services/copper/coppper.service';
import { approveTokens } from '@/lib/utils/balancer/tokens';
import { add, getUnixTime } from 'date-fns';

export const COPPER_CREATION_STATE_VERSION = '1.0';
export const COPPER_CREATION_STATE_KEY = 'copperCreationState';

export type PoolSeedToken = {
  tokenAddress: string;
  startWeight: number;
  endWeight: number;
  isLocked: boolean;
  amount: string;
  id: string;
};

export type OptimisedLiquidity = {
  liquidityRequired: string;
  balanceRequired: string;
};

type FeeManagementType = 'governance' | 'self';
type FeeType = 'fixed' | 'dynamic';
type FeeController = 'self' | 'other';
const now = new Date();
const defaultStartTime = add(now, {
  hours: 1
});
const defaultEndTime = add(now, {
  hours: 1,
  days: 3
});

const emptyPoolCreationState = {
  // name: 'Token', // stringπ
  // symbol: 'UNI.e', // string
  // mainToken: {
  //   tokenAddress: '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846',
  //   weight: 50,
  //   id: '1',
  //   isLocked: false,
  //   amount: '2'
  // },
  // baseToken: {
  //   tokenAddress: '0x286EA60Cb66ba7647C8143c5d467594B92A3734C',
  //   weight: 50,
  //   id: '2',
  //   isLocked: false,
  //   amount: '9.384150710184040771'
  // },
  seedTokens: [
    {
      tokenAddress: '0x32F106297E28bBf71FFC41b74DA98D78b703B479',
      startWeight: 99,
      endWeight: 1,
      id: '1',
      isLocked: false,
      amount: ''
    },
    {
      tokenAddress: '0xfAD1257Bd61131b6Bb60BEE08289167099014Ac6',
      startWeight: 1,
      endWeight: 99,
      id: '2',
      isLocked: false,
      amount: ''
    }
  ] as PoolSeedToken[],
  // tokens: [
  //   '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846', // link
  //   '0x286EA60Cb66ba7647C8143c5d467594B92A3734C'
  //   // '0xed7F146612C8d2e8E101b8b5B8C58b8E70E99149',// aMock
  //   // '0x386c2C22Cdfb4D4da4CC41a1edC61765156930e6',//myPool1
  //   // '0xeb41cb98b02cBB91590A8637Ae1F47849628dF56',// myPool2
  //   // '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846',
  //   // '0x2A9cB455bA143f7f65Af8320e8F64a4bBFA99CC5', // xUST
  // ] as string[], // address[]
  mainTokenAmount: '',
  baseTokenAmount: '',
  // mainTokenAddress: '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846',
  // baseTokenAddress: '0x286EA60Cb66ba7647C8143c5d467594B92A3734C',
  baseTokenOptions: [
    '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846',
    '0x286EA60Cb66ba7647C8143c5d467594B92A3734C',
    '0xed7F146612C8d2e8E101b8b5B8C58b8E70E99149'
  ],
  // amounts: ['10000000000000000000', '10000000000000000000'] as string[], // uint256[]
  // weights: ['300000000000000000', '700000000000000000'] as string[], // uint256[]
  // startWeight: 99,
  // endWeight: 1,
  // endAdnStartWeight: [1, 99],
  // endWeights: ['200000000000000000', '800000000000000000'] as string[], // uint256[]
  isCorrectOrder: true, // bool
  swapFeePercentage: 2.5, // uint256
  // startTime: 1652398300 as number, // uint256
  // endTime: 1659283200 as number, // uint256
  time: [defaultStartTime, defaultEndTime] as Array<Date | null>,

  // seedTokens: [] as PoolSeedToken[],
  activeStep: 0,
  description: '',
  learnMoreLink: '',
  readAndAgree: false,
  // initialFee: '0.003',
  // isFeeGovManaged: false,
  // feeManagementType: 'governance' as FeeManagementType,
  // feeType: 'fixed' as FeeType,
  // feeController: 'self' as FeeController,
  // thirdPartyFeeController: '',
  // fee: '',
  // tokensList: [] as string[],
  poolId: '' as string,
  poolAddress: '',
  // symbol: '',
  // manuallySetToken: '' as string,
  // autoOptimiseBalances: false,
  // useNativeAsset: false,
  // type: PoolType.Weighted,
  // acceptedCustomTokenDisclaimer: false,
  needsSeeding: false,
  createPoolTxHash: ''
};

export const poolCreationState = reactive({ ...emptyPoolCreationState });
const tokenColors = ref<string[]>([]);
export const hasRestoredFromSavedState = ref<boolean | null>(null);

export default function useCopperCreation() {
  /**
   * COMPOSABLES
   */
  const {
    balanceFor,
    priceFor,
    getToken,
    nativeAsset,
    wrappedNativeAsset,
    injectedTokens
  } = useTokens();
  const { account, getProvider } = useWeb3();
  const { txListener } = useEthers();
  const { addTransaction } = useTransactions();
  const { t } = useI18n();

  /**
   * COMPUTED
   */
  const mainTokenAddress = computed(() => {
    return poolCreationState.seedTokens[0].tokenAddress;
  });
  const baseTokenAddress = computed(() => {
    return poolCreationState.seedTokens[1].tokenAddress;
  });

  const mainTokenInfo = computed(() => {
    return getToken(poolCreationState.seedTokens[0].tokenAddress);
  });
  const baseTokenInfo = computed(() => {
    return getToken(poolCreationState.seedTokens[1].tokenAddress);
  });
  const LBPTokenSymbol = computed(() => {
    return mainTokenInfo.value.symbol
      ? `${mainTokenInfo.value.symbol}_LBP`
      : '';
  });
  const LBPTokenName = computed(() => {
    return mainTokenInfo.value.name
      ? `${mainTokenInfo.value.name} Copper LBP`
      : '';
  });
  // const tokenList = computed(() => {
  //   return [
  //     poolCreationState.mainTokenAddress,
  //     poolCreationState.baseTokenAddress
  //   ];
  // });
  // const sortTokensList = computed(() =>
  //   tokenList.value.sort((tokenA, tokenB) => {
  //     return tokenA > tokenB ? 1 : -1;
  //   })
  // );

  // const hasInjectedToken = computed(() => {
  //   return tokensList.value.some(
  //     token => injectedTokens.value[token]?.symbol !== undefined
  //   );
  // });

  // const optimisedLiquidity = computed(
  //   (): Record<string, OptimisedLiquidity> => {
  //     // need to filter out the empty tokens just in case
  //     const validTokens = tokensList.value.filter(t => t !== '');
  //     const optimisedLiquidity = {};

  //     // token with the lowest balance is the bottleneck
  //     let bottleneckToken = validTokens[0];
  //     // keeping track of the lowest amt
  //     let currentMin = bnum(balanceFor(validTokens[0])).times(
  //       priceFor(validTokens[0])
  //     );
  //     for (const token of validTokens) {
  //       const value = bnum(balanceFor(token)).times(priceFor(token));
  //       if (value.lt(currentMin)) {
  //         currentMin = value;
  //         bottleneckToken = token;
  //       }
  //     }
  //     if (!bottleneckToken) return optimisedLiquidity;

  //     const bottleneckWeight =
  //       poolCreationState.seedTokens.find(
  //         t => t.tokenAddress === bottleneckToken
  //       )?.weight || 0;

  //     const bip = bnum(priceFor(bottleneckToken || '0'))
  //       .times(balanceFor(bottleneckToken))
  //       .div(bottleneckWeight);

  //     return getTokensScaledByBIP(bip);
  //   }
  // );

  // const scaledLiquidity = computed(
  //   (): Record<string, OptimisedLiquidity> => {
  //     const scaledLiquidity = {};
  //     const manuallySetToken =
  //       poolCreationState.manuallySetToken === nativeAsset.address
  //         ? wrappedNativeAsset.value.address
  //         : poolCreationState.manuallySetToken;
  //     const modifiedToken = findSeedTokenByAddress(manuallySetToken);
  //     if (!modifiedToken) return scaledLiquidity;

  //     const bip = bnum(priceFor(modifiedToken.tokenAddress || '0'))
  //       .times(modifiedToken.amount)
  //       .div(modifiedToken.weight);

  //     return getTokensScaledByBIP(bip);
  //   }
  // );

  // const maxInitialLiquidity = computed(() => {
  //   return sumBy(Object.values(optimisedLiquidity.value), (liq: any) =>
  //     Number(liq.liquidityRequired)
  //   );
  // });

  // const totalLiquidity = computed(() => {
  //   let total = bnum(0);
  //   for (const token of tokensList.value) {
  //     total = total.plus(bnum(priceFor(token)).times(balanceFor(token)));
  //   }
  //   return total;
  // });

  // const currentLiquidity = computed(() => {
  //   let total = bnum(0);
  //   for (const token of poolCreationState.seedTokens) {
  //     total = total.plus(
  //       bnum(token.amount).times(priceFor(token.tokenAddress))
  //     );
  //   }
  //   return total;
  // });

  // const poolLiquidity = computed(() => {
  //   let sum = bnum(0);
  //   for (const token of poolCreationState.seedTokens) {
  //     sum = sum.plus(bnum(token.amount).times(priceFor(token.tokenAddress)));
  //   }
  //   return sum;
  // });

  // const poolTypeString = computed((): string => {
  //   switch (poolCreationState.type) {
  //     case PoolType.Weighted:
  //       return 'weighted';
  //     default:
  //       return '';
  //   }
  // });

  // const tokensWithNoPrice = computed(() => {
  //   const validTokens = tokensList.value.filter(t => t !== '');
  //   return validTokens.filter(token => priceFor(token) === 0);
  // });

  // const similarPools = computed(() => {
  //   return flatten(similarPoolsResponse.value?.pages.map(p => p.pools));
  // });

  // const existingPool = computed(() => {
  //   if (!similarPools.value?.length) return null;

  //   const similarPool = similarPools.value.find(pool => {
  //     if (pool.swapFee === poolCreationState.initialFee) {
  //       let weightsMatch = true;
  //       for (const token of pool.tokens) {
  //         const relevantToken = poolCreationState.seedTokens.find(
  //           t => t.tokenAddress === token.address
  //         );
  //         const similarPoolWeight = Number(token.weight).toFixed(2);
  //         const seedTokenWeight = ((relevantToken?.weight || 0) / 100).toFixed(
  //           2
  //         );
  //         if (similarPoolWeight !== seedTokenWeight) {
  //           weightsMatch = false;
  //         }
  //       }
  //       return weightsMatch;
  //     }
  //     return false;
  //   });
  //   return similarPool;
  // });

  // const isWethPool = computed((): boolean => {
  //   return tokensList.value.includes(configService.network.addresses.weth);
  // });

  // const poolOwner = computed(() => {
  //   if (poolCreationState.feeManagementType === 'governance') {
  //     return POOLS.DelegateOwner;
  //   } else {
  //     if (poolCreationState.feeController === 'self') {
  //       return account.value;
  //     } else {
  //       return poolCreationState.thirdPartyFeeController;
  //     }
  //   }
  // });

  /**
   * FUNCTIONS
   */
  // const {
  //   data: similarPoolsResponse,
  //   isLoading: isLoadingSimilarPools
  // } = usePoolsQuery(tokensList, {}, { isExactTokensList: true });

  // function resetPoolCreationState() {
  //   for (const key of Object.keys(poolCreationState)) {
  //     poolCreationState[key] = emptyPoolCreationState[key];
  //   }
  //   setRestoredState(false);
  //   resetState();
  // }

  // function updateTokenWeights(weights: PoolSeedToken[]) {
  //   poolCreationState.seedTokens = weights;
  // }

  // function sortSeedTokens() {
  //   poolCreationState.seedTokens.sort((tokenA, tokenB) => {
  //     return tokenA.tokenAddress.toLowerCase() >
  //       tokenB.tokenAddress.toLowerCase()
  //       ? 1
  //       : -1;
  //   });
  // }

  function proceed() {
    // if (!similarPools.value.length && poolCreationState.activeStep === 1) {
    //   poolCreationState.activeStep += 2;
    // } else {
    poolCreationState.activeStep += 1;
    // }
    saveState();
  }

  function goBack() {
    // if (!similarPools.value.length && poolCreationState.activeStep === 3) {
    //   poolCreationState.activeStep -= 2;
    //   return;
    // }
    poolCreationState.activeStep -= 1;
    // if (hasRestoredFromSavedState.value) {
    //   setRestoredState(false);
    // }
  }

  // function findSeedTokenByAddress(address: string) {
  //   return poolCreationState.seedTokens.find((token: PoolSeedToken) => {
  //     return token.tokenAddress === address;
  //   });
  // }

  // function setFeeManagement(type: FeeManagementType) {
  //   poolCreationState.feeManagementType = type;
  // }

  // function setFeeType(type: FeeType) {
  //   poolCreationState.feeType = type;
  // }

  function setStep(step: number) {
    poolCreationState.activeStep = step;
  }

  // function setFeeController(controller: FeeController) {
  //   poolCreationState.feeController = controller;
  // }

  // function setTrpController(address: string) {
  //   poolCreationState.thirdPartyFeeController = address;
  // }

  // function updateTokenColors(colors: string[]) {
  //   tokenColors.value = colors;
  // }

  // function updateManuallySetToken(address: string) {
  //   poolCreationState.manuallySetToken = address;
  // }

  // function clearAmounts() {
  //   for (const token of poolCreationState.seedTokens) {
  //     token.amount = '0';
  //   }
  // }

  // function setAmountsToMaxBalances() {
  //   for (const token of poolCreationState.seedTokens) {
  //     token.amount = balanceFor(token.tokenAddress);
  //   }
  // }

  // function setTokensList(newList: string[]) {
  //   poolCreationState.tokensList = newList;
  // }

  // function getTokensScaledByBIP(
  //   bip: BigNumber
  // ): Record<string, OptimisedLiquidity> {
  //   const optimisedLiquidity = {};
  //   for (const token of poolCreationState.seedTokens) {
  //     // get the price for a single token
  //     const tokenPrice = bnum(priceFor(token.tokenAddress));
  //     // the usd value needed for its weight
  //     const liquidityRequired: BigNumber = bip.times(token.weight);
  //     const balanceRequired: BigNumber = liquidityRequired.div(tokenPrice);
  //     optimisedLiquidity[token.tokenAddress] = {
  //       liquidityRequired: liquidityRequired.toString(),
  //       balanceRequired: balanceRequired.toString()
  //     };
  //   }
  //   return optimisedLiquidity;
  // }

  function getScaledAmounts() {
    const scaledAmounts: string[] = poolCreationState.seedTokens.map(
      (token: PoolSeedToken) => {
        const tokenInfo = getToken(token.tokenAddress);
        if (!tokenInfo) return '0';
        const amount = new BigNumber(token.amount);
        const scaledAmount = scale(amount, tokenInfo.decimals);
        const scaledRoundedAmount = scaledAmount.dp(0, BigNumber.ROUND_FLOOR);
        return scaledRoundedAmount.toString();
      }
    );
    return scaledAmounts;
  }

  function getScaledWeights() {
    const scaledWeights: string[] = poolCreationState.seedTokens.map(item => {
      // const tokenInfo = getToken(token.tokenAddress);
      // if (!tokenInfo) return '0';
      const amount = new BigNumber(item.startWeight / 100);
      const scaledWeight = scale(amount, 18);
      const scaledRoundedWeight = scaledWeight.dp(0, BigNumber.ROUND_FLOOR);
      return scaledRoundedWeight.toString();
    });
    return scaledWeights;
  }

  function getScaledEndWeights() {
    const scaledWeights: string[] = poolCreationState.seedTokens.map(item => {
      // const tokenInfo = getToken(token.tokenAddress);
      // if (!tokenInfo) return '0';
      const amount = new BigNumber(item.endWeight / 100);
      const scaledWeight = scale(amount, 18);
      const scaledRoundedWeight = scaledWeight.dp(0, BigNumber.ROUND_FLOOR);
      return scaledRoundedWeight.toString();
    });
    return scaledWeights;
  }
  function getScaledSwapFee() {
    const swapFee = new BigNumber(poolCreationState.swapFeePercentage / 100);
    const scaledSwapFee = scale(swapFee, 18);
    const scaledRoundedSwapFee = scaledSwapFee.dp(0, BigNumber.ROUND_FLOOR);
    return scaledRoundedSwapFee.toString();
  }
  function getNeedSwap() {
    return (
      mainTokenAddress.value.toLowerCase() >
      baseTokenAddress.value.toLowerCase()
    );
  }
  function swap(arr) {
    return getNeedSwap() ? [arr[1], arr[0]] : arr;
  }

  // function getPoolSymbol() {
  //   let valid = true;

  //   const tokenSymbols = poolCreationState.seedTokens.map(
  //     (token: PoolSeedToken) => {
  //       const weightRounded = Math.round(token.weight);
  //       const tokenInfo = getToken(token.tokenAddress);
  //       if (!tokenInfo) {
  //         valid = false;
  //       }
  //       return tokenInfo
  //         ? `${Math.round(weightRounded)}${tokenInfo.symbol}`
  //         : '';
  //     }
  //   );

  //   return valid ? tokenSymbols.join('-') : '';
  // }

  async function createPool(): Promise<TransactionResponse> {
    const provider = getProvider();
    const poolConfig = [
      LBPTokenName.value,
      LBPTokenSymbol.value,
      swap([mainTokenAddress.value, baseTokenAddress.value]),
      swap(getScaledAmounts()),
      swap(getScaledWeights()),
      swap(getScaledEndWeights()),
      poolCreationState.isCorrectOrder,
      getScaledSwapFee(),
      getUnixTime(poolCreationState.time[0] as Date),
      getUnixTime(poolCreationState.time[1] as Date)
    ];
    console.log('create pool ', poolConfig);
    // return Promise.reject('Create failed');
    try {
      const tx = await copperService.pools.lbp.create(provider, poolConfig);
      poolCreationState.createPoolTxHash = tx.hash;
      saveState();
      // debugger;

      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'createPool',
        summary: t('transactionSummary.createPool'),
        details: {
          name: LBPTokenName.value
        }
      });
      // 1;
      txListener(tx, {
        onTxConfirmed: async () => {
          retrievePoolDetails(tx.hash);
        },
        onTxFailed: () => {
          console.log('Create failed');
        }
      });

      return tx;
    } catch (e) {
      console.log(e);
      return Promise.reject('Create failed');
    }
  }

  // async function approve() {
  //   try {
  //     const [tx] = await approveTokens(
  //       getProvider(),
  //       '0x2ac87650654AB7E5Cc8d6369534Bfda023991244',
  //       // '0x4DA66fA19e20C5EFdD053B137d05930156fa99Bf',
  //       [
  //         '0x286EA60Cb66ba7647C8143c5d467594B92A3734C', // uni.e
  //         '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846' // link
  //       ]
  //       // 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846  link
  //     );
  //     console.log('aaaaaa', tx);
  //   } catch (e) {
  //     console.log('aaaaaa', e);
  //   }
  // }

  // async function joinPool() {
  //   const provider = getProvider();
  //   try {
  //     const tokenAddresses: string[] = poolCreationState.seedTokens.map(
  //       (token: PoolSeedToken) => {
  //         if (
  //           token.tokenAddress === wrappedNativeAsset.value.address &&
  //           poolCreationState.useNativeAsset
  //         ) {
  //           return nativeAsset.address;
  //         }
  //         return token.tokenAddress;
  //       }
  //     );
  //     const tx = await balancerService.pools.weighted.initJoin(
  //       provider,
  //       poolCreationState.poolId,
  //       account.value,
  //       account.value,
  //       tokenAddresses,
  //       getScaledAmounts()
  //     );

  //     addTransaction({
  //       id: tx.hash,
  //       type: 'tx',
  //       action: 'fundPool',
  //       summary: t('transactionSummary.fundPool')
  //     });

  //     txListener(tx, {
  //       onTxConfirmed: async () => {
  //         resetState();
  //       },
  //       onTxFailed: () => {
  //         console.log('Seed failed');
  //       }
  //     });

  //     return tx;
  //   } catch (e) {
  //     console.log(e);
  //     return Promise.reject('Join failed');
  //   }
  // }

  function setActiveStep(step: number) {
    poolCreationState.activeStep = step;
  }

  // function acceptCustomTokenDisclaimer() {
  //   poolCreationState.acceptedCustomTokenDisclaimer = true;
  // }

  function saveState() {
    lsSet(
      COPPER_CREATION_STATE_KEY,
      JSON.stringify(poolCreationState),
      COPPER_CREATION_STATE_VERSION
    );
  }

  function resetState() {
    lsRemove(COPPER_CREATION_STATE_KEY);
  }

  // function importState(state) {
  //   for (const key of Object.keys(poolCreationState)) {
  //     if (key === 'activeStep') continue;
  //     poolCreationState[key] = state[key];
  //   }
  // }

  // function setRestoredState(value: boolean) {
  //   hasRestoredFromSavedState.value = value;
  // }

  async function retrievePoolDetails(hash: string) {
    const provider = new JsonRpcProvider(configService.network.publicRpc);

    const poolDetails = await copperService.pools.lbp.details(provider, hash);
    // console.log('aaaaretrievePoolDetails', poolDetails);
    // poolCreationState.poolId = poolDetails.id;
    poolCreationState.poolAddress = poolDetails.address;
    poolCreationState.needsSeeding = true;
    // saveState();
    resetState();
  }

  return {
    ...toRefs(poolCreationState),
    mainTokenAddress,
    baseTokenAddress,
    mainTokenInfo,
    baseTokenInfo,
    // tokenList,
    LBPTokenSymbol,
    LBPTokenName,
    // updateTokenWeights,
    proceed,
    // setFeeManagement,
    // setFeeType,
    // setFeeController,
    // setTrpController,
    // setStep,
    // resetPoolCreationState,
    // updateTokenColors,
    goBack,
    // getPoolSymbol,
    getScaledAmounts,
    createPool,
    // joinPool,
    setActiveStep,
    // updateManuallySetToken,
    // sortSeedTokens,
    // clearAmounts,
    // setAmountsToMaxBalances,
    // acceptCustomTokenDisclaimer,
    saveState
    // resetState,
    // importState,
    // setRestoredState,
    // setTokensList,
    // retrievePoolDetails,
    // currentLiquidity,
    // optimisedLiquidity,
    // scaledLiquidity,
    // tokensWithNoPrice,
    // similarPools,
    // isLoadingSimilarPools,
    // existingPool,
    // totalLiquidity,
    // maxInitialLiquidity,
    // poolLiquidity,
    // poolTypeString,
    // tokenColors,
    // isWethPool,
    // hasInjectedToken,
    // hasRestoredFromSavedState
    // approve
  };
}
