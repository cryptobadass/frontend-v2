<script setup lang="ts">
// import { toRef, computed, ref } from 'vue';
// import { useRouter } from 'vue-router';

/**
 * TYPES
 */
type Props = {
  a: string;
};

/**
 * PROPS
 */
const props = defineProps<Props>();
</script>

<template>
  <div>
    <div class="flex items-center mb-4">
      <div class="font-bold text-2xl">LC Liquidity Bootstrapping Pool</div>
      <img
        class="rounded-full inline-block ml-3 w-8 h-8"
        :src="
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
        "
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-0 md:gap-x-2">
      <div class="col-span-1">
        <div class="text-gray-400">DURATION</div>
        <div class="font-bold">4.5 days</div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">ENDS IN</div>
        <div class="font-bold">3:08:58:43</div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">TOTAL VOLUME</div>
        <div class="font-bold">-</div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">LIQUIDITY</div>
        <div class="font-bold">$1,125.29</div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">PRICE</div>
        <div class="font-bold">$1.9721</div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400">MAIN TOKENS RELEASED</div>
        <div class="font-bold">0%</div>
      </div>
      <div class="col-span-1">
        <div class="text-gray-400 text-sm">BASE TOKENS ACCRUED</div>
        <div class="font-bold">0.00</div>
        <div class="text-gray-400 font-bold text-sm">USDC</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
