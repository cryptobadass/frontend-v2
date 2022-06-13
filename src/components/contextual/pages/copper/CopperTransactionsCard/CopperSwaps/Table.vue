<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';

import useTokens from '@/composables/useTokens';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useBreakpoints from '@/composables/useBreakpoints';

import { CopperSwap, PoolSwap } from '@/services/balancer/subgraph/types';

import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';

import { bnum } from '@/lib/utils';
import useWeb3 from '@/services/web3/useWeb3';
import { stringToUpperCase as _up } from '@/lib/utils/index';
import BalLink from '@/components/_global/BalLink/BalLink.vue';

/**
 * TYPES
 */
type SwapRow = {
  tokenIn: string;
  tokenOut: string;
  tokenAmountIn: string;
  tokenAmountOut: string;
  timestamp: number;
  formattedDate: string;
  value: number;
  formattedValue: string;
  tx: string;
  tokenInSym: string;
  tokenOutSym: string;
};

type Props = {
  tokens: string[];
  swapFee: string;
  poolSwaps: CopperSwap[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  loadMore?: () => void;
  isPaginated?: boolean;
  noResultsLabel?: string;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isLoadingMore: false,
  isPaginated: false
});

const emit = defineEmits(['loadMore']);

/**
 * COMPOSABLES
 */
const { fNum2, toFiat } = useNumbers();
const { t } = useI18n();
const { priceFor } = useTokens();
const { upToLargeBreakpoint } = useBreakpoints();
const { explorerLinks } = useWeb3();

/**
 * COMPUTED
 */
const columns = computed<ColumnDefinition<SwapRow>[]>(() => [
  // {
  //   name: _up(t('action')),
  //   id: 'action',
  //   accessor: 'tx',
  //   Cell: 'actionCell',
  //   width: 150,
  //   sortable: false
  // },
  {
    name: 'TYPE',
    id: 'type',
    accessor: 'type',
    Cell: 'typeCell',
    width: 150,
    sortable: false
  },
  {
    name: _up(t('details')),
    id: 'details',
    accessor: '',
    Cell: 'detailsCell',
    width: 325,
    sortable: false
  },
  {
    name: `PRICE`,
    id: 'value',
    accessor: 'value',
    Cell: 'valueCell',
    align: 'right',
    className: 'align-center w-40',
    // sortKey: pool => pool.value,
    width: 125
  },
  {
    name: _up(t('time')),
    id: 'timeAgo',
    accessor: 'timestamp',
    Cell: 'timeCell',
    align: 'right',
    sortKey: pool => pool.timestamp,
    width: 200
  },
  {
    name: 'WALLET',
    id: 'wallet',
    accessor: 'wallet',
    Cell: 'walletCell',
    width: 200,
    align: 'right'
  }
]);

const swapRows = computed<SwapRow[]>(() =>
  props.isLoading
    ? []
    : props.poolSwaps.map(
        ({
          tokenIn,
          tokenOut,
          tokenAmountIn,
          tokenAmountOut,
          timestamp,
          tx,
          tokenInSym,
          tokenOutSym,
          caller
        }) => {
          const value = bnum(priceFor(tokenOut))
            .times(tokenAmountOut)
            .toNumber();

          return {
            value,
            formattedValue:
              value > 0
                ? fNum2(value, { style: 'currency', abbreviate: true })
                : '-',
            tokenIn,
            tokenOut,
            tokenAmountIn,
            tokenAmountOut,
            tokenInSym,
            tokenOutSym,
            caller,
            timestamp,
            formattedDate: t('timeAgo', [
              formatDistanceToNow(timestamp * 1000)
            ]),
            tx
          };
        }
      )
);

function getPrice(action) {
  // console.log('aaa', props.tokens, action.tokenOut, action.tokenIn);
  // ['0x32F106297E28bBf71FFC41b74DA98D78b703B479', '0x286EA60Cb66ba7647C8143c5d467594B92A3734C']
  // 0x32f106297e28bbf71ffc41b74da98d78b703b479 0x286ea60cb66ba7647c8143c5d467594b92a3734c
  // why not use action
  // if use action.tokenOut or tokenIn, can't get price, because not inject
  if (props.tokens[0].toUpperCase() == action.tokenIn.toUpperCase()) {
    // sell
    let all = toFiat(action.tokenAmountOut, props.tokens[1]); // 0x286EA60Cb66ba7647C8143c5d467594B92A3734C
    let tokenValue = bnum(all)
      .times(bnum(1).minus(bnum(props.swapFee)))
      .div(action.tokenAmountIn)
      .toString();
    return fNum2(tokenValue, FNumFormats.fiat);
  } else {
    // buy
    let all = toFiat(action.tokenAmountIn, props.tokens[1]); //0x286EA60Cb66ba7647C8143c5d467594B92A3734C
    let tokenValue = bnum(all)
      .times(bnum(1).minus(bnum(props.swapFee)))
      .div(action.tokenAmountOut)
      .toString();
    return fNum2(tokenValue, FNumFormats.fiat);
  }
}
</script>

<template>
  <BalCard
    class="overflow-x-auto"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :columns="columns"
      :data="swapRows"
      :is-loading="isLoading"
      :is-loading-more="isLoadingMore"
      :is-paginated="isPaginated"
      @load-more="emit('loadMore')"
      skeleton-class="h-64"
      sticky="both"
      :no-results-label="noResultsLabel"
      :initial-state="{
        sortColumn: 'timeAgo',
        sortDirection: 'desc'
      }"
    >
      <!-- <template v-slot:actionCell>
        <div class="px-6 py-2">
          <div class="flex items-center">
            {{ $t('swap') }}
          </div>
        </div>
      </template> -->
      <template v-slot:detailsCell="action">
        <div class="px-6 py-4 flex -mt-1 items-center flex-wrap">
          <div class="token-item">
            <BalAsset :address="action.tokenIn" class="mr-2 flex-shrink-0" />
            <span class="font-numeric">{{
              fNum2(action.tokenAmountIn, FNumFormats.token)
            }}</span>
            <span class="ml-2">{{ action.tokenInSym }}</span>
          </div>
          <BalIcon name="arrow-right" class="mx-1" />
          <div class="token-item">
            <BalAsset :address="action.tokenOut" class="mr-2 flex-shrink-0" />
            <span class="font-numeric">{{
              fNum2(action.tokenAmountOut, FNumFormats.token)
            }}</span>
            <span class="ml-2">{{ action.tokenOutSym }}</span>
          </div>
        </div>
      </template>

      <template v-slot:valueCell="action">
        <div class="px-6 py-4 flex justify-end font-numeric">
          {{ getPrice(action) }}
        </div>
      </template>

      <template v-slot:typeCell="action">
        <div
          v-if="action.tokenIn.toUpperCase() !== props.tokens[0].toUpperCase()"
          class="px-6 py-4  font-numeric text-left text-cyan-50"
        >
          Buy
        </div>
        <div v-else class="px-6 py-4 font-numeric text-left text-red-500">
          Sell
        </div>
      </template>

      <template v-slot:walletCell="action">
        <div class="px-6 py-4 flex justify-end font-numeric">
          <BalLink :href="explorerLinks.addressLink(action.caller)"
            ><div class="text-cyan" v-text="_shorten(action.caller)"
          /></BalLink>
        </div>
      </template>

      <template v-slot:timeCell="action">
        <div class="px-6 py-4">
          <div
            class="flex items-center justify-end wrap whitespace-nowrap text-right"
          >
            {{ action.formattedDate }}
            <BalLink
              :href="explorerLinks.txLink(action.tx)"
              external
              class="ml-2 flex items-center"
            >
              <BalIcon
                name="arrow-up-right"
                size="sm"
                class="text-gray-500 hover:text-cyan-500 transition-colors"
              />
            </BalLink>
          </div>
        </div>
      </template>
    </BalTable>
  </BalCard>
</template>

<style scoped>
.token-item {
  @apply m-1 flex items-center p-1 px-2 bg-gray-50 dark:bg-gray-700 rounded-lg;
}
</style>
