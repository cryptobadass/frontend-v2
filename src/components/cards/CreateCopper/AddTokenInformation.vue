<template>
  <div ref="cardWrapper" class="mb-16">
    <BalCard shadow="none">
      <BalStack vertical spacing="base">
        <BalStack vertical spacing="xs">
          <!-- <span class="text-xs text-gray-700 dark:text-bluey-grey">{{
            networkName
          }}</span> -->
          <h5 class="font-bold dark:text-white border-b border-gunmetal pb-2">
            Add Token Information
          </h5>
        </BalStack>
        <BalCard shadow="none" noBorder noPad class="bg-dark-3">
          <div
            class="grid grid-cols-1 lg:grid-cols-4 gap-y-8 gap-x-0 lg:gap-x-8"
          >
            <div class="col-span-3 order-1">
              <div class="font-bold mb-2">
                Connected wallet network
              </div>
              <div class="mb-4 ">
                <BalBtn
                  class="border-gunmetal border dark:bg-dark-222"
                  outline
                  color="white"
                  :size="upToLargeBreakpoint ? 'md' : 'sm'"
                >
                  <img
                    :src="iconSrc(network)"
                    :alt="networkName"
                    class="w-6 h-6 rounded-full"
                  />
                  <span class="ml-2">
                    {{ networkName }}
                  </span>
                </BalBtn>
              </div>
              <div class="mb-4">
                <div class="mb-2">
                  Unkown network
                  <BalBtn
                    class="ml-2"
                    label="Switch network"
                    outline
                    color="cyan"
                    size="sm"
                  />
                </div>
                <div class="text-red-400 text-sm">
                  network does not match target
                </div>
              </div>
              <div class="font-bold mb-2">
                Main Token <span class="text-red-400">*</span>
              </div>
              <div class="mb-4">
                <input
                  class="border border-gray-400 rounded p-2 input flex-auto w-3/4 bg-transparent"
                  placeholder="0x82ec6ce24ee9d883d955327c0c54ebec85c4a19f"
                />
              </div>
              <div class="font-bold mb-2">Token logo URL</div>
              <div class="mb-2">
                <input
                  class="border border-gray-400 rounded p-2 input flex-auto w-3/4 bg-transparent"
                  placeholder="logo URL"
                />
                <img
                  class="rounded-full inline-block ml-3 w-8 h-8"
                  :src="
                    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
                  "
                />
              </div>
              <div class="mb-4 text-sm text-gray-400 font-normal">
                Please enter a valid URL starting with "https://" and ending in
                ".jpeg", ".jpg", or ".png".
              </div>
            </div>
            <div
              class="col-span-1 order-2 px-1 flex flex-col justify-center content-center"
            >
              <div class="font-bold text-lg mb-2 flex items-center">
                token info validated<BalIcon
                  name="check-circle"
                  class="text-cyan ml-2"
                />
              </div>
              <BalCard>
                <BalStack vertical spacing="base">
                  <div>Token name: lance</div>
                  <div>Token ticker:LC</div>
                  <div>Total supply: 100,000,000,000</div>
                  <div>Balance: 99,990,332.23</div>
                </BalStack>
              </BalCard>
            </div>
          </div>
          <div class="mt-4">
            <BalBtn @click="proceed">Continue to LBP configuration</BalBtn>
            <BalBtn class="ml-2" @click="createLBP">createLBP</BalBtn>
            <BalBtn class="ml-2" @click="approve">approve</BalBtn>
          </div>
        </BalCard>
      </BalStack>
    </BalCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, onBeforeUpdate, watch } from 'vue';
import AppNavNetworkSelect from '@/components/navs/AppNav/AppNavNetworkSelect.vue';
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

const activeNetwork = {
  id: 'fuji',
  name: 'Avalanche Fuji ',
  subdomain: 'fuji',
  key: '43113'
};

/**
 * COMPOSABLES
 */
const {
  // updateTokenWeights,
  proceed,
  // acceptCustomTokenDisclaimer,
  // setTokensList,
  // seedTokens,
  // tokensList,
  // totalLiquidity,
  // hasInjectedToken,
  // acceptedCustomTokenDisclaimer,
  createLBP,
  approve
} = useCopperCreation();
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
const network = configService.network.network;

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

function iconSrc(network): string {
  return require(`@/assets/images/icons/networks/${network}.svg`);
}
</script>
