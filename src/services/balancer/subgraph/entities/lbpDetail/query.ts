import { merge } from 'lodash';

const defaultArgs = {
  where: {
    poolType: 'LiquidityBootstrapping'
  }
};

const defaultAttrs = {
  id: true,
  address: true,
  strategyType: true,
  symbol: true,
  name: true,
  swapEnabled: true,
  swapFee: true,
  owner: true,
  totalWeight: true,
  totalSwapVolume: true,
  totalSwapFee: true,
  totalLiquidity: true,
  createTime: true,
  swapsCount: true,
  holdersCount: true,
  tx: true,
  tokensList: true,
  tokens: {
    symbol: true,
    name: true,
    address: true,
    weight: true,
    priceRate: true,
    balance: true
  },
  weightUpdates: {
    startTimestamp: true,
    endTimestamp: true,
    startWeights: true,
    endWeights: true
  }
};

export default (args = {}, attrs = {}) => ({
  pools: {
    __args: merge({}, defaultArgs, args),
    ...merge({}, defaultAttrs, attrs)
  }
});
