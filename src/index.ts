import type { RequestArguments } from '@open-rpc/client-js/build/ClientInterface'
import type { HttpOptions } from './client/http'
import type { StreamOptions, Subscription } from './client/web-socket'
import type { RPCData } from './types/logs'
import { DEFAULT_OPTIONS, HttpClient } from './client/http'
import { WebSocketClient } from './client/web-socket'
import * as Modules from './modules'

export class NimiqRPCClient {
  public http: HttpClient
  public ws: WebSocketClient

  public blockchain
  public blockchainStreams
  public consensus
  public mempool
  public network
  public policy
  public validator
  public wallet
  public zkpComponent

  /**
   * @param url Node URL
   */
  constructor(url: string) {
    this.http = new HttpClient(url)
    this.ws = new WebSocketClient(url)

    this.blockchain = new Modules.BlockchainClient.BlockchainClient(this.http)
    this.blockchainStreams = new Modules.BlockchainStream.BlockchainStream(
      this.ws,
    )
    this.consensus = new Modules.ConsensusClient.ConsensusClient(
      this.http,
    )
    this.mempool = new Modules.MempoolClient.MempoolClient(this.http)
    this.network = new Modules.NetworkClient.NetworkClient(this.http)
    this.policy = new Modules.PolicyClient.PolicyClient(this.http)
    this.validator = new Modules.ValidatorClient.ValidatorClient(this.http)
    this.wallet = new Modules.WalletClient.WalletClient(this.http)
    this.zkpComponent = new Modules.ZkpComponentClient.ZkpComponentClient(this.http)
  }

  /**
   * Make a raw call to the Albatross Node.
   *
   * @param request - The request object containing the following properties:
   * @param request.method - The name of the method to call.
   * @param request.params - The parameters to pass with the call, if any.
   * @param options - The HTTP options for the call. Defaults to DEFAULT_OPTIONS if not provided.
   * @returns A promise that resolves with the result of the call, which includes data and optionally metadata.
   */
  async call<Data, Metadata = undefined>(
    request: RequestArguments,
    options: HttpOptions = DEFAULT_OPTIONS,
  ): Promise<RPCData<Data, Metadata> | Error> {
    return this.http.call<Data, Metadata>(request, options)
  }

  /**
   * Make a raw streaming call to the Albatross Node.
   *
   * @param request
   * @param userOptions
   * @returns A promise that resolves with a Subscription object.
   */
  async subscribe<
    Data,
    Metadata,
  >(
    request: RequestArguments,
    userOptions: StreamOptions,
  ): Promise<Subscription<Data, Metadata>> {
    return this.ws.subscribe<Data, Metadata>(request, userOptions)
  }
}

let client: NimiqRPCClient
export function createClient(url: string): NimiqRPCClient {
  if (client)
    return client
  client = new NimiqRPCClient(url)
  return client
}

export * from './client/http'
export * from './client/web-socket'
export * from './modules'
export * from './types/'
export * from './types/logs'
