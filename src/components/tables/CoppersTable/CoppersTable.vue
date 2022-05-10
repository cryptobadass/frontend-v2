<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { DecoratedPoolWithShares } from '@/services/balancer/subgraph/types';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useFathom from '@/composables/useFathom';
import useDarkMode from '@/composables/useDarkMode';
import useBreakpoints from '@/composables/useBreakpoints';
import {
  isStableLike,
  isMigratablePool,
  orderedTokenAddresses,
  orderedPoolTokens
} from '@/composables/usePool';

import LiquidityAPRTooltip from '@/components/tooltips/LiquidityAPRTooltip.vue';
import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import { POOL_MIGRATIONS_MAP } from '@/components/forms/pool_actions/MigrateForm/constants';
import { PoolMigrationType } from '@/components/forms/pool_actions/MigrateForm/types';

import TokenPills from './TokenPills/TokenPills.vue';
import { POOLS } from '@/constants/pools';
import { stringToUpperCase as _up } from '@/lib/utils/index';

/**
 * TYPES
 */
type DecoratedPoolCopper = {
  lbp_name: string;
  price: number;
  start_time: number;
  end_time: number;
  network: number;
  image_url: string;
  id: number;
};

type Props = {
  data?: DecoratedPoolCopper[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  showPoolShares?: boolean;
  noPoolsLabel?: string;
  isPaginated?: boolean;
  selectedTokens?: string[];
  hiddenColumns?: string[];
};

/**
 * PROPS & EMITS
 */

const props = withDefaults(defineProps<Props>(), {
  isLoadingMore: false,
  showPoolShares: false,
  noPoolsLabel: 'No pools',
  isPaginated: false,
  hiddenColumns: () => []
});

const emit = defineEmits(['loadMore', 'triggerStake']);

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();
const router = useRouter();
const { t } = useI18n();
const { trackGoal, Goals } = useFathom();
const { darkMode } = useDarkMode();
const { upToLargeBreakpoint, upToMediumBreakpoint } = useBreakpoints();

const wideCompositionWidth = computed(() =>
  upToMediumBreakpoint.value ? 900 : undefined
);

/**
 * DATA
 */
const columns = computed<ColumnDefinition<DecoratedPoolCopper>[]>(() => [
  {
    name: 'LBP Name',
    id: 'lbp_name',
    accessor: 'lbp_name'
  },
  {
    name: 'Start Time',
    id: 'start_time',
    accessor: 'start_time'
  },
  {
    name: 'End Time',
    id: 'end_time',
    accessor: 'end_time'
  },
  {
    name: 'Image',
    id: 'image_url',
    accessor: row => {
      return row.image_url;
    }
  }
  // {
  //   name: 'LBP name',
  //   id: 'lbp_name',
  //   accessor: 'lbp_name',
  //   // Header: 'iconColumnHeader',
  //   Cell: 'iconColumnCell',
  //   width: 250,
  //   noGrow: true
  // },
  // {
  //   name: 'Network',
  //   id: 'poolName',
  //   accessor: 'id',
  //   Cell: 'poolNameCell',
  //   width: props.hiddenColumns.length >= 2 ? wideCompositionWidth.value : 350
  // },
  // {
  //   name: 'start Time',
  //   accessor: pool => {
  //     // console.log('aaaa----pool', pool, pool.shares);
  //     return pool.start_time;
  //   },
  //   align: 'right',
  //   id: 'start_time',
  //   width: 250,
  //   cellClassName: 'font-numeric'
  // },
  // {
  //   name: 'Price',
  //   accessor: pool =>
  //     fNum2(pool.price, {
  //       style: 'currency',
  //       maximumFractionDigits: 0
  //     }),
  //   align: 'right',
  //   id: 'poolValue',
  //   sortKey: pool => {
  //     const apr = Number(pool.price);
  //     if (apr === Infinity || isNaN(apr)) return 0;
  //     return apr;
  //   },
  //   width: 250,
  //   cellClassName: 'font-numeric'
  // }
]);

const visibleColumns = computed(() =>
  columns.value.filter(column => !props.hiddenColumns.includes(column.id))
);

const stakeablePoolIds = computed((): string[] => POOLS.Stakeable.AllowList);

/**
 * METHODS
 */
function handleRowClick(pool: DecoratedPoolWithShares) {
  trackGoal(Goals.ClickPoolsTableRow);
  router.push({ name: 'copper-detail', params: { id: pool.id } });
}

function navigateToPoolMigration(pool: DecoratedPoolWithShares) {
  router.push({
    name: 'migrate-pool',
    params: {
      from: pool.id,
      to: POOL_MIGRATIONS_MAP[PoolMigrationType.AAVE_BOOSTED_POOL].toPoolId
    },
    query: { returnRoute: 'home' }
  });
}
</script>

<template>
  <BalCard shadow="lg" :square="upToLargeBreakpoint" :noBorder="true" noPad>
    <BalTable
      :columns="visibleColumns"
      :data="data"
      :is-loading="isLoading"
      :is-loading-more="isLoadingMore"
      skeleton-class="h-64"
      sticky="both"
      :square="upToLargeBreakpoint"
      :link="{
        to: 'copper-detail',
        getParams: pool => ({ id: pool.id })
      }"
      :on-row-click="handleRowClick"
      :is-paginated="isPaginated"
      @load-more="emit('loadMore')"
      :initial-state="{
        sortColumn: 'poolValue',
        sortDirection: 'desc'
      }"
    >
      <template v-slot:iconColumnHeader>
        <div class="flex items-center">
          <img
            v-if="darkMode"
            :src="require('@/assets/images/icons/tokens_white.svg')"
          />
          <img
            v-else
            :src="require('@/assets/images/icons/tokens_black.svg')"
          />
        </div>
      </template>
      <template v-slot:iconColumnCell="pool">
        <div v-if="!isLoading" class="px-6 py-4">
          <BalAssetSet
            :addresses="orderedTokenAddresses(pool)"
            :width="100"
            :size="30"
          />
        </div>
      </template>
      <template v-slot:poolNameCell="pool">
        <div v-if="!isLoading" class="px-6 py-4 flex items-center">
          <TokenPills
            :tokens="
              orderedPoolTokens(pool.poolType, pool.address, pool.tokens)
            "
            :isStablePool="isStableLike(pool.poolType)"
            :selectedTokens="selectedTokens"
          />
          <BalChip
            v-if="pool.dynamic.isNewPool"
            color="red"
            size="sm"
            class="ml-2 uppercase"
            :outline="false"
          >
            {{ $t('new') }}
          </BalChip>
        </div>
      </template>
      <template v-slot:aprCell="pool">
        <div class="px-6 py-4 -mt-1 flex justify-end font-numeric">
          {{
            Number(pool.dynamic.apr.pool) > 10000
              ? '-'
              : fNum2(pool.dynamic.apr.total, FNumFormats.percent)
          }}
          <LiquidityAPRTooltip :pool="pool" />
        </div>
      </template>
      <template v-slot:migrateCell="pool">
        <div class="px-2 py-4 flex justify-center">
          <BalBtn
            v-if="isMigratablePool(pool)"
            color="blue"
            size="sm"
            @click.prevent="navigateToPoolMigration(pool)"
          >
            {{ $t('migrate') }}
          </BalBtn>
        </div>
      </template>
      <template v-slot:stakeCell="pool">
        <div class="px-2 py-4 flex justify-center">
          <BalBtn
            v-if="stakeablePoolIds.includes(pool.id)"
            color="blue"
            size="sm"
            @click.prevent="$emit('triggerStake', pool)"
          >
            {{ $t('stake') }}
          </BalBtn>
          <div v-else>{{ $t('notAvailable') }}</div>
        </div>
      </template>
    </BalTable>
  </BalCard>
</template>
