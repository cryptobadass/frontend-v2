<template>
  <BalModal :show="isVisible" @close="$emit('close')" title="CONNECT WALLET">
    <WalletButton v-for="wallet in wallets" :wallet="wallet" :key="wallet" />
    <p class="pb-3 text-sm text-bluey-grey">
      {{ $t('byConnectingWallet') }}
      <!-- <router-link
        to="http://137.184.125.1/yotei/terms-of-use2.html"
        target="_blank"
      >
        <span className="link">{{ $t('policies.termsOfUse') }}</span>
      </router-link> -->
      <BalLink
        :href="'https://yotei.finance/terms-of-use.html'"
        external
        noStyle
      >
        <span className="link">{{ $t('policies.termsOfUse') }}</span></BalLink
      >
      <!-- <router-link :to="{ name: 'cookies-policy' }" target="_blank">
        <span className="link">{{ $t('policies.cookiesPolicy') }}</span>
      </router-link> -->
      {{ $t('and') }}
      <BalLink
        href="https://yotei.finance/privacy-policy.html"
        external
        noStyle
      >
        <span className="link">{{ $t('policies.privacyPolicy') }}</span
        >.</BalLink
      >
      <!-- <router-link
        :to="' http://137.184.125.1/yotei/privacy-policy.html'"
        target="_blank"
      >
        <span className="link">{{ $t('policies.privacyPolicy') }}</span
        >.
      </router-link> -->
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
