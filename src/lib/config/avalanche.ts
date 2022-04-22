import { Config } from './index';

const config: Config = {
  key: '43114',
  chainId: 43114,
  chainName: 'Avalanche C-Chain',
  name: 'Avalanche',
  shortName: 'Avalanche',
  network: 'avalanche',
  portisNetwork: '',
  unknown: false,
  rpc: 'https://api.avax.network/ext/bc/C/rpc',
  ws: 'wss://api.avax.network/ext/bc/C/ws',
  loggingRpc: 'https://api.avax-test.network/ext/bc/C/rpc',
  explorer: 'https://snowtrace.io',
  explorerName: 'Snowtrace',
  subgraph:
    'https://api.thegraph.com/subgraphs/name/leedewyze/balancer-avalanche-v2',
  // poolsUrlV1: '',
  poolsUrlV2: '',
  subgraphs: {
    aave: '',
    gauge: ''
  },
  // etherscan: {
  //   apiKey: '',
  //   apiUrl: 'https://api.snowtrace.io/api'
  // },
  supportsEIP1559: true,
  nativeAsset: {
    name: 'Avalanche',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'AVAX',
    decimals: 18,
    deeplinkId: 'avax',
    logoURI: 'https://cdn.discordapp.com/emojis/902638084779278356.png',
    minTransactionBuffer: '0.005'
  },
  addresses: {
    bFactory: '',
    bActions: '',
    dsProxyRegistry: '',
    exchangeProxy: '',
    merkleRedeem: '',
    merkleOrchard: '',
    multicall: 'todo multicall address here',
    authorizer: 'todo authorizer address here',
    vault: 'todo vault address here',
    weightedPoolFactory: 'todo weightedPoolFactory address here',
    stablePoolFactory: 'todo stablePoolFactory address here',
    tokenFactory: 'todo WeightedPool2TokensFactory',
    weth: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    stETH: '',
    wstETH: '',
    lidoRelayer: '',
    MockFlashLoanReceiver: '',
    balancerHelpers: 'todo balancerHelpers address here',
    batchRelayer: '',
    veBAL: '',
    gaugeController: '',
    gaugeFactory: '',
    balancerMinter: ''
  },
  keys: {
    infura: '',
    alchemy: ''
  },
  strategies: {
    '0': {
      type: '0',
      name: 'stablePool'
    },
    '1': {
      type: '1',
      name: 'weightedPool'
    },
    '2': {
      type: '2',
      name: 'weightedPool'
    }
  },
  supportsElementPools: true
};

export default config;