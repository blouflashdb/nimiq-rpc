import type { HttpClient } from '../client/http.ts'
import { DEFAULT_OPTIONS } from '../client/http.ts'

interface ZKPStateKebab {
  'latest-header-number': string
  'latest-block-number': number
  'latest-proof'?: string
}

export class ZkpComponentClient {
  private client: HttpClient

  constructor(http: HttpClient) {
    this.client = http
  }

  /**
   * Returns the latest header number, block number and proof
   * @returns the latest header number, block number and proof
   */
  public getZkpState(options = DEFAULT_OPTIONS) {
    return this.client.call<ZKPStateKebab>({ method: 'getZkpState' }, options)
  }
}
