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
            <h5 class="font-bold dark:text-white">
              LBP Details
            </h5>
          </BalStack>
          <h6 class="text-gray-400">Fill out LBP details</h6>
          <div class="h-px bg-gunmetal dark:border-gray-600"></div>
        </BalStack>
        <BalCard shadow="none" noBorder noPad class="bg-dark-3">
          <div
            class="grid grid-cols-1 xl:grid-cols-4 gap-y-8 gap-x-0 xl:gap-x-8"
          >
            <div class="col-span-3">
              <div class="font-bold mb-2">
                LBP description
              </div>
              <div class="mb-4">
                <BalTextInput
                  v-model="description"
                  placeholder="this is a description"
                  class=" flex-auto w-full bg-transparent"
                  maxlength="1500"
                  size="sm"
                  :rules="[isRequired()]"
                />
                <p>{{description.length}} / 1500</p>
              </div>
              <div class="font-bold mb-2">Learn more link</div>
              <div class="mb-2">
                <BalTextInput
                  v-model="learnMoreLink"
                  class=" flex-auto w-full bg-transparent"
                  placeholder="Enter a URL"
                  size="sm"
                  :rules="[isRequired(), isHttpStart()]"
                />
              </div>
              <div class="mb-4 text-sm text-gray-400 font-normal">
                Please enter a valid URL that starts with "http://" or
                "https://"
              </div>
              <!-- <div class="font-bold mb-2">Geoblocked countries</div>
              <div class="mb-4">
                TODO select
              </div> -->
              <div class="font-bold mb-4">Preconfigured LBP settings</div>
              <div class="font-bold mb-4">Swap Fee</div>
              <div class="mb-2">
                <BalTextInput
                  class=" mr-2 inline-block w-40 bg-transparent text-right"
                  placeholder=""
                  v-model="swapFeePercentage"
                  type="number"
                  size="sm"
                  inputAlignRight
                  :rules="[isRequired()]"
                />%
              </div>
              <div class="mb-4 text-sm text-gray-400 font-normal">
                Earned by your project on swap volume during the LBP.
              </div>
              <div class="font-bold mb-4">Platform Access Fee</div>
              <div class="mb-4 text-sm text-gray-400 font-normal">
                2% Platform Access Fee - Deducted by Copper from the quantity
                accrued to the base token at the end of an LBP.
              </div>
              <div class="bg-gray-400 rounded text-white p-4 mb-4">
                <BalStack vertical spacing="base">
                  <p>
                    The swap fee is earned by your project on swap volume during
                    the LBP and serves the dual purpose of discouraging price
                    manipulation by large swap orders while also offsetting the
                    platform access fee charged by Copper.
                  </p>
                  <p>
                    The 2% platform access fee is applied by Copper at the
                    conclusion of an LBP to the quantity accrued to the base
                    token. The quantity accrued is inclusive of accrual due to
                    swaps + accrual due to the swap fee.
                  </p>
                  <p>
                    E.g. Project accrues $600,000 to the base token and has
                    $1,000,000 of swap volume. If the swap fee is 3% the project
                    earns $30,000 in swap fees, while paying a $12,000 (2%)
                    platform access fee to Copper from quantity accrued to the
                    base token at auction end.
                  </p>
                  <BalLink external noStyle class="group flex items-center">
                    More Info
                    <BalIcon
                      name="arrow-up-right"
                      size="sm"
                      class="ml-px group-hover:text-cyan-500 transition-colors"
                    />
                  </BalLink>
                </BalStack>
              </div>
              <div class="font-bold mb-4">Swaps disabled by default</div>
              <div class="bg-gray-400 rounded text-white p-4 mb-4">
                <BalStack vertical spacing="base">
                  <p>
                    Swaps are disabled upon LBP creation to prevent LBP
                    participants from swapping before the LBP token price decay
                    is scheduled to start. You have the option to enable
                    swapping in the LBP Settings tab and we recommend that you
                    do so right as the LBP token price decay is scheduled to
                    start. The LBP Settings tab will become available on the LBP
                    page once you’ve created the LBP.
                  </p>
                  <BalLink external noStyle class="group flex items-center">
                    More Info
                    <BalIcon
                      name="arrow-up-right"
                      size="sm"
                      class="ml-px group-hover:text-cyan-500 transition-colors"
                    />
                  </BalLink>
                </BalStack>
              </div>
              <div class="font-bold mb-4">A note about curation</div>
              <div class="bg-gray-400 rounded text-white p-4 mb-4">
                <BalStack vertical spacing="base">
                  <p>
                    If your LBP does not get picked up by one of the 3rd party
                    curators on the platform, participants in your LBP will be
                    mandated to first pass a quiz that will test their DeFi
                    competency.
                  </p>
                  <BalLink external noStyle class="group flex items-center">
                    View curation options
                    <BalIcon
                      name="arrow-up-right"
                      size="sm"
                      class="ml-px group-hover:text-cyan-500 transition-colors"
                    />
                  </BalLink>
                </BalStack>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2">
                <div class="col-span-1 mb-4">
                  <div class="font-bold mb-2">LBP Token symbol</div>
                  <div class="text-gray-400">{{ LBPTokenSymbol }}</div>
                </div>
                <div class="col-span-1 mb-4">
                  <div class="font-bold mb-2">LBP Token name</div>
                  <div class="text-gray-400">{{ LBPTokenName }}</div>
                </div>
              </div>
              <div class="font-bold mb-2">Rights</div>
              <div class="mb-4">
                <div class="text-gray-400">
                  <BalIcon class="mr-2" size="xs" name="check-circle" />Pause
                  swapping
                </div>
                <div class="text-gray-400">
                  <BalIcon class="mr-2" size="xs" name="check-circle" />Pull
                  liquidity
                </div>
              </div>
            </div>
          </div>
        </BalCard>
      </BalStack>
      <div class="mt-4">
        <BalBtn
          @click="proceed"
          :disabled="!description || !learnMoreLink || !swapFeePercentage"
          >Continue to LBP configuration</BalBtn
        >
      </div>
    </BalCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, onBeforeUpdate, watch } from 'vue';

import TokenWeightInput from '@/components/inputs/TokenInput/TokenWeightInput.vue';

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
import useCopperCreation from '@/composables/copper/useCopperCreation';
import { isRequired, isHttpStart } from '@/lib/utils/validations';

const emit = defineEmits(['update:height', 'trigger:alert']);

const emptyTokenWeight: PoolSeedToken = {
  tokenAddress: '',
  weight: 0,
  id: '0',
  isLocked: false,
  amount: '0'
};

/**
 * COMPOSABLES
 */
const {
  proceed,
  goBack,
  swapFeePercentage,
  mainTokenAddress,
  LBPTokenSymbol,
  LBPTokenName,
  description,
  learnMoreLink
} = useCopperCreation();
// const { upToLargeBreakpoint } = useBreakpoints();
// const { fNum2 } = useNumbers();
const { nativeAsset, tokens, getToken } = useTokens();
// const { isWalletReady, toggleWalletSelectModal } = useWeb3();
// const { t } = useI18n();
// const { darkMode } = useDarkMode();

/**
 * STATE
 */
const networkName = configService.network.name;

/**
 * COMPUTED
 */
// const tokenWeightItemHeight = computed(() =>
//   upToLargeBreakpoint.value ? 56 : 64
// );

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
