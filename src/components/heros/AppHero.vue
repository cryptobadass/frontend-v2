<script lang="ts" setup>
import { computed } from 'vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import usePools from '@/composables/pools/usePools';
import { EXTERNAL_LINKS } from '@/constants/links';
import useFathom from '@/composables/useFathom';
import useWeb3 from '@/services/web3/useWeb3';
import useDarkMode from '@/composables/useDarkMode';
import { useLock } from '@/composables/useLock';
import { bnum } from '@/lib/utils';
import { useRouter } from 'vue-router';
import useStaking from '@/composables/staking/useStaking';
import { isL2 } from '@/composables/useNetwork';

/**
 * COMPOSABLES
 */
const router = useRouter();
const { fNum2 } = useNumbers();
const {
  isWalletReady,
  toggleWalletSelectModal,
  isWalletConnecting
} = useWeb3();
const { trackGoal, Goals } = useFathom();
const { totalInvestedAmount, isLoadingUserPools } = usePools();
const { darkMode } = useDarkMode();
const { lockFiatValue, isLoadingLock } = useLock();
// const {
//   totalStakedFiatValue,
//   isLoading: isStakingLoading,
//   isStakingQueryEnabled
// } = useStaking();

/**
 * COMPUTED
 */
const classes = computed(() => ({
  ['h-72']: !isWalletReady.value && !isWalletConnecting.value,
  ['h-40']: isWalletReady.value || isWalletConnecting.value
}));
// console.log('totalInvestedLabel',totalInvestedLabel.value)
const totalInvestedLabel = computed((): string => {
  const value = bnum(totalInvestedAmount.value || '0')
    .plus(lockFiatValue.value)
    // .plus(totalStakedFiatValue.value)
    .toString();
  return fNum2(value, FNumFormats.fiat);
});

const totalVeBalLabel = computed((): string =>
  fNum2(lockFiatValue.value, FNumFormats.fiat)
);

const isLoadingLockAndStaking = computed(
  (): boolean => !isL2.value && isLoadingLock.value
  // (isLoadingLock.value ||
  // (isStakingQueryEnabled.value && isStakingLoading.value))
);

const isLoadingTotalValue = computed(
  (): boolean => isLoadingUserPools.value //|| isLoadingLockAndStaking.value
);
// console.log('aaaaa-9', isLoadingUserPools.value, isLoadingLockAndStaking.value);
// console.log(
//   'aaaaa-10',
//   isL2.value,
//   isLoadingLock.value,
//   isStakingQueryEnabled.value,
//   isStakingLoading.value
// );

/**
 * METHODS
 */
function onClickConnect() {
  toggleWalletSelectModal(true);
  trackGoal(Goals.ClickHeroConnectWallet);
}
</script>

<template>
  <div :class="['app-hero border-t border-b border-gunmetal bg-dark-222 h-40']">
    <div class="w-full max-w-6xl mx-auto">
      <template v-if="isWalletReady || isWalletConnecting">
        <h1
          v-text="$t('myBalancerInvestments')"
          class="text-base font-medium text-white opacity-90 font-body mb-2"
        />
        <BalLoadingBlock
          v-if="isLoadingTotalValue"
          class="h-10 w-40 mx-auto"
          white
        />
        <div v-else class="text-3xl font-bold text-white mb-1">
          {{ totalInvestedLabel }}
        </div>
        <div v-if="!isL2" class="relative mt-2 inline-block">
          <BalLoadingBlock
            v-if="isLoadingTotalValue"
            class="h-8 w-40 mx-auto"
            white
          />
          <!-- <div
            v-else
            class="
              vebal-banner
              h-8
              flex
              items-center
              px-3
              text-yellow-500 text-sm
              font-medium
              cursor-pointer
              border border-yellow-500
              rounded-bl rounded-tr
            "
            @click="router.push({ name: 'vebal' })"
          >
            {{ $t('inclXInVeBal', [totalVeBalLabel]) }}
          </div> -->
        </div>
      </template>
      <template v-else>
        <div
          v-text="$t('ammPlatformStart')"
          class="
            text-white text-center text-2xl
            md:text-3xl
            pb-2
            
          "
        />
        <h1
          v-text="$t('ammPlatformEnd')"
          class="
            text-cyan text-center text-2xl font-medium
            md:text-3xl
            pb-2
          "
        />
        <div class="flex justify-center mt-4">
          <!-- <BalBtn
            :color="darkMode ? 'cyan' : 'white'"
            class=""
            @click="onClickConnect"
          >
            {{ $t('connectWallet') }}
          </BalBtn> -->
          <!-- <BalBtn
            tag="a"
            :href="EXTERNAL_LINKS.Balancer.Home"
            target="_blank"
            rel="noreferrer"
            color="white"
            outline
            @click="trackGoal(Goals.ClickHeroLearnMore)"
          >
            {{ $t('learnMore') }}
            <BalIcon name="arrow-up-right" size="sm" class="ml-1" />
          </BalBtn> -->
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.app-hero {
  @apply bg-cover bg-center flex items-center justify-center text-center px-4;
  transition: all 0.3s ease-in-out;
  /* background-image: url('/images/backgrounds/bg-header.svg'); */
}

.vebal-banner::before {
  @apply border border-yellow-500;
  content: '';
  width: 16px;
  height: 6px;
  left: 0;
  top: -5px;
  position: absolute;
  border-top-left-radius: 8px;
}
.vebal-banner::after {
  @apply border border-yellow-500;
  content: '';
  width: 16px;
  height: 6px;
  bottom: -5px;
  right: 0;
  position: absolute;
  border-bottom-right-radius: 8px;
}
</style>
