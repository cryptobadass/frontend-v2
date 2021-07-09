import homestead from './homestead.json';
import kovan from './kovan.json';
import rinkeby from './rinkeby.json';
import polygon from './polygon.json';
import docker from './docker.json';

export interface Config {
  key: string;
  chainId: number;
  name: string;
  shortName: string;
  network: string;
  unknown: boolean;
  rpc: string;
  publicRpc?: string;
  ws: string;
  explorer: string;
  subgraph: string;
  poolsUrlV1: string;
  poolsUrlV2: string;
  nativeAsset: {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    deeplinkId: string;
    logoURI: string;
  };
  addresses: {
    exchangeProxy: string;
    merkleRedeem: string;
    multicall: string;
    vault: string;
    weightedPoolFactory: string;
    stablePoolFactory: string;
    weth: string;
    balancerHelpers: string;
  };
  strategies: Record<
    string,
    {
      type: string;
      name: string;
    }
  >;
}

const config: Record<string, Config> = {
  '1': homestead,
  '42': kovan,
  '4': rinkeby,
  '137': polygon,
  // @ts-ignore
  '17': docker
};

export default config;
