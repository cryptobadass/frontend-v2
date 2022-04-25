<template>
  <div class="bg-white text-black min-h-screen">
    <div class="subsection">
      <h4>BalAccordion</h4>
      <p></p>
      <p>
        <BalAccordion
          class="w-80 text-white"
          :sections="[
            { title: 'My Wallet', id: 'my-wallet' },
            { title: 'Trending Pairs', id: 'trending-pairs', isDisabled: true },
            { title: 'Price Chart', id: 'price-chart' }
          ]"
        >
          <template v-slot:my-wallet>
            <div class="h-20 bg-green">MyWallet box</div>
          </template>
          <template v-slot:trending-pairs>
            <div class="h-20 bg-green">TrendingPairs box</div>
          </template>
          <template v-slot:price-chart>
            <div class="h-20 bg-green">PairPriceGraph box</div>
          </template>
        </BalAccordion>
      </p>
    </div>
    <div class="subsection">
      <h4>BalActionSteps</h4>
      <BalActionSteps :actions="actions" />
    </div>
    <div class="subsection">
      <h4>BalAlert</h4>
      <p>type: 'warning' | 'error' | 'info' , default: 'info'</p>
      <p>size: 'sm' | 'md' | 'lg' , default: md</p>
      <p>title: '' , default:'A title message'</p>
      <p>description:''</p>
      <p>actionLabel:''</p>
      <p>raised: boolean, default:false</p>
      <p>block: boolean, default:false</p>
      <BalAlert
        type="info"
        size="lg"
        title="a ha title"
        description="des"
        actionLabel="label"
        raised
        block
      />
    </div>
    <div class="subsection">
      <h4>BalAssetSet</h4>
      <BalAssetSet :logoURIs="logoURIs" />
    </div>
    <div class="subsection">
      <h4>BalBlankSlate</h4>
      <BalBlankSlate>
        <BalIcon name="bar-chart" />
        {{ $t('insufficientData') }}
      </BalBlankSlate>
    </div>
    <div class="subsection">
      <h4>BalBreakdown</h4>
      <BalBreakdown title="BalBreakdown" :items="['11111', 22222, 33333, 4444]">
        <div class="flex items-center">
          <span class="ml-1 text-gray-500">
            BalBreakdown children
          </span>
        </div>
        <template v-slot:item="{ item }">
          <span class="text-gray-500 ml-1">
            {{ item }}
          </span>
        </template>
      </BalBreakdown>
    </div>
    <div class="subsection">
      <h4>BalBtn</h4>
      <p>tag: button | a | div | router-link default: button</p>
      <p>size: xs | sm | md | lg default: md</p>
      <p>
        color: 'primary', 'gradient', 'gradient-reverse',
        'gradient-pink-yellow', 'gray', 'red', 'white', 'blue', 'cyan'
        default:primary
      </p>
      <p>label: ''</p>
      <p>
        block: false, circle: false, outline: false, flat: false, rounded:false,
        loading:false,loadingLabel:false, disabled: false
      </p>
      <BalBtn label="BalBtn" rounded outline>BalBtn</BalBtn>
    </div>
    <div class="subsection">
      <h4>BalBtnGroup</h4>
      <div>
        <BalBtnGroup
          v-model="state.fixedSlippage"
          :options="ethereumTxTypeOptions"
          @update:modelValue="onFixedInput"
        />
      </div>
    </div>
    <div class="subsection">
      <h4>balCard</h4>
      <p>title:''</p>
      <p>titleTag: '' ;default:h4</p>
      <p>square: boolean; default:false</p>
      <p>noPad: boolean; default:false</p>
      <p>noContentPad: boolean; default: false</p>
      <p>noBorder: boolean; default: false</p>
      <p>darkBgColor: ''; default: '850'</p>
      <p>imgSrc: '' ; default: ''</p>
      <p>hFull: boolean; default: false</p>
      <p>growContent: boolean; default: false</p>
      <p>rightAlignHeader: boolean; default:false</p>
      <p>exposeOverflow: boolean; default: false</p>
      <p>overflowYScroll: boolean; default: false</p>
      <div><BalCard /></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue';
// import { ENABLE_LEGACY_TRADE_INTERFACE } from '@/composables/trade/constants';
// // Types
// import { TradeInterface } from '@/store/modules/app';
// Composables
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { sleep } from '@/lib/utils';

// import useBreakpoints from '@/composables/useBreakpoints';
// import useTokenLists from '@/composables/useTokenLists';
// import usePoolFilters from '@/composables/pools/usePoolFilters';
// // Components
// import MyWallet from '@/components/cards/MyWallet/MyWallet.vue';
// import TrendingPairs from '@/components/cards/TrendingPairs/TrendingPairs.vue';
// import PairPriceGraph from '@/components/cards/PairPriceGraph/PairPriceGraph.vue';
// import TradeCard from '@/components/cards/TradeCard/TradeCard.vue';
// import TradeCardGP from '@/components/cards/TradeCardGP/TradeCardGP.vue';
// import Col3Layout from '@/components/layouts/Col3Layout.vue';
const { t } = useI18n();
/**
 * STATE
 */
const showPriceGraphModal = ref(false);
const actions = [
  {
    label: t('createPool'),
    loadingLabel: t('investment.preview.loadingLabel.create'),
    confirmingLabel: t('confirming'),
    action: createPool,
    stepTooltip: t('fundPoolTooltip')
  },
  {
    label: t('fundPool'),
    loadingLabel: t('investment.preview.loadingLabel.fund'),
    confirmingLabel: t('confirming'),
    action: joinPool,
    stepTooltip: t('fundPoolTooltip')
  }
];
const logoURIs = [
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
];
const ethereumTxTypeOptions = [
  { label: 'btn1', value: 1 },
  { label: 'btn2', value: 2 }
];
const state = reactive({
  fixedSlippage: ''
});

/**
 * COMPOSABLES
 */
const store = useStore();
// const { loadingTokenLists } = useTokenLists();
// const { setSelectedTokens } = usePoolFilters();
// const { upToLargeBreakpoint } = useBreakpoints();

/**
 * COMPUTED
 */
// const appLoading = computed(() => store.state.app.loading);
// const tradeInterface = computed(() => store.state.app.tradeInterface);

/**
 * METHODS
 */
async function createPool() {
  await sleep(2000);
  return await sleep(2000);
}
async function joinPool() {
  await sleep(2000);
  return {};
}
function onFixedInput(val: string): void {
  console.log(val);
}
// function onPriceGraphModalClose() {
//   showPriceGraphModal.value = false;
// }

// function togglePairPriceGraphModal() {
//   showPriceGraphModal.value = !showPriceGraphModal.value;
// }

/**
 * CALLBACKS
 */
// onMounted(() => {
//   // selectedPoolTokens are only persisted between the Home/Pool pages
//   setSelectedTokens([]);
// });
</script>

<style scoped>
.graph-modal {
  height: 450px;
}
.subsection {
  @apply p-4;
}
</style>
