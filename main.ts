import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface";
import type { HttpOptions, HTTPTransportOptions } from "./src/client/http.ts";
import type {
  Subscription,
  WebSocketCallbacks,
  WebsocketClientOptions,
  WebsocketStreamOptions,
} from "./src/client/web-socket.ts";
import type { RPCData } from "./src/types/logs.ts";
import { DEFAULT_OPTIONS, HttpClient } from "./src/client/http.ts";
import {
  DEFAULT_CLIENT_OPTIONS,
  DEFAULT_STREAM_OPTIONS,
  WebSocketClient,
} from "./src/client/web-socket.ts";
import * as Modules from "./src/modules/index.ts";

/**
 * NimiqRPCClient class provides methods to interact with the Nimiq Albatross Node.
 */
export class NimiqRPCClient {
  /**
   * @property {HttpClient} http - The HTTP client instance.
   * @property {WebSocketClient} ws - The WebSocket client instance.
   * @property {Modules.BlockchainClient.BlockchainClient} blockchain - The Blockchain client instance.
   * @property {Modules.BlockchainStream.BlockchainStream} blockchainStreams - The Blockchain streams instance.
   * @property {Modules.ConsensusClient.ConsensusClient} consensus - The Consensus client instance.
   * @property {Modules.MempoolClient.MempoolClient} mempool - The Mempool client instance.
   * @property {Modules.NetworkClient.NetworkClient} network - The Network client instance.
   * @property {Modules.PolicyClient.PolicyClient} policy - The Policy client instance.
   * @property {Modules.ValidatorClient.ValidatorClient} validator - The Validator client instance.
   * @property {Modules.WalletClient.WalletClient} wallet - The Wallet client instance.
   * @property {Modules.ZkpComponentClient.ZkpComponentClient} zkpComponent - The ZKP Component client instance.
   */
  public http: HttpClient;
  public ws: WebSocketClient;
  public blockchain: Modules.BlockchainClient.BlockchainClient;
  public blockchainStreams: Modules.BlockchainStream.BlockchainStream;
  public consensus: Modules.ConsensusClient.ConsensusClient;
  public mempool: Modules.MempoolClient.MempoolClient;
  public network: Modules.NetworkClient.NetworkClient;
  public policy: Modules.PolicyClient.PolicyClient;
  public validator: Modules.ValidatorClient.ValidatorClient;
  public wallet: Modules.WalletClient.WalletClient;
  public zkpComponent: Modules.ZkpComponentClient.ZkpComponentClient;

  /**
   * Creates an instance of the NimiqRPCClient.
   *
   * @param {Object} [options] - The options for configuring the client.
   * @param {string} [options.httpUrl="http://localhost:8648"] - The HTTP URL of the node. Defaults to "http://localhost:8648".
   * @param {string} [options.wsUrl="ws://localhost:8648/ws"] - The WebSocket URL of the node. Defaults to "ws://localhost:8648/ws".
   * @param {HTTPTransportOptions} [options.httpTransportOptions] - The HTTP transport options.
   */
  constructor(
    {
      httpUrl = "http://localhost:8648",
      wsUrl = "ws://localhost:8648/ws?frame=text",
      httpTransportOptions,
    }: {
      httpUrl?: string;
      wsUrl?: string;
      httpTransportOptions?: HTTPTransportOptions;
    } = {},
  ) {
    this.http = new HttpClient(httpUrl, httpTransportOptions);
    this.ws = new WebSocketClient(wsUrl);

    this.blockchain = new Modules.BlockchainClient.BlockchainClient(this.http);
    this.blockchainStreams = new Modules.BlockchainStream.BlockchainStream(
      this.ws,
    );
    this.consensus = new Modules.ConsensusClient.ConsensusClient(
      this.http,
    );
    this.mempool = new Modules.MempoolClient.MempoolClient(this.http);
    this.network = new Modules.NetworkClient.NetworkClient(this.http);
    this.policy = new Modules.PolicyClient.PolicyClient(this.http);
    this.validator = new Modules.ValidatorClient.ValidatorClient(this.http);
    this.wallet = new Modules.WalletClient.WalletClient(this.http);
    this.zkpComponent = new Modules.ZkpComponentClient.ZkpComponentClient(
      this.http,
    );
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
  ): Promise<RPCData<Data, Metadata>> {
    return this.http.call<Data, Metadata>(request, options);
  }

  /**
   * Make a raw streaming call to the Albatross Node.
   *
   * @param request - The request object containing the following properties:
   * @param request.method - The name of the method to call.
   * @param request.params - The parameters to pass with the call, if any.
   * @param wsCallbacks - The WebSocket callbacks.
   * @param options - The WebSocket client options. Defaults to DEFAULT_CLIENT_OPTIONS if not provided.
   * @param streamOptions - The WebSocket stream options. Defaults to DEFAULT_STREAM_OPTIONS if not provided.
   * @returns A promise that resolves with a Subscription object.
   */
  subscribe<
    Data,
    Metadata,
  >(
    request: RequestArguments,
    wsCallbacks: WebSocketCallbacks<Data, Metadata>,
    options: WebsocketClientOptions = DEFAULT_CLIENT_OPTIONS,
    streamOptions: WebsocketStreamOptions<Data> = DEFAULT_STREAM_OPTIONS,
  ): Promise<Subscription> {
    return this.ws.subscribe<Data, Metadata>(
      request,
      wsCallbacks,
      options,
      streamOptions,
    );
  }
}

export * from "./src/client/http.ts";
export * from "./src/client/web-socket.ts";
export * from "./src/modules/index.ts";
export * from "./src/types/index.ts";
export * from "./src/types/logs.ts";
