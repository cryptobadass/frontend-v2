import { merge } from 'lodash';

const defaultArgs = {
  // first: 10,
  // orderBy: 'timestamp',
  // orderDirection: 'desc'
};

const defaultAttrs = {
  // tokenIn: true,
  // tokenOut: true,
  // caller: true,
  // tokenAmountIn: true,
  // tokenAmountOut: true,
  // tokenInSym: true,
  // tokenOutSym: true,
  // tx: true,
  // timestamp: true,
  // userAddress: {
  //   id: true
  // }
};

export default (args = {}, attrs = {}) => ({
  pools: {
    __args: merge({}, defaultArgs, args),
    ...merge({}, defaultAttrs, attrs)
  }
});
