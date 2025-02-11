import type { HttpClient } from '../client/http.ts'
import { DEFAULT_OPTIONS } from '../client/http.ts'
import type { RPCData } from "../types/logs.ts";

interface ZKPStateKebab {
  'latest-header-number': string
  'latest-block-number': number
  'latest-proof'?: string
}

/**
 * ZkpComponentClient class provides methods to interact with the Nimiq Albatross Node's ZKP component.
 */
export class ZkpComponentClient {
  private client: HttpClient

  constructor(http: HttpClient) {
    this.client = http
  }

  /**
   * Returns the latest header number, block number and proof
   * @returns the latest header number, block number and proof
   */
  public getZkpState(options = DEFAULT_OPTIONS): Promise<RPCData<ZKPStateKebab>> {
    return this.client.call<ZKPStateKebab>({ method: 'getZkpState' }, options)
  }
}
