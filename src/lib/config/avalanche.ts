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
  loggingRpc: 'https://api.avax.network/ext/bc/C/rpc',
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
    multicall: '0x0d961d4108E946177a532803485325A36F84ACb3',
    authorizer: '0x6ecfC8296DC4EfAe1206b3f13E36dE8b9CB1246C',
    vault: '0xE6203163FD8955137837DbD447CD9c2072fA467F',
    weightedPoolFactory: '0xfddaef3599EaD4eF6ea4235513d1FB84c26A1B67',
    stablePoolFactory: '0x680AD6aD23D8B90A3cDDa9b0298618289C05C467',
    tokenFactory: '0x5A0A5d8eC8f8ed493d6FE4c2BAc188e8d3ecf263',
    weth: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    stETH: '',
    wstETH: '',
    lidoRelayer: '',
    MockFlashLoanReceiver: '',
    balancerHelpers: '0x9CE3D74dB7EA7f43A38E300Ea93e79077486CCc2',
    batchRelayer: '',
    veBAL: '0xBb57647DBB6E1f6DCa376039b94FCbf4d16D3bfE',
    gaugeController: '',
    gaugeFactory: '',
    balancerMinter: '',
    copperProxyV2: '0x16B7913B4d63a99e298a0bBE4f120AfB6A3932d8',
    blockList: '0xD008286A21b29bb0cDb85ab2449A28CEC448Eb69'
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
