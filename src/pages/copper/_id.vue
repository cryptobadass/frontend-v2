<template>
  <div class="lg:container lg:mx-auto pt-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-0 lg:gap-x-8">
      <div class="col-span-2">
        <BalLoadingBlock v-if="loadingPool" class="h-16" />
        <div v-else class="px-4 lg:px-0 flex flex-col">
          <CopperDetailHeader :pool="pool?.pools" />
        </div>
      </div>

      <div class="hidden lg:block" />

      <div class="col-span-2 order-2 lg:order-1">
        <div class="grid grid-cols-1 gap-y-8">
          <div class="px-1 lg:px-0">
            <!-- <CopperChart
              :pool="pool"
              :historicalPrices="historicalPrices"
              :snapshots="snapshots"
              :loading="isLoadingSnapshots"
            /> -->
          </div>
          <!-- <div class="mb-4 px-1 lg:px-0">
            <CopperStatCards :pool="pool" :loading="loadingPool" />
          </div> -->

          <div>
            <CopperTransactionsCard
              :pool="pool?.pools"
              :loading="loadingPool"
            />
          </div>
        </div>
      </div>

      <div class="order-1 lg:order-2 px-1 lg:px-0">
        <BalStack vertical>
          <BalLoadingBlock
            v-if="loadingPool"
            class="pool-actions-card h-60 mb-4"
          />

          <!-- <GetDeFiCertifiedCard
            v-else
            :pool="pool"
            :missingPrices="missingPrices"
            class="mb-4"
          /> -->
          <TradeCardGP
            :assetIn="pool?.pools.base_token"
            :assetOut="pool?.pools.main_token"
            lbp
            :fixedToken="pool?.pools.main_token"
          />
        </BalStack>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch } from 'vue';
import * as CopperPageComponents from '@/components/contextual/pages/copper';
// import GauntletIcon from '@/components/images/icons/GauntletIcon.vue';
// import LiquidityAPRTooltip from '@/components/tooltips/LiquidityAPRTooltip.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import useNumbers from '@/composables/useNumbers';
import { usePool } from '@/composables/usePool';
import useCopperPoolQuery from '@/composables/queries/useCopperPoolQuery';
import usePoolSnapshotsQuery from '@/composables/queries/usePoolSnapshotsQuery';
import { POOLS } from '@/constants/pools';
import { EXTERNAL_LINKS } from '@/constants/links';
import useWeb3 from '@/services/web3/useWeb3';
import useTokens from '@/composables/useTokens';
import useApp from '@/composables/useApp';
import useAlerts, { AlertPriority, AlertType } from '@/composables/useAlerts';
// import StakingIncentivesCard from '@/components/contextual/pages/pool/StakingIncentivesCard/StakingIncentivesCard.vue';
// import LMIncentivesCard from '@/components/contextual/pages/pool/LMIncentivesCard/LMIncentivesCard.vue';
// import StakingProvider from '@/providers/local/staking.provider';
import TradeCardGP from '@/components/cards/TradeCardGP/TradeCardGP.vue';
import { getAddressFromPoolId } from '@/lib/utils';
import { isL2 } from '@/composables/useNetwork';

interface PoolPageData {
  id: string;
}

export default defineComponent({
  components: {
    ...CopperPageComponents,
    TradeCardGP
    // GauntletIcon,
    // LiquidityAPRTooltip,
    // StakingIncentivesCard,
    // StakingProvider,
    // LMIncentivesCard
  },

  setup() {
    /**
     * COMPOSABLES
     */
    const { appLoading } = useApp();
    const { t } = useI18n();
    const route = useRoute();
    const { fNum2 } = useNumbers();
    const { isWalletReady } = useWeb3();
    const { prices } = useTokens();
    const {
      blockNumber,
      isKovan,
      isMainnet,
      isPolygon,
      isFuji,
      isAvalanche
    } = useWeb3();
    const { addAlert, removeAlert } = useAlerts();
    const { balancerTokenListTokens } = useTokens();

    /**
     * QUERIES
     */
    const poolQuery = useCopperPoolQuery(route.params.id as string);
    const poolSnapshotsQuery = usePoolSnapshotsQuery(
      route.params.id as string,
      30
    );

    /**
     * STATE
     */
    const data = reactive<PoolPageData>({
      id: route.params.id as string
    });

    /**
     * COMPUTED
     */
    const pool = computed(() => poolQuery.data.value);
    // debugger
    // const {
    //   isStableLikePool,
    //   isLiquidityBootstrappingPool,
    //   isStablePhantomPool
    // } = usePool(poolQuery.data);

    // const noInitLiquidity = computed(
    //   () =>
    //     !loadingPool.value &&
    //     pool.value &&
    //     Number(pool.value.onchain.totalSupply) === 0
    // );

    // const communityManagedFees = computed(
    //   () => pool.value?.owner == POOLS.DelegateOwner
    // );
    // const feesManagedByGauntlet = computed(
    //   () =>
    //     communityManagedFees.value &&
    //     POOLS.DynamicFees.Gauntlet.includes(data.id)
    // );
    // const feesFixed = computed(() => pool.value?.owner == POOLS.ZeroAddress);
    // const swapFeeToolTip = computed(() => {
    //   if (feesManagedByGauntlet.value) {
    //     return t('feesManagedByGauntlet');
    //   } else if (communityManagedFees.value) {
    //     return t('delegateFeesTooltip');
    //   } else if (feesFixed.value) {
    //     return t('fixedFeesTooltip');
    //   } else {
    //     return t('ownerFeesTooltip');
    //   }
    // });

    const poolQueryLoading = computed(
      () =>
        poolQuery.isLoading.value ||
        poolQuery.isIdle.value ||
        poolQuery.error.value
    );

    const loadingPool = computed(() => poolQueryLoading.value || !pool.value);

    const snapshots = computed(() => poolSnapshotsQuery.data.value?.snapshots);
    // const historicalPrices = computed(
    //   () => poolSnapshotsQuery.data.value?.prices
    // );
    // const isLoadingSnapshots = computed(
    //   () =>
    //     poolSnapshotsQuery.isLoading.value || poolSnapshotsQuery.isIdle.value
    // );

    // const titleTokens = computed(() => {
    //   if (!pool.value) return [];

    //   return Object.entries(pool.value.onchain.tokens).sort(
    //     ([, a]: any[], [, b]: any[]) => b.weight - a.weight
    //   );
    // });

    // const poolTypeLabel = computed(() => {
    //   if (!pool.value) return '';
    //   const key = POOLS.Factories[pool.value.factory];

    //   return key ? t(key) : t('unknownPoolType');
    // });

    // const poolFeeLabel = computed(() => {
    //   if (!pool.value) return '';
    //   const feeLabel = `${fNum2(pool.value.onchain.swapFee, {
    //     style: 'percent',
    //     maximumFractionDigits: 4
    //   })}`;

    //   if (feesFixed.value) {
    //     return t('fixedSwapFeeLabel', [feeLabel]);
    //   } else if (communityManagedFees.value) {
    //     return feesManagedByGauntlet.value
    //       ? t('dynamicSwapFeeLabel', [feeLabel])
    //       : t('communitySwapFeeLabel', [feeLabel]);
    //   }

    //   // Must be owner-controlled
    //   return t('dynamicSwapFeeLabel', [feeLabel]);
    // });

    // const missingPrices = computed(() => {
    //   if (pool.value) {
    //     const tokensWithPrice = Object.keys(prices.value);

    //     const tokens =
    //       isStablePhantomPool.value && pool.value.mainTokens
    //         ? pool.value.mainTokens
    //         : pool.value.tokenAddresses;

    //     return !tokens.every(token => tokensWithPrice.includes(token));
    //   }
    //   return false;
    // });

    // const isCopperNetworkSupported = computed(
    //   () =>
    //     isMainnet.value ||
    //     isPolygon.value ||
    //     isKovan.value ||
    //     isFuji.value ||
    //     isAvalanche.value
    // );

    // Temporary solution to hide Copper card on Fei pool page.
    // Longer terms solution is needed distinguish LBP platforms
    // and display custom widgets linking to their pages.
    // const isCopperPool = computed((): boolean => {
    //   const feiPoolId =
    //     '0xede4efcc5492cf41ed3f0109d60bc0543cfad23a0002000000000000000000bb';
    //   return (
    //     !!pool.value &&
    //     isLiquidityBootstrappingPool.value &&
    //     pool.value.id !== feiPoolId &&
    //     isCopperNetworkSupported.value
    //   );
    // });

    // const copperNetworkPrefix = computed(() => {
    //   if (isPolygon.value) {
    //     return 'polygon.';
    //   }
    //   if (isKovan.value) {
    //     return 'kovan.';
    //   }
    //   return '';
    // });

    // const hasCustomToken = computed(() => {
    //   const knownTokens = Object.keys(balancerTokenListTokens.value);
    //   return (
    //     !!pool.value &&
    //     !isLiquidityBootstrappingPool.value &&
    //     !isStablePhantomPool.value &&
    //     pool.value.tokenAddresses.some(
    //       address => !knownTokens.includes(address)
    //     )
    //   );
    // });

    // const isStakeablePool = computed((): boolean =>
    //   POOLS.Stakeable.AllowList.includes(route.params.id as string)
    // );

    /**
     * METHODS
     */
    // function onNewTx(): void {
    //   poolQuery.refetch.value();
    // }

    /**
     * WATCHERS
     */
    // watch(blockNumber, () => {
    //   poolQuery.refetch.value();
    // });

    // watch(poolQuery.error, () => {
    //   if (poolQuery.error.value) {
    //     addAlert({
    //       id: 'pool-fetch-error',
    //       label: t('alerts.pool-fetch-error'),
    //       type: AlertType.ERROR,
    //       persistent: true,
    //       action: poolQuery.refetch.value,
    //       actionLabel: t('alerts.retry-label'),
    //       priority: AlertPriority.MEDIUM
    //     });
    //   } else {
    //     removeAlert('pool-fetch-error');
    //   }
    // });

    return {
      // data
      ...toRefs(data),
      EXTERNAL_LINKS,
      // computed
      appLoading,
      pool,
      // noInitLiquidity,
      // poolTypeLabel,
      // poolFeeLabel,
      // historicalPrices,
      // snapshots,
      // isLoadingSnapshots,
      loadingPool
      // titleTokens,
      // isWalletReady,
      // missingPrices,
      // feesManagedByGauntlet,
      // swapFeeToolTip,
      // isStableLikePool,
      // isLiquidityBootstrappingPool
      // isCopperPool,
      // isStablePhantomPool,
      // copperNetworkPrefix,
      // hasCustomToken,
      // isL2,
      // isStakeablePool,
      // // methods
      // fNum2,
      // onNewTx,
      // getAddressFromPoolId
    };
  }
});
</script>

<style scoped>
.pool-title {
  @apply mr-4 capitalize mt-2;
  font-variation-settings: 'wght' 700;
}

.pool-actions-card {
  @apply relative;
}

@media (min-width: 768px) and (min-height: 600px) {
  .pool-actions-card {
    @apply sticky top-24;
  }
}
</style>
