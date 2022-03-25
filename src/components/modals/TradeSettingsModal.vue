<template>
  <div>
    <BalIcon name="sun" class="ml-1 text-gray-400 -mb-px" />
    <BalModal
      :show="isVisible"
      @close="$emit('close')"
      title=""
      noPad
      no-content-pad
    >
      <template v-slot:header>
        <div class="flex items-start justify-between h-24 w-full">
          <h6 class="pl-7 mt-10 flex items-center">
            <WalletIconCyan class="inline-block mr-4" />{{ $t('settingsUp') }}
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

      <div class="px-7">
        <div>
          <h5>{{ $t('slippageTolerance') }}</h5>
        </div>
        <div>
          <h5>{{ $t('transactionType') }}</h5>
        </div>
      </div>
    </BalModal>
  </div>
</template>

<script lang="ts">
import { SupportedWallets } from '@/services/web3/web3.plugin';
import WalletButton from '@/components/web3/WalletButton.vue';
import { EXTERNAL_LINKS } from '@/constants/links';
import { defineComponent } from 'vue';
export default defineComponent({
  emits: ['close'],
  components: {
    // WalletButton
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
