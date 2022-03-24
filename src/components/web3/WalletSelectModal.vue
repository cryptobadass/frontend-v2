<template>
  <BalModal :show="isVisible" @close="$emit('close')" title="" noPad no-content-pad>
    <template v-slot:header>
      <div class="flex items-start justify-between h-24 w-full">
        <h6 class="pl-7 mt-10 flex items-center">
          <WalletIconCyan class="inline-block mr-4" />{{
            $t('connectWalletUp')
          }}
        </h6>
        <BalCircle
          v-if="true || withdrawalConfirmed"
          size="6"
          color="dark"
          class="text-white mr-3 mt-3 cursor-pointer"
        >
          <BalIcon class="text-white" @click="$emit('close')" name="x" />
        </BalCircle>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-4 px-7">
      <WalletButton v-for="wallet in wallets" :wallet="wallet" :key="wallet" />
    </div>
    <p class="pb-3 px-7 pt-5 pb-7 text-sm">
      {{ $t('byConnectingWallet') }}
      <router-link :to="{ name: 'terms-of-use' }" target="_blank">
        <span className="link">{{ $t('policies.termsOfUse') }}</span
        >,
      </router-link>
      <router-link :to="{ name: 'cookies-policy' }" target="_blank">
        <span className="link ">{{ $t('policies.cookiesPolicy') }}</span>
      </router-link>
      {{ $t('and') }}
      <router-link :to="{ name: 'privacy-policy' }" target="_blank">
        <span className="link ">{{ $t('policies.privacyPolicy') }}</span
        >.
      </router-link>
    </p>
    <!-- <div
      class="
        p-4
        rounded-lg
        bg-gradient-to-b
        from-gray-50
        dark:from-gray-900
        to-gray-100
        dark:to-gray-850
      "
    >
      <h6>{{ $t('newToEthereum') }}</h6>
      <p class="text-sm">
        {{ $t('setUpEthereumWallet') }}
        <BalLink :href="EXTERNAL_LINKS.Ethereum.Wallets" external>
          {{ $t('learnMore') }}
          <span class="align-middle"
            ><BalIcon name="arrow-up-right" size="sm"
          /></span>
        </BalLink>
      </p>
    </div> -->
  </BalModal>
</template>

<script lang="ts">
import { SupportedWallets } from '@/services/web3/web3.plugin';
import WalletButton from '@/components/web3/WalletButton.vue';
import { EXTERNAL_LINKS } from '@/constants/links';
import { defineComponent } from 'vue';
export default defineComponent({
  emits: ['close'],
  components: {
    WalletButton
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      wallets: SupportedWallets.filter(id => id !== 'gnosis'),
      EXTERNAL_LINKS
    };
  }
});
</script>
<style scoped>
.link {
  @apply text-cyan hover:text-cyan;
}
</style>
