import Service from '../../balancer-subgraph.service';
import queryBuilder from './query';
import { FullPoolCopper, QueryBuilder } from '../../types';

export default class PoolActivities {
  service: Service;
  query: QueryBuilder;

  constructor(service: Service, query: QueryBuilder = queryBuilder) {
    this.service = service;
    this.query = query;
  }

  public async get(args = {}, attrs = {}): Promise<FullPoolCopper[]> {
    const query = this.query(args, attrs);
    const { joinExits } = await this.service.client.get(query);
    return joinExits; //this.serializeActivity(pools);
  }

  serializeActivity(pools: FullPoolCopper[]) {
    return pools.map(pool => ({
      ...pool,
      // createTime: pool.createTime * 1000
    }));
  }
}
