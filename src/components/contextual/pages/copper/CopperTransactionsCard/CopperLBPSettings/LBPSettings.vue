<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import {
  FullPoolCopper,
  LBPDetail,
  LBPStatistics
} from '@/services/balancer/subgraph/types';

import { PoolTransactionsTab } from '../types';
import useCopperCreation from '@/composables/copper/useCopperCreation';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { bnum } from '@/lib/utils';

/**
 * TYPES
 */
type Props = {
  pool: FullPoolCopper;
  lbpDetail: LBPDetail;
  lbpStatistics: LBPStatistics;
  loading: boolean;
  poolActivityType: PoolTransactionsTab;
};

/**
 * PROPS
 */
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  poolActivityType: PoolTransactionsTab.ALL_ACTIVITY
});
const emit = defineEmits<{
  (e: 'refetch'): void;
}>();

/**
 * COMPOSABLES
 */
// const route = useRoute();
const { exitPool, setSwapEnabled } = useCopperCreation();
const { fNum2 } = useNumbers();

/**
 * STATE
 */

// const id = route.params.id as string;
const isActive = ref(false);
const isBtnDisabled = ref(false);
const isWithdrawAll = ref(false);
/**
 * QUERIES
 */

/**
 * COMPUTED
 */

const mainAndBaseNeedSwap = computed(() => {
  return props.pool.main_token == props.lbpDetail.tokensList[0] ? 0 : 1;
});
const mainCurrentBalances = computed(() => {
  if (!props.pool || !props.lbpDetail) return '';
  return props.lbpDetail.tokens[mainAndBaseNeedSwap.value].balance || '';
});
const baseCurrentBalances = computed(() => {
  if (!props.pool || !props.lbpDetail) return '';
  return props.lbpDetail.tokens[1 - mainAndBaseNeedSwap.value].balance || '';
});
const startBalanceList = computed(() => {
  if (!props.pool || !props.lbpDetail) return null;
  return props.lbpStatistics.filter(item => item.type == 'Join')[0].amounts;
});
const baseStartBalances = computed(() => {
  if (!startBalanceList.value) return '';
  return startBalanceList.value[1 - mainAndBaseNeedSwap.value];
});
const baseTokenAccrued = computed(() => {
  if (!startBalanceList.value) return '';
  let accrued = bnum(baseCurrentBalances.value).minus(
    bnum(baseStartBalances.value)
  );
  return accrued.gt(0) ? accrued : 0;
});
const platformAccessFee = computed(() => {
  if (!startBalanceList.value) return '';
  return bnum(baseTokenAccrued.value).times(0.02);
});
const afterPlatformBase = computed(() => {
  if (!startBalanceList.value) return '';
  return bnum(baseCurrentBalances.value).minus(bnum(platformAccessFee.value));
});
const ShowWithDrawAll = computed(() => {
  if (!mainCurrentBalances.value || !baseCurrentBalances.value) return false;
  if (
    bnum(mainCurrentBalances.value).gt(1e-12) ||
    bnum(baseCurrentBalances.value).gt(1e-12)
  )
    return true;
  return false;
});
onMounted(() => {
  isActive.value = props.lbpDetail.swapEnabled;
});
/**
 * METHODS
 */
// function loadMorePoolSwaps() {
//   poolSwapsQuery.fetchNextPage.value();
// }
function swapChange(b) {
  console.log(b);
  isBtnDisabled.value = true;
  setSwapEnabled(
    props.pool.pool_address,
    !isActive.value,
    () => {
      isActive.value = !isActive.value;
      isBtnDisabled.value = false;
      emit('refetch');
    },
    () => {
      isBtnDisabled.value = false;
      emit('refetch');
    }
  );
}
function withDrawAll() {
  isWithdrawAll.value = true;
  exitPool(props.pool.pool_address, () => {
    isWithdrawAll.value = false;
  });
}
</script>

<template>
  <div class="grid grid-cols-1 gap-y-8 ">
    <div class="col-span-1 ">
      <div class="mb-6">
        <div class="font-bold text-lg mb-2">Swapping</div>
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <BalCard noBorder darkBgColor="700">
                <div class="flex items-center ">
                  <div class="text-sm font-bold text-gray-400 mr-4">
                    Swapping is
                    {{ lbpDetail.swapEnabled ? 'Active' : 'Inactive' }}
                  </div>
                  <BalToggle
                    :checked="isActive"
                    @toggle="swapChange"
                    :disabled="isBtnDisabled"
                  />
                  <BalLoadingIcon
                    v-if="isBtnDisabled"
                    class="ml-2"
                    :size="'md'"
                    color="white"
                  />
                </div>
              </BalCard>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <div class="font-bold text-lg mb-2">LBP Balances</div>
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-2">
                Current Balances
              </div>
              <BalCard noBorder>
                <BalStack vertical spacing="base">
                  <div class="flex items-center">
                    {{ fNum2(mainCurrentBalances, FNumFormats.token) }}
                    <BalAsset
                      class="mx-2"
                      :address="pool.main_token"
                      :iconURI="pool.image_url"
                    />
                  </div>
                  <div class="flex items-center">
                    {{ fNum2(baseCurrentBalances, FNumFormats.token) }}
                    <BalAsset class="mx-2" :address="pool.base_token" /></div
                ></BalStack>
              </BalCard>
            </div>
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-2">
                Base Tokens Accrued
              </div>
              <BalCard noBorder>
                <BalStack vertical spacing="base">
                  <div class="flex items-center">
                    {{fNum2(baseTokenAccrued as string, FNumFormats.token ) }}
                    <BalAsset class="mx-2" :address="pool.base_token" /></div
                ></BalStack>
              </BalCard>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <div class="mb-6">
          <div class="text-sm font-bold text-gray-400 flex items-center  mb-2">
            <div>2% Platform Access Fee Approximation</div>
            <BalTooltip>
              <template v-slot:activator>
                <div class="ml-1">
                  <BalIcon name="info" size="sm" />
                </div>
              </template>
              <div>
                Exact platform access fee will be calculated in real time upon
                withdrawal execution using the base tokens accrued.
              </div>
            </BalTooltip>
          </div>
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <BalCard noBorder>
                <BalStack vertical spacing="base">
                  <div class="flex items-center">
                    {{ fNum2(platformAccessFee as string, FNumFormats.token) }}
                    <BalAsset class="mx-2" :address="pool.base_token" /></div
                ></BalStack>
              </BalCard>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4 ">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-4">
                Balances After Platform Access Fee
              </div>
              <div>
                <BalCard>
                  <BalStack
                    horizontal
                    spacing="base"
                    align="center"
                    justify="between"
                  >
                    <BalStack vertical spacing="base">
                      <div class="flex items-center">
                        {{ fNum2(mainCurrentBalances, FNumFormats.token) }}
                        <BalAsset
                          class="mx-2"
                          :address="pool.main_token"
                          :iconURI="pool.image_url"
                        />
                      </div>
                      <div class="flex items-center">
                        {{ fNum2(afterPlatformBase as string, FNumFormats.token) }}
                        <BalAsset class="mx-2" :address="pool.base_token" />
                      </div>
                    </BalStack>
                    <BalBtn
                      v-if="ShowWithDrawAll"
                      @click="withDrawAll"
                      label="Withdraw All"
                      size="sm"
                      :loading="isWithdrawAll"
                      :loading-label="'transaction'"
                    />
                  </BalStack>
                </BalCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-1 md:col-span-1"></div>
  </div>
</template>
