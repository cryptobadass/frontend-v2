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
    },
    '43114': {
      WETH: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
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
        '0xbAD9016aa18Cf22d08aefd3B86c0D36E8C222B83':
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WAVAX -> WETH
        '0x009aEA38962dcbcC1D9b48919D7ec030959520a4':
          '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
        '0xE00Bf4d40670FCC1DcB3A757ebccBe579f372fbc':
          '0xba100000625a3754423978a60c9317c58a424e3D', // BAL
        '0xfAD1257Bd61131b6Bb60BEE08289167099014Ac6':
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        '0x0eA185018F0cA3f8c545424d27bE300B22EE31D4':
          '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
        '0x08D707C1ddEA1a46d568926D168EE7Be7ea8C06B':
          '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
        '0xed7F146612C8d2e8E101b8b5B8C58b8E70E99149':
          '0x476c5E26a75bd202a9683ffD34359C0CC15be0fF', // aMock -> SRM
        '0xD421434752e64468488B0e252f90Cc08759E542D':
          '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // bMock -> AAVE
        '0x64FB55d037BF2fE3d7FC314f78E6124DE8C0C7F3':
          '0xc00e94Cb662C3520282E6f5717214004A7f26888', // cMock -> COMP
        '0x286EA60Cb66ba7647C8143c5d467594B92A3734C':
          '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI.e -> UNI
        '0xeA6a8f1aE564070F7F3fa6180678ea6744A1E01A':
          '0x514910771AF9Ca656af840dff83E8264EcF986CA' // ChainLink
      },
      '43114': {
        // WAVAX
        '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7':
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', //  -> WETH
        // WBTC.e
        '0x50b7545627a5162F82A992c33b87aDc75187B218':
          '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // ->WBTC
        // USDC
        '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E':
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        //  DAI.e
        '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70':
          '0x6B175474E89094C44Da98b954EedeAC495271d0F', // -> DAI
        // UNI.e
        '0x8eBAf22B6F053dFFeaf46f4Dd9eFA95D89ba8580':
          '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', //  -> UNI
        // LINK.e
        '0x5947BB275c521040051D82396192181b413227A3':
          '0x514910771AF9Ca656af840dff83E8264EcF986CA' // -> LINK
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
