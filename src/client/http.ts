import type { RequestArguments } from '@open-rpc/client-js/build/ClientInterface'
import type { RPCData } from '../types/index.ts'
import { Client, HTTPTransport, RequestManager } from '@open-rpc/client-js'

export interface HttpOptions {
  timeout?: number // in ms
}

export type SendTxCallOptions = HttpOptions & ({
  waitForConfirmationTimeout?: number // in ms
})

export const DEFAULT_OPTIONS: HttpOptions = {
  timeout: 10_000,
}

export const DEFAULT_TIMEOUT_CONFIRMATION: number = 10_000

export const DEFAULT_OPTIONS_SEND_TX: SendTxCallOptions = {
  timeout: DEFAULT_TIMEOUT_CONFIRMATION,
}

export interface HTTPTransportOptions {
  headers?: Record<string, string>;
  // deno-lint-ignore no-explicit-any
  fetcher?: any;
}

/**
 * HttpClient class provides methods to interact with the Nimiq Albatross Node over HTTP.
 */
export class HttpClient {
  private client: Client

  /**
   * Creates an instance of the HTTP client.
   * 
   * @param {string} url - Node URL
   * @param {HTTPTransportOptions} [options] - Optional HTTP transport options
   */
  constructor(url: string, options?: HTTPTransportOptions) {
    const transport = new HTTPTransport(url, {
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
      fetcher: options?.fetcher,
    })

    this.client = new Client(new RequestManager([transport]))
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
  call<
    Data,
    Metadata = undefined,
  >(
    request: RequestArguments,
    options: HttpOptions,
  ): Promise<RPCData<Data, Metadata>> {
    return this.client.request(request, options.timeout)
  }
}
