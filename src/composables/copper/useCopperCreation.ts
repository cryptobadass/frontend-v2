import { ref, reactive, toRefs, computed, watch } from 'vue';

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
import { networkId } from '@/composables/useNetwork';
import { TOKENS } from '@/constants/tokens';
import { useRoute } from 'vue-router';

export const COPPER_CREATION_STATE_VERSION = '1.0';
export const COPPER_CREATION_STATE_KEY = 'launchpadCreationState';

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

function getDefaultTime() {
  const now = new Date();
  const defaultStartTime = add(now, {
    hours: 1
  });
  const defaultEndTime = add(now, {
    hours: 1,
    days: 3
  });

  return [defaultStartTime, defaultEndTime];
}

const baseTokenOPtions = Object.keys(TOKENS.Prices.ChainMap[networkId.value]);

const emptyPoolCreationState = {
  seedTokens: [
    {
      tokenAddress: '', // 0x32F106297E28bBf71FFC41b74DA98D78b703B479
      startWeight: 99,
      endWeight: 1,
      id: '1',
      isLocked: false,
      amount: ''
    },
    {
      tokenAddress: '', // 0x286EA60Cb66ba7647C8143c5d467594B92A3734C
      startWeight: 1,
      endWeight: 99,
      id: '2',
      isLocked: false,
      amount: ''
    }
  ] as PoolSeedToken[],

  mainTokenAmount: '',
  baseTokenAmount: '',
  baseTokenOptions: [
    '0xea6a8f1ae564070f7f3fa6180678ea6744a1e01a',
    '0x286EA60Cb66ba7647C8143c5d467594B92A3734C',
    '0xed7F146612C8d2e8E101b8b5B8C58b8E70E99149'
  ],
  isCorrectOrder: true, // bool
  swapFeePercentage: 2.5, // uint256
  time: getDefaultTime() as Array<Date | null>,
  activeStep: 0,
  description: '',
  learnMoreLink: '',
  readAndAgree: false,
  poolId: '' as string,
  poolAddress: '',
  needsSeeding: false,
  createPoolTxHash: '',
  image: '', // 'https://img-operation.csdnimg.cn/csdn/silkroad/img/1607569674685.png'
  country: []
};

export const poolCreationState = reactive({ ...emptyPoolCreationState });
const countries = ref<string[]>([]);
export const hasRestoredFromSavedState = ref<boolean | null>(null);

export default function useCopperCreation() {
  /**
   * COMPOSABLES
   */
  const {
    searchTokens,
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
  const route = useRoute();

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
    return getToken(poolCreationState.seedTokens[0].tokenAddress) || null;
  });
  const baseTokenInfo = computed(() => {
    return getToken(poolCreationState.seedTokens[1].tokenAddress) || null;
  });
  const LBPTokenSymbol = computed(() => {
    return mainTokenInfo.value && mainTokenInfo.value.symbol
      ? `${mainTokenInfo.value.symbol}_LBP`
      : '';
  });
  const LBPTokenName = computed(() => {
    return mainTokenInfo.value && mainTokenInfo.value.name
      ? `${mainTokenInfo.value.name} Copper LBP`
      : '';
  });

  function resetPoolCreationState() {
    for (const key of Object.keys(poolCreationState)) {
      poolCreationState[key] = emptyPoolCreationState[key];
    }
    poolCreationState.time = getDefaultTime();
    setRestoredState(false);
    resetState();
  }

  function proceed() {
    poolCreationState.activeStep += 1;

    saveState();
  }

  function goBack() {
    poolCreationState.activeStep -= 1;
    if (hasRestoredFromSavedState.value) {
      setRestoredState(false);
    }
  }

  function setStep(step: number) {
    poolCreationState.activeStep = step;
  }

  function getScaledAmounts() {
    const scaledAmounts: string[] = poolCreationState.seedTokens.map(
      (token: PoolSeedToken) => {
        const tokenInfo = getToken(token.tokenAddress);
        if (!tokenInfo) return '0';
        const amount = bnum(token.amount);
        const scaledAmount = scale(amount, tokenInfo.decimals);
        const scaledRoundedAmount = scaledAmount.dp(0, BigNumber.ROUND_FLOOR);
        return scaledRoundedAmount.toString();
      }
    );
    return scaledAmounts;
  }

  function getScaledWeights() {
    const scaledWeights: string[] = poolCreationState.seedTokens.map(item => {
      const amount = bnum(item.startWeight).div(100);
      const scaledWeight = scale(amount, 18);
      const scaledRoundedWeight = scaledWeight.dp(0, BigNumber.ROUND_FLOOR);
      return scaledRoundedWeight.toString();
    });
    return scaledWeights;
  }

  function getScaledEndWeights() {
    const scaledWeights: string[] = poolCreationState.seedTokens.map(item => {
      const amount = bnum(item.endWeight).div(100);
      const scaledWeight = scale(amount, 18);
      const scaledRoundedWeight = scaledWeight.dp(0, BigNumber.ROUND_FLOOR);
      return scaledRoundedWeight.toString();
    });
    return scaledWeights;
  }
  function getScaledSwapFee() {
    const swapFee = bnum(poolCreationState.swapFeePercentage).div(100);
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

    try {
      const tx = await copperService.pools.lbp.create(provider, poolConfig);
      poolCreationState.createPoolTxHash = tx.hash;
      saveState();

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

  async function exitPool(address, callBack): Promise<TransactionResponse> {
    const provider = getProvider();
    try {
      const tx = await copperService.pools.lbp.exitPool(provider, address);
      poolCreationState.createPoolTxHash = tx.hash;

      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'exitPool',
        summary: 'exitPool',
        details: {
          name: 'exitPool'
        }
      });
      // 1;
      txListener(tx, {
        onTxConfirmed: async () => {
          callBack && callBack();
        },
        onTxFailed: () => {
          callBack && callBack();
        }
      });

      return tx;
    } catch (e) {
      console.log(e);
      callBack && callBack();
      return Promise.reject('exit pool failed');
    }
  }

  async function setSwapEnabled(
    address,
    swapEnabled,
    success,
    error
  ): Promise<TransactionResponse> {
    const provider = getProvider();
    try {
      const tx = await copperService.pools.lbp.setSwapEnabled(
        provider,
        address,
        swapEnabled
      );
      poolCreationState.createPoolTxHash = tx.hash;

      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'setSwapEnabled',
        summary: `set Swap ${swapEnabled ? 'Enabled' : 'Disable'}`,
        details: {
          name: 'setSwapEnabled'
        }
      });
      txListener(tx, {
        onTxConfirmed: async () => {
          success && success();
        },
        onTxFailed: () => {
          error && error();
        }
      });

      return tx;
    } catch (e) {
      console.log(e);
      error && error();
      return Promise.reject('set Swap Enabled failed');
    }
  }

  function setActiveStep(step: number) {
    poolCreationState.activeStep = step;
  }

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

  function saveToYotei() {
    const group = route.query.group as string;
    const data = {
      group_id: group
        ? parseInt(group)
        : configService.network.defaultLaunchpadGroupId, // todo
      network_id: networkId.value,
      lbp_name: LBPTokenName.value,
      lbp_symbol: LBPTokenSymbol.value,
      main_token: mainTokenAddress.value,
      base_token: baseTokenAddress.value,
      image_url: poolCreationState.image,
      description: poolCreationState.description,
      price: bnum(priceFor(baseTokenAddress.value))
        .times(poolCreationState.seedTokens[1].amount)
        .div(poolCreationState.seedTokens[0].amount)
        .toString(), // todo
      learn_more_url: poolCreationState.learnMoreLink,
      swap_fee: bnum(poolCreationState.swapFeePercentage)
        .div(100)
        .toString(),
      start_time: getUnixTime(poolCreationState.time[0] as Date),
      end_time: getUnixTime(poolCreationState.time[1] as Date),
      owner_address: account.value,
      pool_id: poolCreationState.poolId,
      pool_address: poolCreationState.poolAddress,
      blocked_countries: poolCreationState.country,
      lbp_creation_tx: poolCreationState.createPoolTxHash
    };
    console.log('save lbp to Yotei', data);
    copperService.pools.lbp.saveLBP(data);
  }

  function importState(state) {
    for (const key of Object.keys(poolCreationState)) {
      if (key === 'activeStep') continue;
      if (key === 'time') {
        poolCreationState[key] = [
          new Date(state[key][0]),
          new Date(state[key][1])
        ];
        continue;
      }
      poolCreationState[key] = state[key];
    }
  }

  function setRestoredState(value: boolean) {
    hasRestoredFromSavedState.value = value;
  }

  async function retrievePoolDetails(hash: string) {
    const provider = new JsonRpcProvider(configService.network.publicRpc);

    const poolDetails = await copperService.pools.lbp.details(provider, hash);
    poolCreationState.poolId = poolDetails.id;
    poolCreationState.poolAddress = poolDetails.address;
    poolCreationState.needsSeeding = true;
    saveState();
    saveToYotei();
  }

  watch(mainTokenAddress, async newQuery => {
    searchTokens(newQuery, []);
  });

  return {
    ...toRefs(poolCreationState),
    mainTokenAddress,
    baseTokenAddress,
    mainTokenInfo,
    baseTokenInfo,
    LBPTokenSymbol,
    LBPTokenName,
    proceed,
    resetPoolCreationState,
    goBack,
    getScaledAmounts,
    createPool,
    setActiveStep,
    saveState,
    importState,
    setRestoredState,
    hasRestoredFromSavedState,
    saveToYotei,
    exitPool,
    setSwapEnabled
  };
}
