import { configService } from '@/services/config/config.service';

export const NATIVE_ASSET_ADDRESS = configService.network.nativeAsset.address;
export const DEFAULT_TOKEN_DECIMALS = 18;

export const TOKENS = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'AAVE', 'WETH']
  },
  AddressMap: {
    '1': {
      WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      BAL: '0xba100000625a3754423978a60c9317c58a424e3d'
    },
    '42': {
      WETH: '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1',
      BAL: '0x41286Bb1D3E870f3F750eB7E1C25d7E48c8A1Ac7'
    },
    '137': {
      WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      BAL: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3'
    },
    '42161': {
      WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      BAL: '0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8'
    },
    '43113': {
      WETH: '0xbAD9016aa18Cf22d08aefd3B86c0D36E8C222B83',
      BAL: '0xE00Bf4d40670FCC1DcB3A757ebccBe579f372fbc'
    }
  },
  Prices: {
    ChainMap: {
      /**
       * Addresses must be lower case and map from kovan to mainnet, e.g
       * [kovan address]: mainnet address
       */
      '42': {
        '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1':
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        '0x1c8e3bcb3378a443cc591f154c5ce0ebb4da9648':
          '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        '0x41286bb1d3e870f3f750eb7e1c25d7e48c8a1ac7':
          '0xba100000625a3754423978a60c9317c58a424e3d',
        '0x8f4bebf498cc624a0797fe64114a6ff169eee078':
          '0xbc396689893d065f41bc2c6ecbee5e0085233447',
        '0xaf9ac3235be96ed496db7969f60d354fe5e426b0':
          '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        // USDC
        '0xc2569dd7d0fd715b054fbf16e75b001e5c0c1115':
          '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0x04df6e4121c27713ed22341e7c7df330f56f289b':
          '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0x4803bb90d18a1cb7a2187344fe4feb0e07878d05':
          '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        // AAVE DAI
        '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd':
          '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
        // AAVE USDC
        '0xe22da380ee6b445bb8273c81944adeb6e8450422':
          '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        // AAVE USDT
        '0x13512979ade267ab5100878e2e0f485b568328a4':
          '0xdac17f958d2ee523a2206206994597c13d831ec7' // USDT
      },
      // Avalanche Fuji
      '43113': {
        '0xbad9016aa18cf22d08aefd3b86c0d36e8c222b83':
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WAVAX -> WETH
        '0x009aea38962dcbcc1d9b48919d7ec030959520a4':
          '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
        '0xe00bf4d40670fcc1dcb3a757ebccbe579f372fbc':
          '0xba100000625a3754423978a60c9317c58a424e3d', // BAL
        '0xfad1257bd61131b6bb60bee08289167099014ac6':
          '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        '0x0ea185018f0ca3f8c545424d27be300b22ee31d4':
          '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
        '0x08d707c1ddea1a46d568926d168ee7be7ea8c06b':
          '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        '0xed7f146612c8d2e8e101b8b5b8c58b8e70e99149':
          '0x476c5e26a75bd202a9683ffd34359c0cc15be0ff', // aMock -> SRM
        '0xd421434752e64468488b0e252f90cc08759e542d':
          '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', // bMock -> AAVE
        '0x64fb55d037bf2fe3d7fc314f78e6124de8c0c7f3':
          '0xc00e94cb662c3520282e6f5717214004a7f26888', // cMock -> COMP
        '0x286ea60cb66ba7647c8143c5d467594b92a3734c':
          '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI.e -> UNI
        '0xea6a8f1ae564070f7f3fa6180678ea6744a1e01a':
          '0x514910771af9ca656af840dff83e8264ecf986ca' // ChainLink
      }
    },
    // TODO - remove once coingecko supports wstETH
    ExchangeRates: {
      wstETH: {
        stETH: 1.0352
      }
    }
  }
};
