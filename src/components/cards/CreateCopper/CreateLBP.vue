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
              Sign Creation Transactions
            </h5>
          </BalStack>

          <div class="h-px bg-gunmetal dark:border-gray-600"></div>
        </BalStack>
        <BalCard shadow="none" noBorder noPad class="bg-dark-3">
          <div
            class="grid grid-cols-1 xl:grid-cols-3 gap-y-8 gap-x-0 xl:gap-x-8"
          >
            <div class="col-span-2">
              <h6 class="text-gray-400">
                Now that your LBP configuration is ready you need to deploy it
                to the blockchain network. To do so you must sign 3 transactions
                using your wallet.
              </h6>
              <div class="my-4">
                <BalCheckbox>
                  <template v-slot:label>
                    <div class="mt-1">
                      I have read and agree to the Yotei Platform
                      <router-link
                        :to="{ name: 'terms-of-use' }"
                        target="_blank"
                      >
                        <span className="link">{{
                          $t('policies.termsOfUse')
                        }}</span>
                      </router-link>
                    </div></template
                  >
                </BalCheckbox>
              </div>
              <div class="text-bold text-lg flex items-center my-2">
                Approve interactions with main and base tokens
                <BalIcon class="ml-2" size="md" name="check-circle" />
              </div>
              <div class="text-bold text-lg flex items-center my-2">
                Schedule LBP
                <BalIcon class="ml-2" size="md" name="check-circle" />
              </div>
              <div class="my-4">
                <BalActionSteps
                  :actions="actions"
                  class="w-full"
                ></BalActionSteps>
              </div>
              <div class="mt-6 text-gray-400">
                Stuck? Please paste the latest tx hash from your wallet once it
                completes.
              </div>
              <div class="my-4">
                <input
                  class="border border-gray-400 rounded p-2 input flex-auto w-3/4 bg-transparent"
                  placeholder="0x123..."
                />
                <BalBtn
                  @click="createLBP"
                  class="ml-2"
                  size="sm"
                  label="Reset"
                />
              </div>
            </div>
            <div class="col-span-1">
              <BalCard>
                <BalStack vertical spacing="base">
                  <div>
                    <span class="font-bold">LBP network address:</span> Not yet
                    created
                  </div>
                  <div>
                    <span class="font-bold">Main token amount:</span> 11111 LC
                  </div>
                  <div><span class="font-bold">Swap fee:</span> 2.5%</div>
                  <div>
                    <span class="font-bold">Platform access fee:</span> 2%
                  </div>
                  <div>
                    <span class="font-bold">Start time:</span> 2022年4月26日 UTC
                    10:54
                  </div>
                  <div>
                    <span class="font-bold">End time:</span> 2022年4月29日 UTC
                    10:54
                  </div>
                </BalStack>
              </BalCard>
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
import { sleep } from '@/lib/utils';
import useCopperCreation from '@/composables/copper/useCopperCreation';
import useTokenApprovalActions from '@/composables/useTokenApprovalActions';

const emit = defineEmits(['update:height', 'trigger:alert']);
const { t } = useI18n();
// const { tokenApprovalActions } = useTokenApprovalActions(
//   ['',''],
//   [configService.network.addresses.copperProxyV2]
// );

const emptyTokenWeight: PoolSeedToken = {
  tokenAddress: '',
  weight: 0,
  id: '0',
  isLocked: false,
  amount: '0'
};
const actions = [
  {
    label: 'Approve',
    loadingLabel: t('investment.preview.loadingLabel.approval'),
    confirmingLabel: 'confirming',
    action: approveAction,
    stepTooltip: 'Approve'
  },
  {
    label: 'Create',
    loadingLabel: t('investment.preview.loadingLabel.create'),
    confirmingLabel: 'confirming',
    action: createPoolAction,
    stepTooltip: 'Create'
  }
];
/**
 * COMPOSABLES
 */
const { goBack, createLBP, approve } = useCopperCreation();
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
async function createPoolAction() {
  return createLBP();
}
async function approveAction() {
  return approve();
}
</script>
