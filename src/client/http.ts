import type { RequestArguments } from '@open-rpc/client-js/build/ClientInterface'
import type { IJSONRPCResponse } from '@open-rpc/client-js/build/Request'
import type { RPCData } from '../types/index.ts'
import { Client, HTTPTransport, JSONRPCError, RequestManager } from '@open-rpc/client-js'

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

export class HttpClient {
  private client: Client

  constructor(url: string) {
    const transport = new HTTPTransport(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client = new Client(new RequestManager([transport]))
  }

  async call<
    Data,
    Metadata = undefined,
  >(
    request: RequestArguments,
    options: HttpOptions,
  ): Promise<RPCData<Data, Metadata> | Error> {
    try {
      const result = await this.client.request(request, options.timeout)
      const data = result as IJSONRPCResponse
      return data.result as RPCData<Data, Metadata>
    }
    catch (error: unknown) {
      if (error instanceof JSONRPCError) {
        return new Error(error.message)
      }
      return new Error('Unknown error')
    }
  }
}
