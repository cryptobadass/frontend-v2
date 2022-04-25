<template>
  <div ref="cardWrapper" class="mb-16">
    <BalCard shadow="none">
      <BalStack vertical spacing="base">
        <BalStack vertical spacing="xs">
          <span class="text-xs text-gray-700 dark:text-bluey-grey">{{
            networkName
          }}</span>
          <h5 class="font-bold dark:text-white border-b border-gunmetal pb-2">
            Add Token Information
          </h5>
        </BalStack>
        <BalCard shadow="none" noBorder noPad class="bg-dark-3">
          <div
            class="grid grid-cols-1 lg:grid-cols-4 gap-y-8 gap-x-0 lg:gap-x-8"
          >
            <div class="col-span-3 order-1">
              <div>
                Connected wallet network
              </div>
              <div>Fuji</div>
              <div>Main Token *</div>
              <div>
                <input
                  placeholder="0x82ec6ce24ee9d883d955327c0c54ebec85c4a19f"
                />
              </div>
              <div>Token logo URL</div>
              <div>
                <input placeholder="logo URL" />
              </div>
              <div>
                Please enter a valid URL starting with "https://" and ending in
                ".jpeg", ".jpg", or ".png".
              </div>
              <div><BalBtn>Continue to LBP configuration</BalBtn></div>
            </div>
            <div class="col-span-1 order-2 px-1">
              <div>token info validated</div>
              <BalStack>
                <div>Token name: lance</div>
                <div>Token ticker:LC</div>
                <div>Total supply: 100,000,000</div>
                <div>Balance: 99,990,332.23</div>
              </BalStack>
            </div>
          </div>
        </BalCard>
      </BalStack>
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
// const {
//   updateTokenWeights,
//   proceed,
//   acceptCustomTokenDisclaimer,
//   setTokensList,
//   seedTokens,
//   tokensList,
//   totalLiquidity,
//   hasInjectedToken,
//   acceptedCustomTokenDisclaimer
// } = usePoolCreation();
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
