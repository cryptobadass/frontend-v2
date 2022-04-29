import LBPService from './LBP.service';

export default class PoolsService {
  lbp: LBPService;

  constructor() {
    this.lbp = new LBPService();
  }
}

export const poolsService = new PoolsService();
