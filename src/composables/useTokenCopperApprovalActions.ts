import { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import useTokenApprovals, {
  ApprovalState
} from '@/composables/copper/useTokenApprovals';
import useTokens from '@/composables/useTokens';

import useWeb3 from '@/services/web3/useWeb3';

import { TransactionActionInfo } from '@/types/transactions';
import { MaxUint256 } from '@ethersproject/constants';

export default function useTokenCopperApprovalActions(
  tokenAddresses: string[],
  amounts: Ref<string[]>
) {
  const { t } = useI18n();
  const { getToken } = useTokens();
  const {
    // requiredApprovalState,
    // approveToken,
    // getApprovalForSpender,
    requiredApprovalState,
    approving,
    // computed
    requiredApprovals,
    // methods
    approveToken,
    getApprovalForSpender
  } = useTokenApprovals(tokenAddresses, amounts);
  const { appNetworkConfig } = useWeb3();

  const tokenApprovalActions: TransactionActionInfo[] = getTokenApprovalActions();
  /**
   * METHODS
   */
  async function getTokenApprovalActionsForSpender(
    spender: string,
    amount: string = MaxUint256.toString()
  ) {
    const requiredApprovalStateForSpender = await getApprovalForSpender(
      spender
    );
    const actions = getTokenApprovalActions(
      requiredApprovalStateForSpender,
      spender,
      amount
    );
    return actions;
  }

  function getTokenApprovalActions(
    customApprovalState?: Record<string, ApprovalState>,
    spender: string = appNetworkConfig.addresses.copperProxyV2,
    amount: string = MaxUint256.toString()
  ): TransactionActionInfo[] {
    const approvalStates = customApprovalState || requiredApprovalState.value;
    // debugger

    return Object.keys(approvalStates).map(address => {
      const token = getToken(address);
      const state = approvalStates[address];
      // if have error about symbol: before getToken ,we must have search token and inject,
      // then we can getToken by address
      return {
        label: t(
          spender === appNetworkConfig.addresses.veBAL
            ? 'transactionSummary.approveForLocking'
            : 'transactionSummary.approveForInvesting',
          [token.symbol]
        ),
        loadingLabel: t('investment.preview.loadingLabel.approval'),
        confirmingLabel: t('confirming'),
        stepTooltip: t('investment.preview.tooltips.approval', [token.symbol]),
        action: () => {
          return approveToken(token.address, { spender, state, amount });
        }
      };
    });
  }

  return {
    tokenApprovalActions,
    getTokenApprovalActionsForSpender
  };
}
