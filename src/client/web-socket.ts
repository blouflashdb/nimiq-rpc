import type { JSONRPCError } from "@open-rpc/client-js";
import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface";
import type { RPCData } from "../types/index.ts";
import {
  Client,
  RequestManager,
  WebSocketTransport,
} from "@open-rpc/client-js";

/**
 * Interface representing a subscription.
 */
export interface Subscription {
  /**
   * Closes the subscription.
   */
  close: () => void;

  /**
   * Gets the subscription ID.
   *
   * @returns {number} - The subscription ID.
   */
  getSubscriptionId: () => number;
}

/**
 * Options for configuring the WebSocket client.
 */
export interface WebsocketClientOptions {
  /**
   * Milliseconds before timing out while calling an RPC method.
   */
  callTimeout: number;

  /**
   * Milliseconds between attempts to connect.
   */
  reconnectTimeout: number;

  /**
   * Maximum number of times to try connecting before giving up.
   */
  maxReconnects: number;
}

/**
 * Default options for the WebSocket client.
 */
export const DEFAULT_CLIENT_OPTIONS: WebsocketClientOptions = {
  callTimeout: 30000,
  reconnectTimeout: 3000,
  maxReconnects: 5,
} as const;

/**
 * Options for configuring the WebSocket stream.
 */
export interface WebsocketStreamOptions {
  /**
   * Optional filter function for stream data.
   */
  filter?: FilterStreamFn;
}

/**
 * Default options for the WebSocket stream.
 */
export const DEFAULT_STREAM_OPTIONS: WebsocketStreamOptions = {
  filter: () => true,
} as const;

/**
 * Type definition for a function that filters stream data.
 *
 * @param {any} data - The data to be filtered.
 * @returns {boolean} - Returns true if the data passes the filter, otherwise false.
 */
// deno-lint-ignore no-explicit-any
export type FilterStreamFn = (data: any) => boolean;

/**
 * Interface representing WebSocket callbacks.
 *
 * @template Data - The type of the data.
 * @template Metadata - The type of the metadata.
 */
export interface WebSocketCallbacks<Data, Metadata> {
  /**
   * Callback function to handle errors.
   *
   * @param {JSONRPCError} data - The error data.
   */
  onError?: (data: JSONRPCError) => void;

  /**
   * Callback function to handle messages.
   *
   * @param {RPCData<Data, Metadata>} data - The message data.
   */
  onMessage?: (data: RPCData<Data, Metadata>) => void;

  /**
   * Callback function to handle connection errors.
   *
   * @param {ErrorEvent} error - The connection error.
   */
  onConnectionError?: (error: Error) => void;
}

interface NotificationMessageParams {
  subscription: number;
  result: object;
}

/**
 * WebSocketClient class provides methods to interact with the Nimiq Albatross Node over WebSocket.
 */
export class WebSocketClient {
  private url: URL;

  constructor(url: string) {
    const wsUrl = new URL(url.replace(/^http/, "ws"));
    wsUrl.pathname = "/ws";
    this.url = wsUrl;
  }

  /**
   * Make a raw streaming call to the Albatross Node.
   *
   * @param {Object} request - The request object containing the following properties:
   * @param {string} request.method - The name of the method to call.
   * @param {any[]} request.params - The parameters to pass with the call, if any.
   * @param {WebSocketCallbacks<Data, Metadata>} wsCallbacks - The WebSocket callbacks.
   * @param {WebsocketClientOptions} [options=DEFAULT_CLIENT_OPTIONS] - The streaming options for the call. Defaults to DEFAULT_CLIENT_OPTIONS if not provided.
   * @returns {Promise<Subscription>} - A promise that resolves with a Subscription object.
   *
   * @template Data - The type of the data.
   * @template Metadata - The type of the metadata.
   */
  async subscribe<
    Data,
    Metadata,
  >(
    request: RequestArguments,
    wsCallbacks: WebSocketCallbacks<Data, Metadata>,
    options: WebsocketClientOptions = DEFAULT_CLIENT_OPTIONS,
    streamOptions: WebsocketStreamOptions = DEFAULT_STREAM_OPTIONS,
  ): Promise<Subscription> {
    let client: Client | null = null;
    let disconnects = 0;
    let subscriptionId = 0;
    let forceClose = false;

    function createClient(url: URL): Client {
      const transport = new WebSocketTransport(url.toString());
      const client = new Client(new RequestManager([transport]));

      client.onNotification((event) => {
        const params = event.params as NotificationMessageParams;
        const result = params.result as RPCData<Data, Metadata>;
  
        if (streamOptions.filter && !streamOptions.filter(result.data)) {
          return;
        }
  
        wsCallbacks.onMessage?.(result);
      });
  
      client.onError((error) => {
        wsCallbacks.onError?.(error);
      });
  
      transport.connection.addEventListener("open", () => {
        disconnects = 0;
      });
  
      transport.connection.addEventListener("close", () => {
        if (forceClose) {
          return;
        }
        disconnects++;
        if (disconnects <= options.maxReconnects) {
          setTimeout(() => {
            reconnect(url);
          }, options.reconnectTimeout);
        }
      });
  
      transport.connection.onerror = (event) => {
        wsCallbacks.onConnectionError?.(new Error(event.message));
      };

      return client;
    }

    async function reconnect(url: URL): Promise<void> {
      client?.close();
      client = null;

      subscriptionId = await requestSubscription(url);
    }

    async function requestSubscription(url: URL): Promise<number> {
      if(!client) {
        client = createClient(url);
      }

      return await client.request(request, options.callTimeout);
    }

    subscriptionId = await requestSubscription(this.url);

    const args: Subscription = {
      close: () => {
        forceClose = true;
        client?.close();
      },
      getSubscriptionId: () => subscriptionId
    };

    return args;
  }
}
