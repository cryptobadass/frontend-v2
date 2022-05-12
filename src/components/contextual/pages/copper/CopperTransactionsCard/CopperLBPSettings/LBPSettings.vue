<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { flatten } from 'lodash';

import usePoolSwapsQuery from '@/composables/queries/usePoolSwapsQuery';
import useUserPoolSwapsQuery from '@/composables/queries/useUserPoolSwapsQuery';

import { FullPool, FullPoolCopper } from '@/services/balancer/subgraph/types';

import { PoolTransactionsTab } from '../types';
import useCopperCreation from '@/composables/copper/useCopperCreation';
import { func } from 'prop-types';

/**
 * TYPES
 */
type Props = {
  pool: FullPoolCopper;
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
const { exitPool, setSwapEnabled } = useCopperCreation();

/**
 * STATE
 */

const id = route.params.id as string;
const isActive = ref(false);
/**
 * QUERIES
 */

// const poolSwapsQuery =
//   props.poolActivityType === PoolTransactionsTab.ALL_ACTIVITY
//     ? usePoolSwapsQuery(id)
//     : useUserPoolSwapsQuery(id);

/**
 * COMPUTED
 */
// const poolSwaps = computed(() =>
//   poolSwapsQuery.data.value
//     ? flatten(poolSwapsQuery.data.value.pages.map(page => page.poolSwaps))
//     : []
// );
// const isLoadingPoolSwaps = computed(() => poolSwapsQuery.isLoading.value);
// const poolSwapsHasNextPage = computed(() => poolSwapsQuery.hasNextPage?.value);
// const poolSwapsIsFetchingNextPage = computed(
//   () => poolSwapsQuery.isFetchingNextPage?.value
// );

/**
 * METHODS
 */
// function loadMorePoolSwaps() {
//   poolSwapsQuery.fetchNextPage.value();
// }
function swapChange(b) {
  console.log(b);
  setSwapEnabled(props.pool.pool_address, !isActive.value);
  isActive.value = !isActive.value
  
}
function withDrawAll(){
  exitPool(props.pool.pool_address)
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
                    Swapping is active
                  </div>
                  <BalToggle :checked="isActive" @toggle="swapChange" />
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
                    1,000.00<BalAsset
                      class="mx-2"
                      :address="pool.main_token"
                      :iconURI="pool.image_url"
                    />
                  </div>
                  <div class="flex items-center">
                    1,000.00<BalAsset
                      class="mx-2"
                      :address="pool.base_token"
                    /></div
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
                    1,000.00<BalAsset
                      class="mx-2"
                      :address="pool.base_token"
                    /></div
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
                    1,000.00<BalAsset
                      class="mx-2"
                      :address="pool.base_token"
                    /></div
                ></BalStack>
              </BalCard>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4 ">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-4">
                Blocked countries
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
                        1,000.00<BalAsset
                          class="mx-2"
                          :address="pool.main_token"
                          :iconURI="pool.image_url"
                        />
                      </div>
                      <div class="flex items-center">
                        1,000.00<BalAsset
                          class="mx-2"
                          :address="pool.base_token"
                        />
                      </div>
                    </BalStack>
                    <BalBtn @click="withDrawAll" label="Withdraw All" size="sm" />
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
