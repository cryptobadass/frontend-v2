import axios from 'axios';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { configService as _configService } from '@/services/config/config.service';

export default class BalancerSubgraphClient {
  url: string;

  constructor(private readonly configService = _configService) {
    this.url = configService.network.subgraph;
  }

  public async get(query) {
    try {
      console.log('ssss', query, this.url);
      const payload = this.toPayload(query);
      const {
        data: { data }
      } = await axios.post(this.url, payload);
      console.log('ssss_s', data)
      return data;
    } catch (error) {
      console.log('ssss_er', error)
      console.error(error);
    }
  }

  public toPayload(query) {
    return JSON.stringify({ query: jsonToGraphQLQuery({ query }) });
  }
}

export const balancerSubgraphClient = new BalancerSubgraphClient();
