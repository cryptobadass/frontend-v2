<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { flatten } from 'lodash';

import usePoolActivitiesQuery from '@/composables/queries/usePoolActivitiesQuery';
import usePoolUserActivitiesQuery from '@/composables/queries/usePoolUserActivitiesQuery';

import {
  FullPool,
  FullPoolCopper,
  LBPDetail
} from '@/services/balancer/subgraph/types';

import { PoolTransactionsTab } from '../types';
import useTokens from '@/composables/useTokens';
import BalAsset from '@/components/_global/BalAsset/BalAsset.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { formatUnits } from '@ethersproject/units';

/**
 * TYPES
 */
type Props = {
  pool: FullPoolCopper;
  lbpDetail: LBPDetail;
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

/**
 * COMPOSABLES
 */
const route = useRoute();
const { fNum2 } = useNumbers();
const {
  balanceFor,
  priceFor,
  getToken,
  nativeAsset,
  wrappedNativeAsset,
  injectedTokens
} = useTokens();

/**
 * STATE
 */

// const id = route.params.id as string;

// const account = ref('0xD3aac8967515aF9647506B6a5E0C9F9C44a38e08');
const copiedAddress = ref(false);
/**
 * QUERIES
 */

// const poolActivitiesQuery =
//   props.poolActivityType === PoolTransactionsTab.ALL_ACTIVITY
//     ? usePoolActivitiesQuery(id)
//     : usePoolUserActivitiesQuery(id);

/**
 * COMPUTED
 */
// const poolActivities = computed(() =>
//   poolActivitiesQuery.data.value
//     ? flatten(
//         poolActivitiesQuery.data.value.pages.map(page => page.poolActivities)
//       )
//     : []
// );
// const isLoadingPoolActivities = computed(
//   () => poolActivitiesQuery.isLoading.value
// );
// const poolActivitiesHasNextPage = computed(
//   () => poolActivitiesQuery.hasNextPage?.value
// );
// const poolActivitiesIsFetchingNextPage = computed(
//   () => poolActivitiesQuery.isFetchingNextPage?.value
// );
const account = computed(() => props.pool?.pool_address);
const mainTokenInfo = computed(() => {
  if (!props.pool) return null;
  return getToken(props.pool.main_token);
});
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
const mainStartWeights = computed(() => {
  if (!props.pool || !props.lbpDetail) return 0;
  return formatUnits(
    props.lbpDetail.weightUpdates[0].startWeights[mainAndBaseNeedSwap.value]
  );
});
const baseStartWeights = computed(() => {
  if (!props.pool || !props.lbpDetail) return 0;
  return formatUnits(
    props.lbpDetail.weightUpdates[0].startWeights[1 - mainAndBaseNeedSwap.value]
  );
});
const mainEndWeights = computed(() => {
  if (!props.pool || !props.lbpDetail) return 0;
  return formatUnits(
    props.lbpDetail.weightUpdates[0].endWeights[mainAndBaseNeedSwap.value]
  );
});
const baseEndWeights = computed(() => {
  if (!props.pool || !props.lbpDetail) return 0;
  return formatUnits(
    props.lbpDetail.weightUpdates[0].endWeights[1 - mainAndBaseNeedSwap.value]
  );
});
/**
 * METHODS
 */
// function loadMorePoolActivities() {
//   poolActivitiesQuery.fetchNextPage.value();
// }
function copyAddress() {
  navigator.clipboard.writeText(account.value);
  copiedAddress.value = true;

  setTimeout(() => {
    copiedAddress.value = false;
  }, 2 * 1000);
}
</script>

<template>
  <BalLoadingBlock v-if="loading" class="h-screen" />
  <div
    v-else
    class="grid grid-cols-1 md:grid-cols-1 gap-y-8 gap-x-0 xl:gap-x-8"
  >
    <div class="col-span-3">
      <div class="mb-6 flex items-center">
        <div class="inline-block">
          <BalAsset
            :address="pool?.pool_address"
            :iconURI="pool.image_url"
          ></BalAsset>
        </div>

        <span class="ml-4 font-bold text-lg">{{ mainTokenInfo?.name }}</span>
        <BalBtn
          v-if="mainTokenInfo?.symbol"
          class="ml-4"
          :label="mainTokenInfo?.symbol"
          size="xs"
          color="white"
        ></BalBtn>
      </div>
    </div>
    <div class="col-span-1 md:col-span-2">
      <div class="mb-6">
        <div class="font-bold text-lg mb-2">Token Contract Address</div>
        <BalCard noBorder>
          <div class="address flex items-baseline">
            <div class="text-cyan" v-text="account" />
            <div class="ml-3 flex">
              <BalTooltip width="auto">
                <template v-slot:activator>
                  <BalBtn
                    circle
                    color="gray"
                    size="xs"
                    flat
                    @click="copyAddress"
                    class="mr-2"
                  >
                    <BalIcon v-if="copiedAddress" name="check" size="xs" />
                    <BalIcon v-else name="clipboard" size="xs" />
                  </BalBtn>
                </template>
                <div
                  v-text="copiedAddress ? $t('copied') : $t('copyAddress')"
                  class="text-center"
                />
              </BalTooltip>
            </div>
          </div>
        </BalCard>
      </div>
      <div class="mb-6">
        <div class="font-bold text-lg mb-2">LBP Description</div>
        <BalCard noBorder
          ><div>{{ pool?.description }}</div>
        </BalCard>
        <BalLink
          v-if="pool?.learn_more_url"
          :href="pool?.learn_more_url"
          external
          noStyle
          class="group flex items-center mt-2"
        >
          More Info
          <BalIcon
            name="arrow-up-right"
            size="sm"
            class="ml-px group-hover:text-cyan-500 transition-colors"
          />
        </BalLink>
      </div>

      <div class="mb-6">
        <div class="font-bold text-lg mb-2">LBP Details</div>
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 my-2">Status</div>
              <BalCard noBorder>
                <div>{{ lbpDetail.swapEnabled ? 'Active' : 'Inactive' }}</div>
              </BalCard>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 my-2">Start Date</div>
              <BalCard noBorder>
                <div>{{ new Date(pool.start_time * 1000) }}</div>
              </BalCard>
            </div>
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 my-2">End Date</div>
              <BalCard noBorder>
                <div>{{ new Date(pool.end_time * 1000) }}</div>
              </BalCard>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <div class="font-bold text-lg mb-2">LBP Statistics</div>
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 my-2">
                Start Balances
              </div>
              <BalCard noBorder>
                <BalStack vertical spacing="base">
                  <div class="flex items-center">
                    1,000.00
                    <BalAsset
                      class="mx-2"
                      :address="pool.main_token"
                      :iconURI="pool.image_url"
                    />
                  </div>
                  <div class="flex items-center">
                    1,000.00
                    <BalAsset class="mx-2" :address="pool.base_token" />
                  </div>
                </BalStack>
              </BalCard>
              <div class="text-sm font-bold text-gray-400 my-2">
                Main Token Released
              </div>
              <BalCard noBorder>
                <div class="flex items-center">
                  1,000.00
                  <BalAsset
                    class="mx-2"
                    :address="pool.main_token"
                    :iconURI="pool.image_url"
                  />
                </div>
              </BalCard>
            </div>
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 my-2">
                Current Balances
              </div>
              <BalCard noBorder>
                <BalStack vertical spacing="base">
                  <div class="flex items-center">
                    {{ fNum2(mainCurrentBalances, FNumFormats.token)
                    }}<BalAsset
                      class="mx-2"
                      :address="pool.main_token"
                      :iconURI="pool.image_url"
                    ></BalAsset>
                  </div>
                  <div class="flex items-center">
                    {{ fNum2(baseCurrentBalances, FNumFormats.token) }}
                    <BalAsset
                      class="mx-2"
                      :address="pool.base_token"
                    ></BalAsset>
                  </div> </BalStack
              ></BalCard>
              <div class="text-sm font-bold text-gray-400 my-2">
                Base Token Released
              </div>
              <BalCard noBorder>
                <div class="flex items-center">
                  1,000.00
                  <BalAsset class="mx-2" :address="pool.base_token"></BalAsset>
                </div>
              </BalCard>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <div class="font-bold text-lg mb-2">LBP Settings</div>
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-2">
                Start Weights
              </div>
              <BalCard noBorder>
                <div class="flex items-center">
                  {{ fNum2(pool.start_weight || 0.99, FNumFormats.percent)
                  }}<BalAsset
                    class="mx-2"
                    :address="pool.main_token"
                    :iconURI="pool.image_url"
                  />
                  +
                  {{
                    fNum2(1 - (pool.start_weight || 0.99), FNumFormats.percent)
                  }}<BalAsset class="mx-2" :address="pool.base_token" />
                </div>
              </BalCard>
            </div>
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-2">
                End Weights
              </div>
              <BalCard noBorder
                ><div class="flex items-center">
                  {{ fNum2(pool.end_weight || 0.01, FNumFormats.percent)
                  }}<BalAsset
                    class="mx-2"
                    :address="pool.main_token"
                    :iconURI="pool.image_url"
                  />
                  +
                  {{
                    fNum2(1 - (pool.start_weight || 0.99), FNumFormats.percent)
                  }}<BalAsset class="mx-2" :address="pool.base_token" />
                </div>
              </BalCard>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <div class="text-sm font-bold text-gray-400 mb-2">
            Owner rights
          </div>
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <BalCard noBorder>
                <div class=" flex items-center justify-between">
                  <div>Pause swapping</div>
                  <BalTooltip>
                    <template v-slot:activator>
                      <div class="ml-1">
                        <BalIcon name="info" size="sm" />
                      </div>
                    </template>
                    <div>
                      Allows the LBP owner to stop the LBP early white retaining
                      the ability to restart it.
                    </div>
                  </BalTooltip>
                </div>
              </BalCard>
            </div>
            <div class="col-span-1">
              <BalCard noBorder>
                <div class=" flex items-center justify-between ">
                  <div>Pull liquidity</div>
                  <BalTooltip>
                    <template v-slot:activator>
                      <div class="ml-1">
                        <BalIcon name="info" size="sm" />
                      </div>
                    </template>
                    <div>
                      Allows the LBP owner withdraw liquidity at any point
                      during the LBP.
                    </div>
                  </BalTooltip>
                </div>
              </BalCard>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-2">
                Total Volume
              </div>
              <BalCard noBorder><div>$0.00</div></BalCard>
            </div>
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-2">
                Swap Fee (Collected by LC Project)
              </div>
              <BalCard noBorder>
                <div>
                  {{ fNum2(pool.swap_fee, FNumFormats.percent) }}
                </div></BalCard
              >
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div class="grid grid-cols-1 ">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-2">
                Blocked countries
              </div>
              <BalCard noBorder>
                <div>
                  To comply with local laws and regulations, LBP hosts may be
                  required to block access to the LBP depending on their local
                  jurisdiction.
                </div></BalCard
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-1 md:col-span-1"></div>
  </div>
</template>
