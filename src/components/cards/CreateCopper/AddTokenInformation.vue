<template>
  <div class="mb-16">
    <BalCard shadow="none">
      <BalStack vertical spacing="base">
        <BalStack vertical spacing="xs">
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

              <div
                class="mb-4"
                v-if="isUnsupportedNetwork || isMismatchedNetwork"
              >
                <div class="mb-2">
                  Unkown network
                  <BalBtn
                    class="ml-2"
                    label="Switch network"
                    outline
                    color="cyan"
                    size="sm"
                    @click="connectToAppNetwork"
                  />
                </div>
                <div class="text-red-400 text-sm">
                  network does not match target
                </div>
              </div>
              <div class="mb-4 " v-else>
                <BalBtn
                  class="border-gunmetal border dark:bg-dark-222"
                  outline
                  color="white"
                  size="md"
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
              <div class="font-bold mb-2">
                Main Token <span class="text-red-400">*</span>
              </div>
              <div class="mb-4 flex items-center">
                <BalTextInput
                  v-model="seedTokens[0].tokenAddress"
                  class="w-3/4 bg-transparent"
                  placeholder="ERC-20 Token Contract Address"
                  size="sm"
                />
                <BalIcon
                  v-if="mainTokenInfo"
                  name="check-circle"
                  class="text-cyan ml-2"
                />
              </div>
              <div class="font-bold mb-2">Token logo URL</div>
              <div class="mb-4 flex items-center">
                <BalTextInput
                  class=" w-3/4 bg-transparent"
                  placeholder="logo URL"
                  v-model="image"
                  :rules="[isImageUrl()]"
                  size="sm"
                />
                <div class="rounded-full inline-block ml-3">
                  <BalAsset :iconURI="image"></BalAsset>
                </div>
              </div>
              <div class="mb-4 text-sm text-gray-400 font-normal">
                Please enter a valid URL starting with "https://" and ending in
                ".jpeg", ".jpg", or ".png".
              </div>
              <div class="mt-4">
                <BalBtn :disabled="isProceedDisabled" @click="handleProceed">{{
                  walletLabel
                }}</BalBtn>
              </div>
            </div>
            <div
              class="col-span-1 order-2 px-1 flex flex-col justify-center content-center"
              v-if="mainTokenInfo"
            >
              <div class="font-bold text-lg mb-2 flex items-center">
                token info validated<BalIcon
                  name="check-circle"
                  class="text-cyan ml-2"
                />
              </div>
              <BalCard>
                <BalStack vertical spacing="base">
                  <div>
                    <span class="text-gray-400 text-sm mr-2 font-bold"
                      >Token name:</span
                    >
                    {{ mainTokenInfo?.name }}
                  </div>
                  <div>
                    <span class="text-gray-400 text-sm mr-2  font-bold"
                      >Token ticker:</span
                    >{{ mainTokenInfo?.symbol }}
                  </div>
                  <div>
                    <span class="text-gray-400 text-sm mr-2 font-bold"
                      >Balance:</span
                    >
                    {{ fNum2(tokenBalance, FNumFormats.token) }}
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
import { computed } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';

import { configService } from '@/services/config/config.service';

import useWeb3 from '@/services/web3/useWeb3';
import useCopperCreation from '@/composables/copper/useCopperCreation';
import BalAsset from '@/components/_global/BalAsset/BalAsset.vue';
import { isImageUrl, isImageUrlCheck } from '@/lib/utils/validations';
import { useI18n } from 'vue-i18n';

const { balanceFor } = useTokens();

/**
 * COMPOSABLES
 */
const { proceed, seedTokens, mainTokenInfo, image } = useCopperCreation();
const { fNum2 } = useNumbers();
const { t } = useI18n();
const {
  isMismatchedNetwork,
  isUnsupportedNetwork,
  connectToAppNetwork,
  isWalletReady,
  toggleWalletSelectModal
} = useWeb3();

/**
 * STATE
 */
const networkName = configService.network.name;
const network = configService.network.network;

/**
 * COMPUTED
 */

const tokenBalance = computed(() => {
  return balanceFor(seedTokens.value[0].tokenAddress);
});
const isProceedDisabled = computed(() => {
  if (!isWalletReady.value) return false;
  return !mainTokenInfo.value || !isImageUrlCheck(image.value);
});
const walletLabel = computed(() => {
  if (!isWalletReady.value) {
    return t('connectWallet');
  }
  return 'Continue to LBP configuration';
});

/**
 * WATCHERS
 */

/**
 * LIFECYCLE
 */

/**
 * FUNCTIONS
 */

function iconSrc(network): string {
  return require(`@/assets/images/icons/networks/${network}.svg`);
}
function handleProceed() {
  if (!isWalletReady.value) {
    toggleWalletSelectModal(true);
  } else {
    proceed();
  }
}
</script>
