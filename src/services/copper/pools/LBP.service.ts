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
    // if (!owner.length) return Promise.reject('No pool owner specified');

    const copperProxyV2Address = configService.network.addresses.copperProxyV2;

    // const tokenAddresses: Address[] = tokens.map((token: PoolSeedToken) => {
    //   return token.tokenAddress;
    // });

    // const seedTokens = this.calculateTokenWeights(tokens);
    // const a = 1;
    // const swapFeeScaled = scale(new BigNumber(a), 18);
    // console.log('aaaaa',swapFeeScaled)
    // debugger
    // poolConfig.

    const params = [poolConfig];
    // debugger;
    return sendTransaction(
      provider,
      copperProxyV2Address,
      copperAbi,
      'createLBP',
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
      // debugger
    }

    // const pool = new Contract(poolAddress, copperAbi, provider);
    // const poolId = await pool.getPoolId(); // can't get poolId

    const poolDetails: CreatePoolReturn = {
      id: '',
      address: poolAddress
    };

    return poolDetails;
  }

  public async initJoin(
    provider: Web3Provider,
    poolId: string,
    sender: Address,
    receiver: Address,
    tokenAddresses: Address[],
    initialBalancesString: string[]
  ): Promise<TransactionResponse> {
    const initUserData = defaultAbiCoder.encode(
      ['uint256', 'uint256[]'],
      [JOIN_KIND_INIT, initialBalancesString]
    );

    const value = this.value(initialBalancesString, tokenAddresses);

    tokenAddresses = this.parseTokensIn(tokenAddresses);

    const joinPoolRequest: JoinPoolRequest = {
      assets: tokenAddresses,
      maxAmountsIn: initialBalancesString,
      userData: initUserData,
      fromInternalBalance: false
    };

    const vaultAddress = configService.network.addresses.vault;
    return sendTransaction(
      provider,
      vaultAddress,
      Vault__factory.abi,
      'joinPool',
      [poolId, sender, receiver, joinPoolRequest],
      { value }
    );
  }

  public calculateTokenWeights(tokens: PoolSeedToken[]): string[] {
    const weights: EPBigNumber[] = tokens.map((token: PoolSeedToken) => {
      const normalizedWeight = new BigNumber(token.weight).multipliedBy(
        new BigNumber(1e16)
      );
      return EPBigNumber.from(normalizedWeight.toString());
    });
    const normalizedWeights = toNormalizedWeights(weights);
    const weightStrings = normalizedWeights.map((weight: EPBigNumber) => {
      return weight.toString();
    });

    return weightStrings;
  }

  private value(amountsIn: string[], tokensIn: string[]): EPBigNumber {
    let value = '0';
    const nativeAsset = configService.network.nativeAsset;

    amountsIn.forEach((amount, i) => {
      if (tokensIn[i] === nativeAsset.address) {
        value = amount;
      }
    });

    return EPBigNumber.from(value);
  }

  private parseTokensIn(tokensIn: string[]): string[] {
    const nativeAsset = configService.network.nativeAsset;

    return tokensIn.map(address =>
      address === nativeAsset.address ? AddressZero : address
    );
  }
  public async poolList(groupId = 1) {
    const response = await request.get(`/api/pools?group_id=${groupId}`);
    return response.data.success ? response.data.result || [] : [];
  }
  public async poolDetail(id: number | string) {
    const response = await request.get(`/api/pool/${id}`);
    // debugger;
    return response.data.success ? response.data.result || {} : {};
  }
  public async saveLBP(data) {
    const response = await request.post('/api/pool/create', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('save create LBP', response);
  }
  public async getToken() {
    const response = await request.get('/api/getToken', {
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // }
    });
    return response.data;
  }
}
