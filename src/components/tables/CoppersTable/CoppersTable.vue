<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import {
  DecoratedPoolWithShares,
  FullPoolCopper,
  LBPDetail
} from '@/services/balancer/subgraph/types';

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
import { toJsTimestamp } from '@/composables/useTime';

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
  lbpDetail: LBPDetail;
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
    name: 'Token',
    id: 'lbp_name',
    accessor: 'lbp_name',
    width: 250,
    noGrow: true,
    Cell: 'poolTokenCell',
    align: 'left'
  },
  {
    name: 'Start Time',
    id: 'start_time',
    accessor: pool => {
      return new Date(pool.start_time * 1000).toString();
    },
    width: 350,
    noGrow: true
  },
  {
    name: 'End Time',
    id: 'end_time',

    accessor: pool => {
      return new Date(pool.end_time * 1000).toString();
    },
    width: 350,
    noGrow: true
  },

  {
    name: 'Status',
    id: 'status',
    accessor: 'status',
    Cell: 'poolStatusCell',
    width: 150
  },
  {
    name: 'Price',
    id: 'price',
    accessor: pool => {
      return fNum2(pool.price, FNumFormats.fiat);
    },
    width: 150
  }
]);

const visibleColumns = computed(() =>
  columns.value.filter(column => !props.hiddenColumns.includes(column.id))
);

const stakeablePoolIds = computed((): string[] => POOLS.Stakeable.AllowList);

/**
 * METHODS
 */
function handleRowClick(pool: FullPoolCopper) {
  trackGoal(Goals.ClickPoolsTableRow);
  router.push({ name: 'launchpad-detail', params: { id: pool.pool_id } });
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
function formatStatus(pool: DecoratedPoolCopper) {
  const start_time = toJsTimestamp(pool.start_time);
  const end_time = toJsTimestamp(pool.end_time);
  const now_time = Date.now();
  if (now_time < start_time) return 'Unstarted';
  if (now_time > end_time) return 'Ended';
  return pool.lbpDetail.swapEnabled ? 'Active' : 'Inactive';
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
        to: 'launchpad-detail',
        getParams: pool => ({ id: pool.pool_id })
      }"
      :on-row-click="handleRowClick"
      :is-paginated="isPaginated"
      @load-more="emit('loadMore')"
    >
      <template v-slot:poolImageCell="pool">
        <div class="flex items-center">
          <BalAsset :iconURI="pool.image_url" />
        </div>
      </template>
      <template v-slot:poolTokenCell="pool">
        <div class="flex items-center text-left">
          <BalAsset class="mx-2" :iconURI="pool.image_url" />
          {{ pool.lbp_name }}
        </div>
      </template>
      <template v-slot:poolStatusCell="pool">
        <div class="flex items-center px-4">
          {{ formatStatus(pool) }}
        </div>
      </template>
    </BalTable>
  </BalCard>
</template>
