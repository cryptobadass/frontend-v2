<script setup lang="ts">
// import { toRef, computed, ref } from 'vue';
// import { useRouter } from 'vue-router';

import {
  FullPoolCopper,
  LBPDetail,
  LBPStatistics
} from '@/services/balancer/subgraph/types';
import BalAsset from '@/components/_global/BalAsset/BalAsset.vue';
import { computed, watch } from 'vue';
import { differenceInDays } from 'date-fns';
import useCountDown from '@/composables/useCountDown';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { toJsTimestamp } from '@/composables/useTime';
import { bnum } from '@/lib/utils';

const { fNum2 } = useNumbers();

/**
 * TYPES
 */
type Props = {
  pool: FullPoolCopper;
  lbpDetail: LBPDetail;
  lbpStatistics: LBPStatistics;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

const pool = computed(() => props.pool);
const lbpDetail = computed(() => props.lbpDetail);
const ends = computed(() => {
  return props.pool.end_time;
});
const differenceInDay = computed(() => {
  if (props.pool.end_time && props.pool.start_time) {
    return differenceInDays(
      new Date(toJsTimestamp(props.pool.end_time)),
      new Date(toJsTimestamp(props.pool.start_time))
    );
  } else {
    return 0;
  }
});
const countDown = useCountDown(props.pool.end_time);
const startBalanceList = computed(() => {
  if (!props.pool || !props.lbpDetail) return null;
  return props.lbpStatistics.filter(item => item.type == 'Join')[0].amounts;
});
const mainAndBaseNeedSwap = computed(() => {
  return props.pool.main_token == props.lbpDetail.tokensList[0] ? 0 : 1;
});
const mainStartBalances = computed(() => {
  if (!startBalanceList.value) return '';
  return startBalanceList.value[mainAndBaseNeedSwap.value];
});
const baseStartBalances = computed(() => {
  if (!startBalanceList.value) return '';
  return startBalanceList.value[1 - mainAndBaseNeedSwap.value];
});
const mainCurrentBalances = computed(() => {
  if (!props.pool || !props.lbpDetail) return '';
  // parseEther
  return props.lbpDetail.tokens[mainAndBaseNeedSwap.value].balance || '';
});
const mainTokenReleased = computed(() => {
  if (!startBalanceList.value) return '';
  let released = bnum(mainStartBalances.value)
    .minus(bnum(mainCurrentBalances.value))
    .div(bnum(mainStartBalances.value));
  return released;
});
const baseCurrentBalances = computed(() => {
  if (!props.pool || !props.lbpDetail) return '';
  return props.lbpDetail.tokens[1 - mainAndBaseNeedSwap.value].balance || '';
});
const baseTokenAccrued = computed(() => {
  if (!startBalanceList.value) return '';
  let accrued = bnum(baseCurrentBalances.value).minus(
    bnum(baseStartBalances.value)
  );
  return accrued;
});
const baseTokenSymbol = computed(() => {
  if (!startBalanceList.value) return '';
  return props.lbpDetail.tokens[1 - mainAndBaseNeedSwap.value].symbol || '';
});
</script>

<template>
  <div>
    <div class="flex items-center mb-4">
      <div class="font-bold text-2xl mr-2">
        {{ pool.lbp_name }} Liquidity Bootstrapping Pool
      </div>
      <!-- <BalAsset
        :address="pool.pool_address"
        :iconURI="pool.image_url"
      ></BalAsset> -->
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-0 md:gap-x-2">
      <div class="col-span-1">
        <div class="text-gray-400">DURATION</div>
        <div class="font-bold">{{ differenceInDay }} days</div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">ENDS IN</div>
        <div class="font-bold">{{ countDown }}</div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">TOTAL VOLUME</div>
        <div class="font-bold">
          {{ fNum2(lbpDetail.totalSwapVolume, FNumFormats.token) }}
        </div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">LIQUIDITY</div>
        <div class="font-bold">
          {{ fNum2(lbpDetail.totalLiquidity, FNumFormats.token) }}
        </div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">PRICE</div>
        <div class="font-bold">{{ fNum2(pool.price, FNumFormats.fiat) }}</div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">MAIN TOKENS RELEASED</div>
        <div class="font-bold">
          {{ fNum2(mainTokenReleased as string, FNumFormats.percent) }}
        </div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400 text-sm">BASE TOKENS ACCRUED</div>
        <div class="font-bold">
          {{ fNum2(baseTokenAccrued as string, FNumFormats.token) }}
        </div>
        <div class="text-gray-400 font-bold text-sm">{{ baseTokenSymbol }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
