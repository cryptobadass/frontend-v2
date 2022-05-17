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
      <div class="relative col-span-3 order-2 px-1">
        <AnimatePresence
          :isVisible="hasRestoredFromSavedState && !appLoading"
          unmountInstantly
        >
          <BalAlert
            type="warning"
            class="mb-4"
            :title="$t('createAPool.recoveredState')"
          >
            {{ $t('createAPool.recoveredStateInfo') }}
            <button @click="handleReset" class="font-semibold text-blue-500">
              {{ $t('clickHere') }}
            </button>
          </BalAlert>
        </AnimatePresence>
        <AnimatePresence
          :isVisible="activeStep === 0"
          :initial="initialAnimateProps"
          :animate="entryAnimateProps"
          :exit="exitAnimateProps"
        >
          <AddTokenInformation @update:height="setWrapperHeight" />
        </AnimatePresence>
        <AnimatePresence
          :isVisible="activeStep === 1"
          :initial="initialAnimateProps"
          :animate="entryAnimateProps"
          :exit="exitAnimateProps"
        >
          <ConfigureSetting @update:height="setWrapperHeight" />
        </AnimatePresence>
        <AnimatePresence
          :isVisible="activeStep === 2"
          :initial="initialAnimateProps"
          :animate="entryAnimateProps"
          :exit="exitAnimateProps"
        >
          <CompleteDetail @update:height="setWrapperHeight" />
        </AnimatePresence>
        <AnimatePresence
          :isVisible="activeStep === 3"
          :initial="initialAnimateProps"
          :animate="entryAnimateProps"
          :exit="exitAnimateProps"
        >
          <ReviewSummary @update:height="setWrapperHeight" />
        </AnimatePresence>
        <AnimatePresence
          :isVisible="activeStep === 4"
          :initial="initialAnimateProps"
          :animate="entryAnimateProps"
          :exit="exitAnimateProps"
        >
          <CreateLBP @update:height="setWrapperHeight" />
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
const isRestoring = ref(false);

/**
 * COMPOSABLES
 */
const { appLoading } = useApp();
const {
  activeStep,
  resetPoolCreationState,
  setActiveStep,
  hasRestoredFromSavedState,
  importState,
  seedTokens,
  baseTokenOptions,
  setRestoredState
} = useCopperCreation();
const { removeAlert } = useAlerts();
const {
  dynamicDataLoading,
  priceFor,
  tokens,
  injectTokens,
  injectedPrices,
  loading: isLoadingTokens
} = useTokens();
/**
 * LIFECYCLE
 */
onBeforeMount(async () => {
  injectUnknownPoolTokens();
  removeAlert('return-to-copper-creation');

  let previouslySavedState = lsGet(
    COPPER_CREATION_STATE_KEY,
    null,
    COPPER_CREATION_STATE_VERSION
  );
  if (activeStep.value === 0 && previouslySavedState !== null) {
    isRestoring.value = true;
    previouslySavedState = JSON.parse(previouslySavedState);
    importState(previouslySavedState);
    setRestoredState(true);
    await nextTick();
    setActiveStep(previouslySavedState.activeStep);
  }
  isRestoring.value = false;
});

/**
 * COMPUTED
 */

const steps = computed(() => [
  {
    tooltip: 'Add Token Information',
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
  // {
  //   tooltip: 'Terms of Use',
  //   state: getStepState(4),
  //   label: 5
  // },
  {
    tooltip: 'Create LBP',
    state: getStepState(4),
    label: 5
  }
]);
const initialAnimateProps = computed(() => ({
  opacity: 0,
  translateY: '100px',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0
}));

const entryAnimateProps = computed(() => ({
  opacity: 1,
  translateY: hasRestoredFromSavedState.value ? '116px' : '0px',
  position: 'relative'
}));

const exitAnimateProps = computed(() => ({
  opacity: 0,
  translateY: '-100px',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0
}));

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
function handleReset() {
  resetPoolCreationState();
  setActiveStep(0);
}
function setWrapperHeight(dimensions?: { width: number; height: number }) {
  // need to transform the accordion as everything is absolutely
  // positioned inside the AnimateHeight component
  // if (dimensions?.height) prevWrapperHeight.value = dimensions.height;
  // let mobileOffset = 20;
  // anime({
  //   targets: accordionWrapper.value,
  //   translateY: `${prevWrapperHeight.value + mobileOffset}px`,
  //   easing: 'spring(0.4, 500, 9, 0)',
  //   complete: () => {
  //     if (!hasCompletedMountAnimation.value) {
  //       anime({
  //         targets: accordionWrapper.value,
  //         opacity: 1,
  //         complete: () => {
  //           hasCompletedMountAnimation.value = true;
  //         }
  //       });
  //     }
  //   }
  // });
}
function handleNavigate(stepIndex: number) {
  if (hasRestoredFromSavedState.value) {
    setRestoredState(false);
  }
  setActiveStep(stepIndex);
}

function injectUnknownPoolTokens() {
  // console.log('aaaaaaaaaisLoadingTokens', !isLoadingTokens.value);
  if (!isLoadingTokens.value) {
    const uninjectedTokens = seedTokens.value
      .filter(seedToken => tokens.value[seedToken.tokenAddress] === undefined)
      .map(seedToken => seedToken.tokenAddress)
      .filter(token => token !== '');
    const uninjectedTokensOptions = baseTokenOptions.value
      .filter(token => tokens.value[token] === undefined)
      .filter(token => token !== '');
      // console.log('aaaaa---injectTokens:',[...uninjectedTokens, ...uninjectedTokensOptions])
    injectTokens([...uninjectedTokens, ...uninjectedTokensOptions]);
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
