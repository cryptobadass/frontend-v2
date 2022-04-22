import { Config } from './index';

const config: Config = {
  key: '43113',
  chainId: 43113,
  chainName: 'Avalanche FUJI C-Chain',
  name: 'Avalanche Fuji',
  shortName: 'Fuji',
  network: 'fuji',
  portisNetwork: '',
  unknown: false,
  rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
  ws: 'wss://api.avax-test.network/ext/bc/C/ws',
  loggingRpc: 'https://api.avax-test.network/ext/bc/C/rpc',
  explorer: 'https://testnet.snowtrace.io',
  explorerName: 'Snowtrace',
  subgraph:
    'https://api.thegraph.com/subgraphs/name/leedewyze/balancer-fuji-v2',
  // poolsUrlV1: '',
  poolsUrlV2: '',
  subgraphs: {
    aave: '',
    gauge: ''
  },
  // etherscan: {
  //   apiKey: '',
  //   apiUrl: 'https://api-testnet.snowtrace.io/api'
  // },

  supportsEIP1559: true,
  nativeAsset: {
    name: 'Avalanche',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'AVAX',
    decimals: 18,
    deeplinkId: 'avax',
    logoURI: 'https://cdn.discordapp.com/emojis/902638084779278356.png',
    minTransactionBuffer: '0.5'
  },
  addresses: {
    bFactory: '0x8f7F78080219d4066A8036ccD30D588B416a40DB',
    bActions: '0x02EFDB542B9390ae7C1620B29674e02F9c0d86CC',
    dsProxyRegistry: '0x130767E0cf05469CF11Fa3fcf270dfC1f52b9072',
    exchangeProxy: '0x3bc73D276EEE8cA9424Ecb922375A0357c1833B3',
    merkleRedeem: '0x3bc73D276EEE8cA9424Ecb922375A0357c1833B3',
    merkleOrchard: '0xc33e0fE411322009947931c32d2273ee645cDb5B',
    multicall: '0x0d961d4108E946177a532803485325A36F84ACb3',
    authorizer: '0x6ecfC8296DC4EfAe1206b3f13E36dE8b9CB1246C',
    vault: '0xE6203163FD8955137837DbD447CD9c2072fA467F',
    weightedPoolFactory: '0xfddaef3599EaD4eF6ea4235513d1FB84c26A1B67',
    stablePoolFactory: '0x680AD6aD23D8B90A3cDDa9b0298618289C05C467',
    tokenFactory: '0x5A0A5d8eC8f8ed493d6FE4c2BAc188e8d3ecf263',
    weth: '0xbAD9016aa18Cf22d08aefd3B86c0D36E8C222B83',
    stETH: '', // metadata.concern.ts?5d42:89 Failed to fetch onchain meta
    wstETH: '', // metadata.concern.ts?5d42:89 Failed to fetch onchain meta
    lidoRelayer: '0x41B953164995c11C81DA73D212ED8Af25741b7Ac',
    MockFlashLoanReceiver: '',
    balancerHelpers: '0x9CE3D74dB7EA7f43A38E300Ea93e79077486CCc2',
    batchRelayer: '0x6bfd48F3873E21F7686982d352b610E1523c218B',
    veBAL: '0xBb57647DBB6E1f6DCa376039b94FCbf4d16D3bfE', //'0x0BA4d28a89b0aB0c48253f4f36B204DE24354651', // metadata.concern.ts?5d42:89 Failed to fetch onchain meta
    gaugeController: '0x28bE1a58A534B281c3A22df28d3720323bfF331D',
    gaugeFactory: '0xd561043759495414813103fD73928edeDbA3a29c',
    balancerMinter: '0xE1008f2871F5f5c3da47f806dEbA3cD83Fe0E55B'
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
