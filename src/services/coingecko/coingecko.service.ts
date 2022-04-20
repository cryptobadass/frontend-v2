import { SUPPORTED_FIAT } from '@/constants/currency';
import { PriceService } from './api/price.service';
import { coingeckoClient } from './coingecko.client';

export const getNativeAssetId = (chainId: string): string => {
  // https-//api.coingecko.com/api/v3/coins/list.json
  const mapping = {
    '1': 'ethereum',
    '42': 'ethereum',
    '137': 'matic-network',
    '42161': 'ethereum',
    '43113': 'fuji',
    '43114': 'avalanche-2'
  };
  // avalanche-2
  return mapping[chainId] || 'avalanche-2';
};

export const getPlatformId = (chainId: string): string => {
  // https-//api.coingecko.com/api/v3/asset_platforms.json
  const mapping = {
    '1': 'ethereum',
    '42': 'ethereum',
    '137': 'polygon-pos',
    '42161': 'arbitrum-one',
    '43113': 'avalanche',
    '43114': 'avalanche'
  };
  // avalanche-2
  return mapping[chainId] || 'avalanche';
};

export class CoingeckoService {
  supportedFiat: string;
  prices: PriceService;

  constructor(
    public readonly client = coingeckoClient,
    priceServiceClass = PriceService
  ) {
    this.supportedFiat = SUPPORTED_FIAT.join(',');
    this.prices = new priceServiceClass(this);
  }
}

export const coingeckoService = new CoingeckoService();
