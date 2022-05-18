import Service from '../../balancer-subgraph.service';
import queryBuilder from './query';
import { LBPDetail, QueryBuilder } from '../../types';

export default class PoolActivities {
  service: Service;
  query: QueryBuilder;

  constructor(service: Service, query: QueryBuilder = queryBuilder) {
    this.service = service;
    this.query = query;
  }

  public async get(args = {}, attrs = {}): Promise<LBPDetail[]> {
    const query = this.query(args, attrs);
    const { pools } = await this.service.client.get(query);
    return pools; //this.serializeActivity(pools);
  }

  serializeActivity(pools: LBPDetail[]) {
    return pools.map(pool => ({
      ...pool,
      // createTime: pool.createTime * 1000
    }));
  }
}
