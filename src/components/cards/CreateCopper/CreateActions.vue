<script setup lang="ts">
import { ref, computed, reactive, onBeforeMount } from 'vue';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { TransactionActionInfo } from '@/types/transactions';

import BalActionSteps from '@/components/_global/BalActionSteps/BalActionSteps.vue';

import useWeb3 from '@/services/web3/useWeb3';
import useConfig from '@/composables/useConfig';
import useTokenCopperApprovalActions from '@/composables/useTokenCopperApprovalActions';
import usePoolCreation from '@/composables/pools/usePoolCreation';
import useCopperCreation from '@/composables/copper/useCopperCreation';
import useEthers from '@/composables/useEthers';
import { useI18n } from 'vue-i18n';

/**
 * TYPES
 */
type Props = {
  tokenAddresses: string[];
  amounts: string[];
  createDisabled: boolean;
  errorMessage: boolean;
};

type CreateState = {
  confirmed: boolean;
  confirmedAt: string;
  receipt?: TransactionReceipt;
  isRestoredTxConfirmed?: boolean;
  isLoadingRestoredTx: boolean;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

/**
 * STATE
 */
const createState = reactive<CreateState>({
  confirmed: false,
  confirmedAt: '',
  isRestoredTxConfirmed: false,
  isLoadingRestoredTx: false
});

/*
 * COMPOSABLES
 */
// const route = useRoute();
const { t } = useI18n();
const { explorerLinks } = useWeb3();
const { networkConfig } = useConfig();
const { tokenApprovalActions } = useTokenCopperApprovalActions(
  props.tokenAddresses,
  ref(props.amounts)
);
const {
  createPool,
  poolAddress
} = useCopperCreation();

/**
 * COMPUTED
 */

const actions = computed((): TransactionActionInfo[] => [
  ...tokenApprovalActions,
  {
    label: 'create LBP Pool',
    loadingLabel: t('investment.preview.loadingLabel.create'),
    confirmingLabel: t('confirming'),
    action: createPool,
    stepTooltip: 'create LBP Pool'
  }
  // {
  //   label: t('fundPool'),
  //   loadingLabel: t('investment.preview.loadingLabel.fund'),
  //   confirmingLabel: t('confirming'),
  //   action: joinPool,
  //   stepTooltip: t('fundPoolTooltip')
  // }
]);

const requiredActions = computed(() => {
  // if (
  //   (hasRestoredFromSavedState.value && needsSeeding.value) ||
  //   createState.isRestoredTxConfirmed
  // ) {
  //   return actions.value.filter(action => action.label === t('fundPool'));
  // }
  return actions.value;
});

const explorerLink = computed((): string =>
  createState.receipt
    ? explorerLinks.txLink(createState.receipt.transactionHash)
    : ''
);

onBeforeMount(async () => {
  // if (createPoolTxHash.value) {
  //   createState.isLoadingRestoredTx = true;
  //   const isConfirmed = await isTxConfirmed(createPoolTxHash.value);
  //   createState.isLoadingRestoredTx = false;
  //   createState.isRestoredTxConfirmed = isConfirmed;
  // }
});

/**
 * METHODS
 */
function handleSuccess(details: any): void {
  createState.confirmed = true;
  createState.receipt = details.receipt;
  createState.confirmedAt = details.confirmedAt;
  emit('success');
}
</script>

<template>
  <div>
    <BalActionSteps
      :actions="requiredActions"
      :disabled="props.createDisabled"
      :errorMessage="props.errorMessage"
      @success="handleSuccess"
      :isLoading="createState.isLoadingRestoredTx"
      :loadingLabel="$t('restoring')"
    />
    <template v-if="createState.confirmed">
      <div
        class="flex items-center justify-between text-gray-400 dark:text-gray-600 mt-4 text-sm"
      >
        <div class="flex items-center">
          <BalIcon name="clock" />
          <span class="ml-2">
            {{ createState.confirmedAt }}
          </span>
        </div>
        <BalLink
          :href="explorerLink"
          external
          noStyle
          class="group flex items-center"
        >
          {{ networkConfig.explorerName }}
          <BalIcon
            name="arrow-up-right"
            size="sm"
            class="ml-px group-hover:text-cyan-500 transition-colors"
          />
        </BalLink>
      </div>
      <!-- create balancer have one step fundPool ,
       but create copper haven't so there have a 
       error with params , the id must have -->
      <BalBtn
        v-if="poolAddress"
        tag="router-link"
        :to="{ name: 'launchpad-detail', params: { id: poolAddress } }"
        color="gray"
        outline
        block
        class="mt-2"
      >
        {{ $t('viewPool') }}
      </BalBtn>
    </template>
  </div>
</template>
