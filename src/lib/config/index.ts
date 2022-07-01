import homestead from './homestead.json';
import kovan from './kovan.json';
import rinkeby from './rinkeby.json';
import polygon from './polygon.json';
import arbitrum from './arbitrum.json';
import docker from './docker.json';
import test from './test.json';
import fuji from './fuji';
import avalanche from './avalanche';
import { Network } from '@balancer-labs/sdk';
// import { Network } from 'yotei-sdk';

export interface Config {
  key: string;
  chainId: Network | 12345 | 17;
  chainName: string;
  name: string;
  shortName: string;
  network: string;
  portisNetwork?: string;
  unknown: boolean;
  rpc: string;
  publicRpc?: string;
  ws: string;
  loggingRpc: string;
  explorer: string;
  explorerName: string;
  subgraph: string;
  poolsUrlV2: string;
  subgraphs: {
    aave: string;
    gauge: string;
  };
  defaultLaunchpadGroupId?: number;
  supportsEIP1559: boolean;
  supportsElementPools: boolean;
  nativeAsset: {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    deeplinkId: string;
    logoURI: string;
    minTransactionBuffer: string;
  };
  addresses: {
    bFactory?: string;
    bActions?: string;
    dsProxyRegistry?: string;
    merkleRedeem?: string;
    merkleOrchard: string;
    multicall: string;
    authorizer?: string;
    vault: string;
    weightedPoolFactory: string;
    stablePoolFactory: string;
    tokenFactory?: string;
    weth: string;
    stETH: string;
    wstETH: string;
    lidoRelayer: string;
    MockFlashLoanReceiver?: string;
    balancerHelpers: string;
    batchRelayer: string;
    veBAL: string;
    gaugeController: string;
    gaugeFactory: string;
    balancerMinter: string;
    copperProxyV2: string;
    blockList: string;
  };
  keys: {
    infura: string;
    alchemy: string;
  };
  strategies: Record<
    string,
    {
      type: string;
      name: string;
    }
  >;
}

const config: Record<Network | number, Config> = {
  [Network.MAINNET]: homestead,
  [Network.KOVAN]: kovan,
  [Network.RINKEBY]: rinkeby,
  [Network.POLYGON]: polygon,
  [Network.ARBITRUM]: arbitrum,
  [Network.FUJI]: fuji,
  [Network.AVALANCHE]: avalanche,
  12345: test,
  // @ts-ignore
  17: docker
  // 43113: fuji
};

export default config;
