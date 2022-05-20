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
    Cell: 'poolTokenCell'
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
    // accessor: 'end_time',
    accessor: pool => {
      return new Date(pool.end_time * 1000).toString();
    },
    width: 350,
    noGrow: true
  },
  // {
  //   name: 'Image',
  //   id: 'image_url',
  //   accessor: 'image_url',
  //   // width: 150,
  //   Cell: 'poolImageCell'
  // },
  {
    name: 'Status',
    id: 'status',
    accessor: 'status',
    Cell: 'poolStatusCell',
    width: 150
    // align: 'center'
  },
  {
    name: 'Price',
    id: 'price',
    accessor: pool => {
      return fNum2(pool.price, FNumFormats.fiat);
    },
    width: 150
  }
  // {
  //   name: 'TOKENS',
  //   id: 'icons',
  //   accessor: 'uri',
  //   // Header: 'iconColumnHeader',
  //   Cell: 'iconColumnCell',
  //   width: 125,
  //   noGrow: true
  // }
  // {
  //   name: _up(t('composition')),
  //   id: 'poolName',
  //   accessor: 'id',
  //   Cell: 'poolNameCell',
  //   width: props.hiddenColumns.length >= 2 ? wideCompositionWidth.value : 350
  // },
  // {
  //   name: _up(t('myBalance')),
  //   accessor: pool => {
  //     // console.log('aaaa----pool', pool, pool.shares);
  //     return fNum2(pool.shares, {
  //       style: 'currency',
  //       maximumFractionDigits: 0,
  //       fixedFormat: true
  //     });
  //   },
  //   align: 'right',
  //   id: 'myBalance',
  //   hidden: !props.showPoolShares,
  //   sortKey: pool => Number(pool.shares),
  //   width: 200,
  //   cellClassName: 'font-numeric'
  // },
  // {
  //   name: _up(t('poolValue')),
  //   accessor: pool =>
  //     fNum2(pool.totalLiquidity, {
  //       style: 'currency',
  //       maximumFractionDigits: 0
  //     }),
  //   align: 'right',
  //   id: 'poolValue',
  //   sortKey: pool => {
  //     const apr = Number(pool.totalLiquidity);
  //     if (apr === Infinity || isNaN(apr)) return 0;
  //     return apr;
  //   },
  //   width: 200,
  //   cellClassName: 'font-numeric'
  // },
  // {
  //   name: _up(t('volume24h', [t('hourAbbrev')])),
  //   accessor: pool =>
  //     fNum2(pool.dynamic.volume, {
  //       style: 'currency',
  //       maximumFractionDigits: 0
  //     }),
  //   align: 'right',
  //   id: 'poolVolume',
  //   sortKey: pool => {
  //     const apr = Number(pool.dynamic.volume);
  //     if (apr === Infinity || isNaN(apr)) return 0;
  //     return apr;
  //   },
  //   width: 200,
  //   cellClassName: 'font-numeric'
  // },
  // {
  //   name: props.showPoolShares ? _up(t('myApr')) : _up(t('apr')),
  //   Cell: 'aprCell',
  //   accessor: pool => pool.dynamic.apr.total,
  //   align: 'right',
  //   id: 'poolApr',
  //   sortKey: pool => {
  //     const apr = Number(pool.dynamic.apr.total);
  //     if (apr === Infinity || isNaN(apr)) return 0;
  //     return apr;
  //   },
  //   width: 150
  // },
  // {
  //   name: _up(t('migrate')),
  //   Cell: 'migrateCell',
  //   accessor: 'migrate',
  //   align: 'center',
  //   id: 'migrate',
  //   width: 150
  // },
  // {
  //   name: _up(t('stake')),
  //   Cell: 'stakeCell',
  //   accessor: 'stake',
  //   align: 'center',
  //   id: 'stake',
  //   width: 150
  // }
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
  if (now_time < start_time) return 'Unstart';
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
        <div class="flex items-center">
          <BalAsset class="mx-2" :iconURI="pool.image_url" />
          {{ pool.lbp_name }}
        </div>
      </template>
      <template v-slot:poolStatusCell="pool">
        <div class="flex items-center px-4">
          {{ formatStatus(pool) }}
        </div>
      </template>
      <!-- <template v-slot:iconColumnCell="pool">
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
      </template> -->
    </BalTable>
  </BalCard>
</template>
