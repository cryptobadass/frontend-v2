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
                  <div>Main Token <span class="text-red-400">*</span></div>
                  <!-- <div class="text-gray-400">Balance: 999999.99</div> -->
                </div>
                <div>
                  <TokenInput
                    v-model:amount="seedTokens[0].amount"
                    v-model:address="seedTokens[0].tokenAddress"
                    fixedToken
                    :name="`initial-token-${seedTokens[0].tokenAddress}`"
                  />
                </div>
                <!-- <div class="flex items-center justify-between mb-2">
                  <div>
                    <img
                      class="inline-block"
                      width="20"
                      height="20"
                      src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                    />
                    <span class="ml-2">LC</span>
                  </div>
                  <BalBtn outline label="MAX" color="cyan" size="xs" />
                  <input
                    class="p-1 w-20 h-8 text-right font-bold bg-gray-800"
                    value="1000"
                  />
                </div>
                <div class="text-xs text-right">~$1,000.00</div> -->
              </div>
              <div class="col-span-1">
                <div class="flex justify-between mb-2">
                  <div>Base token<span class="text-red-400">*</span></div>
                  <!-- <div class="text-gray-400">Balance: 999999.99</div> -->
                </div>
                <div>
                  <TokenInput
                    v-model:amount="seedTokens[1].amount"
                    v-model:address="seedTokens[1].tokenAddress"
                    fixedToken
                    :name="`initial-token-${seedTokens[1].tokenAddress}`"
                    :options="baseTokenOptions"
                  />
                </div>
                <!-- <div class="flex items-center justify-between mb-2">
                  <div>
                    <img
                      class="inline-block"
                      width="20"
                      height="20"
                      src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                    />
                    <span class="ml-2">LC</span>
                  </div>
                  <BalBtn outline label="MAX" color="cyan" size="xs" />
                  <input
                    class="p-1 w-20 h-8 text-right font-bold bg-gray-800"
                    value="1000"
                  />
                </div>
                <div class="text-xs text-right">~$1,000.00</div> -->
              </div>
            </div>
            <div class="font-bold mb-2">ChooseWeights</div>
            <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 mb-4">
              <div class="col-span-1">
                <div class="flex justify-between mb-2">
                  <div>Start Weights</div>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <TokenSelectInput
                      v-model="seedTokens[0].tokenAddress"
                      fixed
                    />
                    <!-- <img
                      class="inline-block"
                      width="20"
                      height="20"
                      src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                    />
                    <span class="ml-2">LC</span> -->
                  </div>
                  <div>
                    <TokenSelectInput
                      v-model="seedTokens[1].tokenAddress"
                      fixed
                    />
                    <!-- <img
                      class="inline-block"
                      width="20"
                      height="20"
                      src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                    />
                    <span class="ml-2">USDC</span> -->
                  </div>
                </div>
                <div>
                  <!-- <BalProgressBar
                    :width="30"
                    :bufferWidth="0"
                    class="my-4"
                    size="2"
                  /> -->
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

                  <!-- <BalToggle /> -->
                  <!-- <div class="flex items-center justify-between mb-2">
                    <span>30%</span>
                    <span>70%</span>
                  </div> -->
                </div>
              </div>
              <div class="col-span-1">
                <div class="flex justify-between mb-2">
                  <div>End Weights</div>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <TokenSelectInput
                      v-model="seedTokens[0].tokenAddress"
                      fixed
                    />
                    <!-- <img
                      class="inline-block"
                      width="20"
                      height="20"
                      src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                    />
                    <span class="ml-2">LC</span> -->
                  </div>
                  <div>
                    <TokenSelectInput
                      v-model="seedTokens[1].tokenAddress"
                      fixed
                    />
                    <!-- <img
                      class="inline-block"
                      width="20"
                      height="20"
                      src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                    />
                    <span class="ml-2">USDC</span> -->
                  </div>
                </div>
                <div>
                  <!-- <BalProgressBar
                    :width="30"
                    :bufferWidth="0"
                    class="my-4"
                    size="2"
                  /> -->
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
                  <!-- <div class="flex items-center justify-between mb-2">
                    <span>30%</span>
                    <span>70%</span>
                  </div> -->
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
                />
              </div>
              <!-- <div class="col-span-1">
                <div>Start Date (UTC Time)</div>
                <BalRangeDate v-model="value1" />
              </div>
              <div class="col-span-1">
                <div>End Date (UTC Time)</div>
                <BalRangeDate v-model="value1" />
              </div> -->
            </div>
          </div>
          <!-- <div class="grid grid-cols-1 md:grid-cols-3 md:gap-x-6">
            <div class="col-span-2 font-bold">
              <div>Price Discovery Preview</div>
              <BalLineChart
                :data="series"
                :isPeriodSelectionEnabled="false"
                :color="chartColors"
                height="96"
                :showLegend="true"
                :legendState="{ HODL: false }"
                hide-y-axis
              />
            </div>
            <div class="col-span-1 font-bold">
              <BalCard>
                <BalStack vertical spacing="sm">
                  <div class="text-gray-400 text-sm">DURATION</div>
                  <div class="font-bold text-white text-lg">7 days</div>
                  <div class="text-gray-400 text-sm">IMPLIED MARKET CAP</div>
                  <div class="font-bold text-white text-lg">$NaNt - $NaNt</div>
                  <div class="text-gray-400 text-sm">PRICE RANGE</div>
                  <div class="font-bold text-white text-lg">
                    $Infinity - $Infinity
                  </div>
                </BalStack>
              </BalCard>
            </div>
          </div> -->
        </BalCard>
      </BalStack>
      <div class="mt-4">
        <BalBtn @click="proceed">Continue to LBP details</BalBtn>
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
const tailwind = useTailwind();

const emit = defineEmits(['update:height', 'trigger:alert']);

const emptyTokenWeight: PoolSeedToken = {
  tokenAddress: '',
  weight: 0,
  id: '0',
  isLocked: false,
  amount: '0'
};
// const mainTokenAddress = ref('');
// const baseTokenAddress = ref('');
const series = [
  {
    name: 'test',
    values: [1, 2, 3, 4, 54, 5, 6, 7, 7, 8, 84, 3, 23, 5, 6, 8, 6, 9, 5, 5, 6]
  }
];
function disabledDate(v) {
  console.log(v);
  return false;
}

/**
 * COMPOSABLES
 */
const {
  // updateTokenWeights,
  proceed,
  goBack,
  // acceptCustomTokenDisclaimer,
  // setTokensList,
  // seedTokens,
  // tokensList,
  // totalLiquidity,
  // hasInjectedToken,
  // acceptedCustomTokenDisclaimer
  // startWeight,
  // endWeight,
  time,
  // mainToken,
  // baseToken,
  // tokens,
  seedTokens,
  // mainTokenAddress,
  // baseTokenAddress,
  mainTokenAmount,
  baseTokenAmount,
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
const chartColors = computed(() => {
  let color = tailwind.theme.colors.green['400'];
  // if (isNegativeTrend.value) color = tailwind.theme.colors.red['400'];
  return [color];
});

/**
 * COMPUTED
 */
// const tokenWeightItemHeight = computed(() =>
//   upToLargeBreakpoint.value ? 56 : 64
// );
// const baseTokenOptions = [
//   nativeAsset.address,
//   baseTokenAddress.value,
//   '0x0eA185018F0cA3f8c545424d27bE300B22EE31D4'
// ];
const mainStartWeight = computed(() => {
  return seedTokens.value[0].startWeight;
});
const mainEndWeight = computed(() => {
  return seedTokens.value[0].endWeight;
});

/**
 * WATCHERS
 */
// watch(
//   () => seedTokens,
//   () => {
//     setTokensList(seedTokens.value.map(w => w.tokenAddress));
//   },
//   {
//     deep: true
//   }
// );
watch(
  mainStartWeight,
  () => {
    // console.log('startWeight', seedTokens);
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
    // startWeight.value = endWeight.value;
  }
});
watch(
  time,
  () => {
    console.log('watch time', time.value);
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
</script>
