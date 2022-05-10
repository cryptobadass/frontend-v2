<template>
  <div ref="cardWrapper" class="mb-16">
    <BalCard shadow="none">
      <BalStack vertical spacing="base">
        <BalStack vertical spacing="sm">
          <BalStack horizontal spacing="xs" align="center">
            <button
              @click="goBack"
              class="text-cyan-500 hover:text-cyan-700 flex"
            >
              <BalIcon class="flex" name="chevron-left" />
            </button>
            <h5 class="font-bold dark:text-white ">
              LBP Configuration
            </h5>
          </BalStack>
          <div class="h-px bg-gunmetal dark:border-gray-600"></div>
        </BalStack>
        <BalCard shadow="none" noBorder noPad class="bg-dark-3">
          <!-- <div
            class="grid grid-cols-1 xl:grid-cols-3 gap-y-8 gap-x-0 xl:gap-x-8"
          ></div> -->
          <div class=" mb-3">
            <div class="font-bold mb-2">Deposit Quantities</div>
            <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 mb-4">
              <div class="col-span-1">
                <div class="flex justify-between mb-2">
                  <div>Main Token <span class="text-red-500">*</span></div>
                  <!-- <div class="text-gray-400">Balance: 999999.99</div> -->
                </div>
                <div>
                  <TokenInput
                    v-model:amount="seedTokens[0].amount"
                    v-model:address="seedTokens[0].tokenAddress"
                    fixedToken
                    :name="`initial-token-${seedTokens[0].tokenAddress}`"
                    :rules="[isGreaterThan(0)]"
                  />
                </div>
              </div>
              <div class="col-span-1">
                <div class="flex justify-between mb-2">
                  <div>Base token <span class="text-red-500">*</span></div>
                </div>
                <div>
                  <TokenInput
                    v-model:amount="seedTokens[1].amount"
                    v-model:address="seedTokens[1].tokenAddress"
                    fixedToken
                    :name="`initial-token-${seedTokens[1].tokenAddress}`"
                    :options="baseTokenOptions"
                    :rules="[isGreaterThan(0)]"
                  />
                </div>
              </div>
            </div>
            <div class="font-bold mb-2">ChooseWeights</div>
            <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 mb-4">
              <div class="col-span-1">
                <div class="flex justify-between mb-2">
                  <div>Start Weights</div>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <div
                    class="flex items-center px-2 h-10 bg-gray-50 dark:bg-gray-850 rounded-lg"
                  >
                    <BalAsset :address="mainTokenInfo.address" />
                    <span class="ml-2">{{ mainTokenInfo.symbol || '' }}</span>
                  </div>
                  <div
                    class="flex items-center px-2 h-10 bg-gray-50 dark:bg-gray-850 rounded-lg"
                  >
                    <BalAsset :address="baseTokenInfo.address" />
                    <span class="ml-2">{{ baseTokenInfo.symbol || '' }}</span>
                  </div>
                </div>
                <div>
                  <div class="p-2">
                    <BalRangeInput
                      :max="99"
                      :min="1"
                      v-model="seedTokens[0].startWeight"
                    >
                      <template v-slot:leftLabel
                        >{{ seedTokens[0].startWeight }}%</template
                      >
                      <template v-slot:rightLabel
                        >{{ seedTokens[1].startWeight }}%</template
                      >
                    </BalRangeInput>
                  </div>
                </div>
              </div>
              <div class="col-span-1">
                <div class="flex justify-between mb-2">
                  <div>End Weights</div>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <div
                    class="flex items-center px-2 h-10 bg-gray-50 dark:bg-gray-850 rounded-lg"
                  >
                    <BalAsset :address="mainTokenInfo.address" />
                    <span class="ml-2">{{ mainTokenInfo.symbol || '' }}</span>
                  </div>
                  <div
                    class="flex items-center px-2 h-10 bg-gray-50 dark:bg-gray-850 rounded-lg"
                  >
                    <BalAsset :address="baseTokenInfo.address" />
                    <span class="ml-2">{{ baseTokenInfo.symbol || '' }}</span>
                  </div>
                </div>
                <div>
                  <div class="p-2">
                    <BalRangeInput
                      v-model="seedTokens[0].endWeight"
                      :max="99"
                      :min="1"
                      ><template v-slot:leftLabel
                        >{{ seedTokens[0].endWeight }}%</template
                      >
                      <template v-slot:rightLabel
                        >{{ seedTokens[1].endWeight }}%</template
                      ></BalRangeInput
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class=" font-bold mb-3">
            <div class="font-bold mb-2">Duration</div>
            <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 mb-4">
              <div class="col-span-1">
                <div class="mb-2">Start Date & End Date</div>
                <el-date-picker
                  v-model="time"
                  type="datetimerange"
                  range-separator="To"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  format="YYYY-MM-DD HH:mm"
                  :disabledDate="disabledTime"
                />
                <div class="error">{{ timeError }}</div>
              </div>
            </div>
          </div>
        </BalCard>
      </BalStack>
      <div class="mt-4">
        <BalBtn :disabled="disabledBtn" @click="continueClick"
          >Continue to LBP details</BalBtn
        >
      </div>
    </BalCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, onBeforeUpdate, watch } from 'vue';

import TokenWeightInput from '@/components/inputs/TokenInput/TokenWeightInput.vue';
import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useBreakpoints from '@/composables/useBreakpoints';
import usePoolCreation, {
  PoolSeedToken
} from '@/composables/pools/usePoolCreation';
import useTokens from '@/composables/useTokens';

import { configService } from '@/services/config/config.service';

import { sum, sumBy, uniqueId } from 'lodash';
import anime from 'animejs';
import { bnum } from '@/lib/utils';
import AnimatePresence from '@/components/animate/AnimatePresence.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { useI18n } from 'vue-i18n';
import useDarkMode from '@/composables/useDarkMode';
import useTailwind from '@/composables/useTailwind';
import useCopperCreation from '@/composables/copper/useCopperCreation';
// import BalSlider from '@/components/_global/BalSlider/BalSlider.vue';
import BalToggle from '@/components/_global/BalToggle/BalToggle.vue';
import BalRangeDate from '@/components/_global/BalRangeDate/BalRangeDate.vue';
import TokenSelectInput from '@/components/inputs/TokenSelectInput/TokenSelectInput.vue';
import { isGreaterThan } from '@/lib/utils/validations';
import { oneDayInMs, oneMinInMs } from '@/composables/useTime';
const tailwind = useTailwind();

const emit = defineEmits(['update:height', 'trigger:alert']);

/**
 * COMPOSABLES
 */
const {
  // updateTokenWeights,
  proceed,
  goBack,
  time,
  seedTokens,
  mainTokenInfo,
  baseTokenInfo,
  baseTokenOptions
} = useCopperCreation();
// const { upToLargeBreakpoint } = useBreakpoints();
// const { fNum2 } = useNumbers();
// const { nativeAsset, tokens } = useTokens();
// const { isWalletReady, toggleWalletSelectModal } = useWeb3();
// const { t } = useI18n();
// const { darkMode } = useDarkMode();
const {
  balanceFor,
  priceFor,
  nativeAsset,
  wrappedNativeAsset,
  getToken
} = useTokens();

/**
 * STATE
 */
const networkName = configService.network.name;
// const chartColors = computed(() => {
//   let color = tailwind.theme.colors.green['400'];
//   // if (isNegativeTrend.value) color = tailwind.theme.colors.red['400'];
//   return [color];
// });

const timeError = ref('');

/**
 * COMPUTED
 */

const mainStartWeight = computed(() => {
  return seedTokens.value[0].startWeight;
});
const mainEndWeight = computed(() => {
  return seedTokens.value[0].endWeight;
});
const hasZeroAmount = computed(() => {
  return seedTokens.value.some(
    seedToken => bnum(seedToken.amount).eq(0) || seedToken.amount === ''
  );
});
const disabledBtn = computed(() => {
  return hasZeroAmount.value || !!timeError.value;
});

/**
 * WATCHERS
 */

watch(
  mainStartWeight,
  () => {
    seedTokens.value[1].startWeight = 100 - mainStartWeight.value;
    if (mainStartWeight.value <= mainEndWeight.value) {
      seedTokens.value[0].endWeight = mainStartWeight.value;
    }
  },
  { deep: true }
);
watch(mainEndWeight, () => {
  seedTokens.value[1].endWeight = 100 - mainEndWeight.value;
  if (mainEndWeight.value > mainStartWeight.value) {
    seedTokens.value[0].startWeight = mainEndWeight.value;
  }
});
watch(
  time,
  () => {
    checkTime();
  },
  { deep: true }
);

/**
 * LIFECYCLE
 */
// onMounted(async () => {
//   // wait for vue to reflect the changes of above
//   await nextTick();
// });

// onBeforeUpdate(() => {
//   seedTokenElements.value = [];
// });

/**
 * FUNCTIONS
 */
function checkTime() {
  console.log(time.value);
  if (!time.value) {
    timeError.value = 'Date is required';
    return false;
  }
  const [start] = time.value;
  if (start && start.getTime() < Date.now() + 10 * oneMinInMs) {
    timeError.value = 'Start time is at least 10 minutes late';
    return false;
  }
  timeError.value = '';
  return true;
}
function disabledTime(v) {
  // v.getTime  00:00:00
  return v.getTime() + oneDayInMs < Date.now();
}
function continueClick() {
  if (checkTime()) {
    proceed();
  }
}
</script>

<style scoped>
.error {
  @apply text-xs text-red-500 mt-1 ml-1;
}
</style>
