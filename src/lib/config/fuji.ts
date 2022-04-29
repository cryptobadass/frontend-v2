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
    multicall: '0xC471AFa18cD037a9bb032bE72651Fe3Eaa466eBA',
    authorizer: '0x9eb8055703115C0416Df33C382797907c50187cE',
    vault: '0xF20D313685665bf745B720FE81b927fAFcfB18A2',
    weightedPoolFactory: '0x7700D6F43892ed726c47E899f4cbbB8239D4347E',
    stablePoolFactory: '0x24f9aa126aC08D0B6e682F9E2139F6112D6191F5',
    tokenFactory: '0x01382FB56950655e42C17B73766c80e46b94fD53',
    weth: '0xbAD9016aa18Cf22d08aefd3B86c0D36E8C222B83',
    stETH: '', // metadata.concern.ts?5d42:89 Failed to fetch onchain meta
    wstETH: '', // metadata.concern.ts?5d42:89 Failed to fetch onchain meta
    lidoRelayer: '0x41B953164995c11C81DA73D212ED8Af25741b7Ac',
    MockFlashLoanReceiver: '',
    balancerHelpers: '0xB1ff50B7EFdF16A09626887189f4A2A93ED32570',
    batchRelayer: '0x6bfd48F3873E21F7686982d352b610E1523c218B',
    veBAL: '0xBb57647DBB6E1f6DCa376039b94FCbf4d16D3bfE', //'0x0BA4d28a89b0aB0c48253f4f36B204DE24354651', // metadata.concern.ts?5d42:89 Failed to fetch onchain meta
    gaugeController: '0x28bE1a58A534B281c3A22df28d3720323bfF331D',
    gaugeFactory: '0xd561043759495414813103fD73928edeDbA3a29c',
    balancerMinter: '0xE1008f2871F5f5c3da47f806dEbA3cD83Fe0E55B',
    // first
    // copperProxyV2: '0x4DA66fA19e20C5EFdD053B137d05930156fa99Bf',
    // blockList: '0x3594F6cBf67e3603DF9c8E74f3010A0b4E473457',
    // second
    copperProxyV2: '0x2ac87650654AB7E5Cc8d6369534Bfda023991244',
    blockList: '0xE40fb333D61e90E17013dE523DCCF553BfbEA67D'
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
