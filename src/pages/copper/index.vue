<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import CoppersTable from '@/components/tables/CoppersTable/CoppersTable.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useAlerts, { AlertPriority, AlertType } from '@/composables/useAlerts';
import useBreakpoints from '@/composables/useBreakpoints';
import useCopperPools from '@/composables/copper/useCopperPools';

// COMPOSABLES
const router = useRouter();
const { t } = useI18n();
const { selectedTokens } = usePoolFilters();

const {
  pools,
  isLoadingPools,
  loadMorePools,
  poolsHasNextPage,
  poolsIsFetchingNextPage,
  poolsQuery
} = useCopperPools(selectedTokens);
const { addAlert, removeAlert } = useAlerts();
const { upToMediumBreakpoint } = useBreakpoints();

watch(poolsQuery.error, () => {
  if (poolsQuery.error.value) {
    addAlert({
      id: 'pools-fetch-error',
      label: t('alerts.pools-fetch-error'),
      type: AlertType.ERROR,
      persistent: true,
      action: poolsQuery.refetch.value,
      actionLabel: t('alerts.retry-label'),
      priority: AlertPriority.MEDIUM
    });
  } else {
    removeAlert('pools-fetch-error');
  }
});

/**
 * METHODS
 */

function navigateToCreateLaunchpad() {
  router.push({ name: 'create-launchpad' });
}
</script>

<template>
  <div class="lg:container lg:mx-auto pt-10 md:pt-12">
    <BalStack vertical>
      <div class="px-4 lg:px-0">
        <h3 class="mb-3">Liquidity Bootstrapping Pools</h3>
        <div
          class="flex flex-col md:flex-row w-full justify-end items-end lg:items-center"
        >
          <BalBtn
            @click="navigateToCreateLaunchpad"
            color="cyan"
            outline
            size="sm"
            :class="{ 'mt-4': upToMediumBreakpoint }"
            :block="upToMediumBreakpoint"
          >
            {{ 'Create A Launchpad' }}
            <BalIcon name="chevron-right" size="sm" class="ml-1 text-cyan" />
          </BalBtn>
        </div>
      </div>
      <CoppersTable
        :isLoading="isLoadingPools"
        :data="pools"
        :noPoolsLabel="$t('noPoolsFound')"
        :isPaginated="poolsHasNextPage"
        :isLoadingMore="poolsIsFetchingNextPage"
        @loadMore="loadMorePools"
        :selectedTokens="selectedTokens"
        class="mb-8"
        :hiddenColumns="[]"
      />
    </BalStack>
  </div>
</template>
