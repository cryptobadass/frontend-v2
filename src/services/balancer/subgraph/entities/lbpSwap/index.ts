import { getAddress } from '@ethersproject/address';

import Service from '../../balancer-subgraph.service';
import { PoolSwap, QueryBuilder } from '../../types';

import queryBuilder from './query';
import { toJsTimestamp } from '@/composables/useTime';

export default class LBPSwaps {
  service: Service;
  query: QueryBuilder;

  constructor(service: Service, query: QueryBuilder = queryBuilder) {
    this.service = service;
    this.query = query;
  }

  public async get(args = {}, attrs = {}): Promise<PoolSwap[]> {
    const query = this.query(args, attrs);

    const { pools } = await this.service.client.get(query);

    return pools[0].swaps || [];
  }

  serialize(swaps: PoolSwap[]) {
    return swaps.map(swap => ({
      ...swap,
      tokenIn: getAddress(swap.tokenIn),
      tokenOut: getAddress(swap.tokenOut),
      timestamp: toJsTimestamp(swap.timestamp)
    }));
  }
}
