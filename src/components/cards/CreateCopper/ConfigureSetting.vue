<template>
  <div class="mb-16">
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
          <div class=" mb-3">
            <div class="font-bold mb-2">Deposit Quantities</div>
            <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 mb-4">
              <div class="col-span-1">
                <div class="flex justify-between mb-2">
                  <div>Main Token <span class="text-red-500">*</span></div>
                </div>
                <div>
                  <TokenInput
                    v-model:amount="seedTokens[0].amount"
                    v-model:address="seedTokens[0].tokenAddress"
                    fixedToken
                    :name="`initial-token-${seedTokens[0].tokenAddress}`"
                    :rules="[isGreaterThan(0)]"
                    :fixedImage="image"
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
                    :name="`initial-token-${seedTokens[1].tokenAddress}`"
                    :rules="[isGreaterThan(0)]"
                    :excludedTokens="excludedTokens"
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
                    class="flex items-center max-w-40 px-2 h-10 bg-gray-50 dark:bg-gray-850 rounded-lg"
                  >
                    <BalAsset
                      :address="mainTokenInfo?.address"
                      :iconURI="image"
                    />
                    <span class="ml-2 truncate">{{
                      mainTokenInfo?.symbol || ''
                    }}</span>
                  </div>
                  <div
                    class="flex items-center max-w-40 px-2 h-10 bg-gray-50 dark:bg-gray-850 rounded-lg"
                  >
                    <BalAsset :address="baseTokenInfo?.address" />
                    <span class="ml-2 truncate">{{
                      baseTokenInfo?.symbol || ''
                    }}</span>
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
                    class="flex max-w-40 items-center px-2 h-10 bg-gray-50 dark:bg-gray-850 rounded-lg"
                  >
                    <BalAsset
                      :address="mainTokenInfo?.address"
                      :iconURI="image"
                    />
                    <span class="ml-2 truncate">{{
                      mainTokenInfo?.symbol || ''
                    }}</span>
                  </div>
                  <div
                    class="flex max-w-40 items-center px-2 h-10 bg-gray-50 dark:bg-gray-850 rounded-lg"
                  >
                    <BalAsset :address="baseTokenInfo?.address" />
                    <span class="ml-2 truncate">{{
                      baseTokenInfo?.symbol || ''
                    }}</span>
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
                  readonly
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
import { computed, ref, watch } from 'vue';

import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';

import { bnum } from '@/lib/utils';
import useCopperCreation from '@/composables/copper/useCopperCreation';
import { isGreaterThan } from '@/lib/utils/validations';
import { oneDayInMs, oneMinInMs } from '@/composables/useTime';
import useTokens from '@/composables/useTokens';

/**
 * COMPOSABLES
 */
const {
  proceed,
  goBack,
  time,
  seedTokens,
  mainTokenInfo,
  baseTokenInfo,
  image
} = useCopperCreation();
const { balanceFor } = useTokens();

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
const isExceedingWalletBalance = computed(() => {
  const isExceeding = seedTokens.value.some((t, i) =>
    bnum(seedTokens.value[i].amount).gt(balanceFor(t.tokenAddress))
  );
  return isExceeding;
});
const disabledBtn = computed(() => {
  return (
    hasZeroAmount.value || !!timeError.value || isExceedingWalletBalance.value
  );
});
const excludedTokens = computed((): string[] => {
  return [seedTokens.value[0].tokenAddress];
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

/**
 * FUNCTIONS
 */
function checkTime() {
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
.max-w-40 {
  max-width: 40%;
}
</style>
