<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { flatten } from 'lodash';

import usePoolSwapsQuery from '@/composables/queries/usePoolSwapsQuery';
import useUserPoolSwapsQuery from '@/composables/queries/useUserPoolSwapsQuery';

import { FullPool } from '@/services/balancer/subgraph/types';

import { PoolTransactionsTab } from '../types';

/**
 * TYPES
 */
type Props = {
  pool: FullPool;
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

/**
 * STATE
 */

const id = route.params.id as string;
/**
 * QUERIES
 */

const poolSwapsQuery =
  props.poolActivityType === PoolTransactionsTab.ALL_ACTIVITY
    ? usePoolSwapsQuery(id)
    : useUserPoolSwapsQuery(id);

/**
 * COMPUTED
 */
const poolSwaps = computed(() =>
  poolSwapsQuery.data.value
    ? flatten(poolSwapsQuery.data.value.pages.map(page => page.poolSwaps))
    : []
);
const isLoadingPoolSwaps = computed(() => poolSwapsQuery.isLoading.value);
const poolSwapsHasNextPage = computed(() => poolSwapsQuery.hasNextPage?.value);
const poolSwapsIsFetchingNextPage = computed(
  () => poolSwapsQuery.isFetchingNextPage?.value
);

/**
 * METHODS
 */
function loadMorePoolSwaps() {
  poolSwapsQuery.fetchNextPage.value();
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
                  <BalToggle />
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
                    1,000.00<img
                      class="rounded-full inline-block ml-3 w-4 h-4"
                      :src="
                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                      "
                    />
                  </div>
                  <div class="flex items-center">
                    1,000.00<img
                      class="rounded-full inline-block ml-3 w-4 h-4"
                      :src="
                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                      "
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
                    1,000.00<img
                      class="rounded-full inline-block ml-3 w-4 h-4"
                      :src="
                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                      "
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
                    1,000.00<img
                      class="rounded-full inline-block ml-3 w-4 h-4"
                      :src="
                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                      "
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
                        1,000.00<img
                          class="rounded-full inline-block ml-3 w-4 h-4"
                          :src="
                            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                          "
                        />
                      </div>
                      <div class="flex items-center">
                        1,000.00<img
                          class="rounded-full inline-block ml-3 w-4 h-4"
                          :src="
                            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                          "
                        />
                      </div>
                    </BalStack>
                    <BalBtn label="Withdraw All" size="sm" />
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
