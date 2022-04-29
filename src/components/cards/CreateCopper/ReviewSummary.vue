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
              Review Summary
            </h5>
          </BalStack>
          <h6 class="text-gray-400">
            Please double check everything before creating the LBP.
          </h6>
          <div class="h-px bg-gunmetal dark:border-gray-600"></div>
        </BalStack>
        <BalCard shadow="none" noBorder noPad class="bg-dark-3">
          <div
            class="grid grid-cols-1 xl:grid-cols-4 gap-y-8 gap-x-0 xl:gap-x-8"
          >
            <div class="col-span-3">
              <BalStack vertical spacing="base">
                <div>
                  <div class="font-bold mb-2">
                    Main token info
                  </div>
                  <div class="mb-4">
                    <p class="text-gray-400 mb-2">Main Token Address</p>
                    <p class="mb-2">
                      0x82ec6ce24ee9d883d955327c0c54ebec85c4a19f
                    </p>
                    <div class="flex">
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">Token name</p>
                        <p>lance</p>
                      </div>
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">Token ticker</p>
                        <p>
                          <img
                            class="inline-block"
                            width="20"
                            height="20"
                            src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                          />
                          <span class="ml-2">LC</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="font-bold mb-2">LBP details</div>
                  <div class="mb-2">
                    <div class="flex">
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">Token quantity</p>
                        <p>100 LC</p>
                      </div>
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">Base token quantity</p>
                        <p>
                          1,000 USDC
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="mb-2">
                    <div class="flex">
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">Price range</p>
                        <p>$10.4082 -$5.4072</p>
                      </div>
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">Liquidity</p>
                        <p>
                          $2,040.82
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="font-bold mb-2">Weights</div>
                  <div class="mb-4">
                    <div class="flex">
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">Starting Weight</p>
                        <p>51% LC 49% USDC</p>
                      </div>
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">End weight</p>
                        <p>
                          35% LC 65% USDC
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="font-bold mb-2">Time</div>
                  <div class="mb-4">
                    <div class="flex">
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">Start time</p>
                        <p>2022年4月28日 UTC 22:00</p>
                      </div>
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">End time</p>
                        <p>
                          2022年5月5日 UTC 22:00
                        </p>
                      </div>
                      <div class="w-60">
                        <p class="text-gray-400 mb-2">Duration</p>
                        <p>
                          168 hrs (7 days)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="font-bold mb-2">Details</div>

                  <div class="w-full mb-4">
                    <p class="text-gray-400 mb-2">Description</p>
                    <p>this is a description</p>
                  </div>
                  <div class="w-full mb-4">
                    <p class="text-gray-400 mb-2">Learn more link</p>
                    <p>http://www.baidu.com</p>
                  </div>
                  <div class="flex mb-4">
                    <div class="w-60">
                      <p class="text-gray-400 mb-2">Swap fee</p>
                      <p>2.5000%</p>
                    </div>
                    <div class="w-60">
                      <p class="text-gray-400 mb-2">Platform access fee</p>
                      <p>
                        2%
                      </p>
                    </div>
                  </div>
                  <div class="w-full mb-4">
                    <p class="text-gray-400 mb-2">LBP LP token symbol</p>
                    <p>LC Copper LBP</p>
                  </div>
                  <div class="w-full mb-4">
                    <p class="text-gray-400 mb-2">LBP token name</p>
                    <p>LC_LBP</p>
                  </div>
                  <div class="w-full mb-4">
                    <div class="text-gray-400 mb-2">Rights</div>
                    <div class="mb-4">
                      <div class="text-gray-400 mb-1">
                        <BalIcon
                          class="mr-2"
                          size="xs"
                          name="check-circle"
                        />Pause swapping
                      </div>
                      <div class="text-gray-400 mb-1">
                        <BalIcon
                          class="mr-2"
                          size="xs"
                          name="check-circle"
                        />Pull liquidity
                      </div>
                    </div>
                  </div>
                </div>
              </BalStack>
            </div>
          </div>
        </BalCard>
      </BalStack>
      <div class="mt-4">
        <BalBtn @click="proceed">Continue to creation transactions </BalBtn>
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
const { proceed, goBack } = useCopperCreation();
// const { upToLargeBreakpoint } = useBreakpoints();
// const { fNum2 } = useNumbers();
// const { nativeAsset, tokens } = useTokens();
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
