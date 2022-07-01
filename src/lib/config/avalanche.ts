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
    'https://node-us.yotei.finance/subgraphs/name/balancer-labs/balancer-avalanche-v2',
  // poolsUrlV1: '',
  poolsUrlV2: '',
  subgraphs: {
    aave: '',
    gauge: ''
  },
  defaultLaunchpadGroupId: 1,
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
    merkleOrchard: '0x7Db6b06e59Caf9510352f6363cc304935c0E0897', // used
    multicall: '0x0d961d4108E946177a532803485325A36F84ACb3', // used
    authorizer: '0x6ecfC8296DC4EfAe1206b3f13E36dE8b9CB1246C',
    vault: '0xE6203163FD8955137837DbD447CD9c2072fA467F', // used
    weightedPoolFactory: '0xfddaef3599EaD4eF6ea4235513d1FB84c26A1B67', // used
    stablePoolFactory: '0x680AD6aD23D8B90A3cDDa9b0298618289C05C467',
    tokenFactory: '',
    weth: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
    stETH: '', // metadata.concern.ts?5d42:89 Failed to fetch onchain meta used (unInject)
    wstETH: '', // metadata.concern.ts?5d42:89 Failed to fetch onchain meta used (unInject)
    lidoRelayer: '',
    MockFlashLoanReceiver: '',
    balancerHelpers: '0x9CE3D74dB7EA7f43A38E300Ea93e79077486CCc2',
    batchRelayer: '', // used but route blocked
    veBAL: '0xBb57647DBB6E1f6DCa376039b94FCbf4d16D3bfE', //'0x0BA4d28a89b0aB0c48253f4f36B204DE24354651', // metadata.concern.ts?5d42:89 Failed to fetch onchain meta
    gaugeController: '', // used (we not use)
    gaugeFactory: '', // used (we not use)
    balancerMinter: '', // used (we not use)
    // first
    // copperProxyV2: '0x4DA66fA19e20C5EFdD053B137d05930156fa99Bf',
    // blockList: '0x3594F6cBf67e3603DF9c8E74f3010A0b4E473457',
    // second
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
