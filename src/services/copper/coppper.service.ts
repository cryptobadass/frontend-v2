import PoolsService from './pools/pools.service';

export default class CopperService {
  pools: PoolsService;

  constructor() {
    this.pools = new PoolsService();
  }
}

export const copperService = new CopperService();
