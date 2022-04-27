<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { flatten } from 'lodash';

import usePoolActivitiesQuery from '@/composables/queries/usePoolActivitiesQuery';
import usePoolUserActivitiesQuery from '@/composables/queries/usePoolUserActivitiesQuery';

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

const account = ref('0xD3aac8967515aF9647506B6a5E0C9F9C44a38e08');
const copiedAddress = ref(false);
/**
 * QUERIES
 */

const poolActivitiesQuery =
  props.poolActivityType === PoolTransactionsTab.ALL_ACTIVITY
    ? usePoolActivitiesQuery(id)
    : usePoolUserActivitiesQuery(id);

/**
 * COMPUTED
 */
const poolActivities = computed(() =>
  poolActivitiesQuery.data.value
    ? flatten(
        poolActivitiesQuery.data.value.pages.map(page => page.poolActivities)
      )
    : []
);
const isLoadingPoolActivities = computed(
  () => poolActivitiesQuery.isLoading.value
);
const poolActivitiesHasNextPage = computed(
  () => poolActivitiesQuery.hasNextPage?.value
);
const poolActivitiesIsFetchingNextPage = computed(
  () => poolActivitiesQuery.isFetchingNextPage?.value
);

/**
 * METHODS
 */
function loadMorePoolActivities() {
  poolActivitiesQuery.fetchNextPage.value();
}
function copyAddress() {
  navigator.clipboard.writeText(account.value);
  copiedAddress.value = true;

  setTimeout(() => {
    copiedAddress.value = false;
  }, 2 * 1000);
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-1 gap-y-8 gap-x-0 xl:gap-x-8">
    <div class="col-span-3">
      <div class="mb-6">
        <img
          class="rounded-full inline-block ml-3 w-8 h-8"
          :src="
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
          "
        />
        <span class="ml-4 font-bold text-lg">lance</span>
        <BalBtn class="ml-4" label="$LC" size="xs" color="white"></BalBtn>
      </div>
    </div>
    <div class="col-span-1 md:col-span-2">
      <div class="mb-6">
        <div class="font-bold text-lg mb-2">Token Contract Address</div>
        <BalCard noBorder>
          <div class="address flex items-baseline">
            <div class="text-cyan" v-text="_shorten(account)" />
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
        <BalCard noBorder><div>this is a description</div> </BalCard>
      </div>

      <div class="mb-6">
        <div class="font-bold text-lg mb-2">LBP Details</div>
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 my-2">Status</div>
              <BalCard noBorder>
                <div>Active</div>
              </BalCard>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 my-2">Start Date</div>
              <BalCard noBorder>
                <div>2022年4月26日 GMT+8 06:30</div>
              </BalCard>
            </div>
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 my-2">End Date</div>
              <BalCard noBorder>
                <div>2022年4月30日 GMT+8 20:30</div>
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
              </BalCard>
              <div class="text-sm font-bold text-gray-400 my-2">
                Main Token Released
              </div>
              <BalCard noBorder>
                <div class="flex items-center">
                  1,000.00<img
                    class="rounded-full inline-block ml-3 w-4 h-4"
                    :src="
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                    "
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
                  </div> </BalStack
              ></BalCard>
              <div class="text-sm font-bold text-gray-400 my-2">
                Main Token Released
              </div>
              <BalCard noBorder>
                <div class="flex items-center">
                  1,000.00<img
                    class="rounded-full inline-block ml-3 w-4 h-4"
                    :src="
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                    "
                  />
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
                  82%<img
                    class="rounded-full inline-block mx-3 w-4 h-4"
                    :src="
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                    "
                  />
                  + 18%<img
                    class="rounded-full inline-block mx-3 w-4 h-4"
                    :src="
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                    "
                  />
                </div>
              </BalCard>
            </div>
            <div class="col-span-1">
              <div class="text-sm font-bold text-gray-400 mb-2">
                End Weights
              </div>
              <BalCard noBorder
                ><div class="flex items-center">
                  82%<img
                    class="rounded-full inline-block mx-3 w-4 h-4"
                    :src="
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                    "
                  />
                  + 18%<img
                    class="rounded-full inline-block mx-3 w-4 h-4"
                    :src="
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                    "
                  />
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
              <BalCard noBorder> <div>2.50%</div></BalCard>
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
