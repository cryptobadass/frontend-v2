<template>
  <div class="lg:container lg:mx-auto pt-8">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-y-8 gap-x-0 lg:gap-x-8">
      <div class="col-span-1 order-1">
        <BalStack vertical v-if="!appLoading">
          <BalVerticalSteps
            title="Create LBP steps"
            :steps="steps"
            @navigate="handleNavigate"
          />
        </BalStack>
      </div>
      <div class="col-span-3 order-2 px-1">
        <AnimatePresence :isVisible="activeStep === 0">
          <AddTokenInformation />
        </AnimatePresence>
        <AnimatePresence :isVisible="activeStep === 1">
          <ConfigureSetting />
        </AnimatePresence>
        <AnimatePresence :isVisible="activeStep === 2">
          <CompleteDetail />
        </AnimatePresence>
        <AnimatePresence :isVisible="activeStep === 3">
          <ReviewSummary />
        </AnimatePresence>
        <AnimatePresence :isVisible="activeStep === 4">
          <TermsOfUse />
        </AnimatePresence>
        <AnimatePresence :isVisible="activeStep === 5">
          <CreateLBP />
        </AnimatePresence>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

import ChooseWeights from '@/components/cards/CreatePool/ChooseWeights.vue';
import PoolSummary from '@/components/cards/CreatePool/PoolSummary.vue';
import PoolFees from '@/components/cards/CreatePool/PoolFees.vue';
import SimilarPools from '@/components/cards/CreatePool/SimilarPools.vue';
import InitialLiquidity from '@/components/cards/CreatePool/InitialLiquidity.vue';
import SimilarPoolsCompact from '@/components/cards/CreatePool/SimilarPoolsCompact.vue';
import PreviewPool from '@/components/cards/CreatePool/PreviewPool.vue';
import BalVerticalSteps from '@/components/_global/BalVerticalSteps/BalVerticalSteps.vue';
import AnimatePresence from '@/components/animate/AnimatePresence.vue';
import Col3Layout from '@/components/layouts/Col3Layout.vue';
import UnknownTokenPriceModal from '@/components/modals/UnknownTokenPrice/UnknownTokenPriceModal.vue';
import TokenPrices from '@/components/cards/CreatePool/TokenPrices.vue';

import AddTokenInformation from '@/components/cards/CreateCopper/AddTokenInformation.vue';
import ConfigureSetting from '@/components/cards/CreateCopper/ConfigureSetting.vue';
import CompleteDetail from '@/components/cards/CreateCopper/CompleteDetails.vue';
import ReviewSummary from '@/components/cards/CreateCopper/ReviewSummary.vue';
import TermsOfUse from '@/components/cards/CreateCopper/TermsOfUse.vue';
import CreateLBP from '@/components/cards/CreateCopper/CreateLBP.vue';

import anime from 'animejs';

import useApp from '@/composables/useApp';
import useCopperCreation, {
  COPPER_CREATION_STATE_KEY,
  COPPER_CREATION_STATE_VERSION
} from '@/composables/copper/useCopperCreation';
import { StepState } from '@/types';
import useBreakpoints from '@/composables/useBreakpoints';
import useAlerts from '@/composables/useAlerts';
import { lsGet } from '@/lib/utils';
import useTokens from '@/composables/useTokens';

/**
 * STATE
 */

/**
 * COMPOSABLES
 */
const { appLoading } = useApp();
const { activeStep } = useCopperCreation();
const { removeAlert } = useAlerts();

/**
 * LIFECYCLE
 */
onBeforeMount(async () => {
  removeAlert('return-to-copper-creation');

  // 
  // let previouslySavedState = lsGet(
  //   COPPER_CREATION_STATE_KEY,
  //   null,
  //   COPPER_CREATION_STATE_VERSION
  // )
  // if(activeStep.value === 0 && previouslySavedState !== null){
  //   isResto
  // }
});

/**
 * COMPUTED
 */

const steps = computed(() => [
  {
    tooltip: 'Select token',
    state: getStepState(0),
    label: 1
  },
  {
    tooltip: 'Configure settings',
    state: getStepState(1),
    label: 2
  },
  {
    tooltip: 'Complete details',
    state: getStepState(2),
    label: 3
  },
  {
    tooltip: 'Review summary',
    state: getStepState(3),
    label: 4
  },
  {
    tooltip: 'Terms of Use',
    state: getStepState(4),
    label: 5
  },
  {
    tooltip: 'Create LBP',
    state: getStepState(5),
    label: 6
  }
]);

/**
 * FUNCTIONS
 */
function getStepState(idx: number) {
  if (activeStep.value === idx) {
    return StepState.Active;
  } else {
    if (activeStep.value > idx) {
      return StepState.Completed;
    } else {
      return StepState.Todo;
    }
  }
}
/**
 * WATCHERS
 */
</script>

<style scoped>
.center-col-mh {
  min-height: 550px;
}
</style>
