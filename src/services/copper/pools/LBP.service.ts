import {
  Vault__factory,
  WeightedPoolFactory__factory,
  WeightedPool__factory
} from '@balancer-labs/typechain';
import { Contract } from '@ethersproject/contracts';
import {
  JsonRpcProvider,
  TransactionResponse,
  Web3Provider
} from '@ethersproject/providers';
import { configService } from '@/services/config/config.service';
import BigNumber from 'bignumber.js';
import { BigNumber as EPBigNumber } from '@ethersproject/bignumber';
import { callStatic, sendTransaction } from '@/lib/utils/balancer/web3';
import { defaultAbiCoder } from '@ethersproject/abi';
import { AddressZero } from '@ethersproject/constants';
import { PoolSeedToken } from '@/composables/pools/usePoolCreation';
import { toNormalizedWeights } from '@balancer-labs/balancer-js';
import { scale } from '@/lib/utils';
import TOPICS from '@/constants/topics';
import copperAbi from '@/lib/abi/Copper.json';
import request from '@/lib/utils/request';
import { FullPoolCopper } from '@/services/balancer/subgraph/types';
import { Country } from '@/composables/useCountries';

type Address = string;

export interface CreatePoolReturn {
  id: string;
  address: Address;
}

const JOIN_KIND_INIT = 0;

export interface JoinPoolRequest {
  assets: Address[];
  maxAmountsIn: string[];
  userData: any;
  fromInternalBalance: boolean;
}

export default class LBPService {
  public async create(
    provider: Web3Provider,
    poolConfig
  ): Promise<TransactionResponse> {
    const copperProxyV2Address = configService.network.addresses.copperProxyV2;

    const params = [poolConfig];
    return sendTransaction(
      provider,
      copperProxyV2Address,
      copperAbi,
      'createLBP',
      params
    );
  }
  public async setSwapEnabled(
    provider: Web3Provider,
    pool,
    swapEnabled
  ): Promise<TransactionResponse> {
    const copperProxyV2Address = configService.network.addresses.copperProxyV2;
    const params = [pool, swapEnabled];
    return sendTransaction(
      provider,
      copperProxyV2Address,
      copperAbi,
      'setSwapEnabled',
      params
    );
  }

  public async exitPool(
    provider: Web3Provider,
    pool
  ): Promise<TransactionResponse> {
    const copperProxyV2Address = configService.network.addresses.copperProxyV2;
    const params = [pool, 0, true];

    return sendTransaction(
      provider,
      copperProxyV2Address,
      copperAbi,
      'exitPool',
      params
    );
  }

  public async details(
    provider: Web3Provider | JsonRpcProvider,
    createHash: string
  ): Promise<CreatePoolReturn> {
    const receipt: any = await provider.getTransactionReceipt(createHash);
    let poolAddress;
    if (receipt.events) {
      const events = receipt.events.filter(e => e.event === 'PoolCreated');
      if (events.length > 0 && events[0].args.length > 0) {
        poolAddress = events[0].args[0];
      }
    }

    if (!poolAddress) {
      const logs = receipt.logs.filter(
        l => l.topics?.length > 0 && l.topics[0] === TOPICS.PoolCreated
      );
      poolAddress = logs[0].address;
    }

    const pool = new Contract(poolAddress, WeightedPool__factory.abi, provider);
    const poolId = await pool.getPoolId();

    const poolDetails: CreatePoolReturn = {
      id: poolId,
      address: poolAddress
    };

    return poolDetails;
  }

  public async getPoolData(provider: Web3Provider, id) {
    const copperProxyV2Address = configService.network.addresses.copperProxyV2;

    const poolData = await callStatic(
      provider,
      copperProxyV2Address,
      copperAbi,
      'getPoolData',
      [id]
    );
    return poolData;
  }
  public async poolList(groupId = 1, currentPage = 1, pageSize = 10) {
    const data = await request.get<
      null,
      { success: boolean; result: Array<any> }
    >(
      `/api/pools?group_id=${groupId}&current_page=${currentPage}&page_size=${pageSize}`
    );
    return data.success ? data.result || [] : [];
  }
  public async poolDetail(id: number | string) {
    const response = await request.get<
      any,
      { result: FullPoolCopper; success: boolean }
    >(`/api/pool/${id}`);

    return response.result;
  }
  public saveLBP(data) {
    request.post('/api/pool/create', data).finally(() => {
      console.log('save create LBP finally');
    });
  }
  public async getToken() {
    const response = await request({
      url: '/api/getToken',
      method: 'GET'
    });
    return response.data;
  }
  public async getCountries() {
    const response = await request.get<
      any,
      { count: number; result: Array<Country> }
    >('/api/countries');
    return response.result;
  }
}
