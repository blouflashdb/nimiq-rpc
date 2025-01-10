import type { RequestArguments } from '@open-rpc/client-js/build/ClientInterface'
import type { HttpOptions } from './src/client/http.ts'
import type { StreamOptions, Subscription } from './src/client/web-socket.ts'
import type { RPCData } from './src/types/logs.ts'
import { DEFAULT_OPTIONS, HttpClient } from './src/client/http.ts'
import { WebSocketClient } from './src/client/web-socket.ts'
import * as Modules from './src/modules/index.ts'

export class NimiqRPCClient {
  public http: HttpClient
  public ws: WebSocketClient

  public blockchain: Modules.BlockchainClient.BlockchainClient
  public blockchainStreams: Modules.BlockchainStream.BlockchainStream
  public consensus: Modules.ConsensusClient.ConsensusClient
  public mempool: Modules.MempoolClient.MempoolClient
  public network: Modules.NetworkClient.NetworkClient
  public policy: Modules.PolicyClient.PolicyClient
  public validator: Modules.ValidatorClient.ValidatorClient
  public wallet: Modules.WalletClient.WalletClient
  public zkpComponent: Modules.ZkpComponentClient.ZkpComponentClient

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
  call<Data, Metadata = undefined>(
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
  subscribe<
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

export * from './src/client/http.ts'
export * from './src/client/web-socket.ts'
export * from './src/modules/index.ts'
export * from './src/types/index.ts'
export * from './src/types/logs.ts'
