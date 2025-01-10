import type { HttpClient } from '../client/http.ts'
import { DEFAULT_OPTIONS } from '../client/http.ts'
import type { RPCData } from "../types/logs.ts";

export class NetworkClient {
  private client: HttpClient

  constructor(http: HttpClient) {
    this.client = http
  }

  /**
   * The peer ID for our local peer.
   */
  public getPeerId(options = DEFAULT_OPTIONS): Promise<Error | RPCData<string>> {
    return this.client.call<string>({ method: 'getPeerId' }, options)
  }

  /**
   * Returns the number of peers.
   */
  public getPeerCount(options = DEFAULT_OPTIONS): Promise<Error | RPCData<number>> {
    return this.client.call<number>({ method: 'getPeerCount' }, options)
  }

  /**
   * Returns a list with the IDs of all our peers.
   */
  public getPeerList(options = DEFAULT_OPTIONS): Promise<Error | RPCData<string[]>> {
    return this.client.call<string[]>({ method: 'getPeerList' }, options)
  }
}
