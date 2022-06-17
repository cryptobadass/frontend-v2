<template>
  <div class="lg:container lg:mx-auto pt-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-0 lg:gap-x-8">
      <div class="col-span-2">
        <BalLoadingBlock v-if="loadingPool" class="h-36" />
        <div v-else class="px-4 lg:px-0 flex flex-col">
          <CopperDetailHeader
            :pool="pool?.pools"
            :lbpDetail="pool?.lbpDetail"
            :lbpStatistics="pool?.lbpStatistics"
          />
        </div>
      </div>

      <div class="hidden lg:block" />

      <div class="col-span-2 order-2 lg:order-1">
        <div class="grid grid-cols-1 gap-y-8">
          <div class="px-1 lg:px-0"></div>

          <div>
            <CopperTransactionsCard
              :pool="pool?.pools"
              :lbpDetail="pool?.lbpDetail"
              :lbpStatistics="pool?.lbpStatistics"
              :loading="loadingPool"
              @refetch="refetch"
            />
          </div>
        </div>
      </div>

      <div class="order-1 lg:order-2 px-1 lg:px-0">
        <BalStack vertical>
          <BalLoadingBlock
            v-if="loadingPool"
            class="pool-actions-card h-80 mb-4"
          />
          <div v-else>
            <TradeCardGP
              v-if="pool?.lbpDetail.swapEnabled"
              :assetIn="pool?.pools.base_token"
              :assetOut="pool?.pools.main_token"
              lbp
              :fixedToken="pool?.pools.main_token"
            />
            <BalCard
              v-else
              class="relative card-container"
              shadow="lg"
              no-border
            >
              <template v-slot:header>
                <div class="text-center w-full text-xl font-bold">
                  Swapping is disabled upon LBP creation
                </div>
              </template>
              <div class="text-center text-gray-400 px-8 py-4">
                To enable swapping once the price decay is about to start please
                visit the "LBP Settings" tab
              </div>
            </BalCard>
          </div>
        </BalStack>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue';
import * as CopperPageComponents from '@/components/contextual/pages/copper';

import { useRoute } from 'vue-router';
import useCopperPoolQuery from '@/composables/queries/useCopperPoolQuery';
import { EXTERNAL_LINKS } from '@/constants/links';
import useApp from '@/composables/useApp';

import TradeCardGP from '@/components/cards/TradeCardGP/TradeCardGP.vue';
import BalCard from '@/components/_global/BalCard/BalCard.vue';

interface PoolPageData {
  id: string;
}

export default defineComponent({
  components: {
    ...CopperPageComponents,
    TradeCardGP,
    BalCard
  },

  setup() {
    /**
     * COMPOSABLES
     */
    const { appLoading } = useApp();
    const route = useRoute();

    /**
     * QUERIES
     */
    const poolQuery = useCopperPoolQuery(route.params.id as string);

    /**
     * STATE
     */
    const data = reactive<PoolPageData>({
      id: route.params.id as string
    });

    /**
     * COMPUTED
     */
    const pool = computed(() => poolQuery.data.value);

    const poolQueryLoading = computed(
      () => poolQuery.isLoading.value || poolQuery.error.value
    );

    const loadingPool = computed(() => poolQueryLoading.value || !pool.value);

    function refetch() {
      poolQuery.refetch.value();
    }

    return {
      ...toRefs(data),
      EXTERNAL_LINKS,

      appLoading,
      pool,

      loadingPool,

      refetch
    };
  }
});
</script>

<style scoped>
.pool-title {
  @apply mr-4 capitalize mt-2;
  font-variation-settings: 'wght' 700;
}

.pool-actions-card {
  @apply relative;
}

@media (min-width: 768px) and (min-height: 600px) {
  .pool-actions-card {
    @apply sticky top-24;
  }
}
</style>
