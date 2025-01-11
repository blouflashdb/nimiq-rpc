import { DEFAULT_CLIENT_OPTIONS, DEFAULT_STREAM_OPTIONS, type WebsocketClientOptions, type WebsocketStreamOptions, type FilterStreamFn, type Subscription, type WebSocketCallbacks, type WebSocketClient } from '../client/web-socket.ts'
import type { Block, BlockchainState, LogType, MacroBlock, MicroBlock, Validator } from '../types/index.ts'
import type { BlockLog } from '../types/logs.ts'
import { BlockSubscriptionType, RetrieveType } from '../types/index.ts'

export interface BlockParams { retrieve?: RetrieveType.Full | RetrieveType.Partial }
export interface ValidatorElectionParams { address: string }
export interface LogsParams { addresses?: string[], types?: LogType[] }

function getBlockType(block: Block): BlockSubscriptionType {
  if (!block)
    throw new Error('Block is undefined')
  if (!('isElectionBlock' in block))
    return BlockSubscriptionType.Micro
  if (block.isElectionBlock)
    return BlockSubscriptionType.Election
  return BlockSubscriptionType.Macro
}

const isMicro: FilterStreamFn = b => getBlockType(b) === BlockSubscriptionType.Micro
const isMacro: FilterStreamFn = b => getBlockType(b) === BlockSubscriptionType.Macro
const isElection: FilterStreamFn = b => getBlockType(b) === BlockSubscriptionType.Election

/**
 * BlockchainStream class provides methods to interact with the Nimiq Albatross Node's blockchain streams.
 */
export class BlockchainStream {
  ws: WebSocketClient
  constructor(ws: WebSocketClient) {
    this.ws = ws
  }

  /**
   * Subscribes to block hash events.
   *
   * @param wsCallbacks - The WebSocket callbacks.
   * @param options - Optional WebSocket client options.
   * @param streamOptions - Optional WebSocket stream options.
   * @returns A promise that resolves with a Subscription object.
   */
  public subscribeForBlockHashes<T = string, M = undefined>(
    wsCallbacks: WebSocketCallbacks<T, M>,
    options: WebsocketClientOptions = DEFAULT_CLIENT_OPTIONS,
    streamOptions: WebsocketStreamOptions = DEFAULT_STREAM_OPTIONS,
  ): Promise<Subscription> {
    return this.ws.subscribe<T, M>({ method: 'subscribeForHeadBlockHash' }, wsCallbacks, options, streamOptions)
  }

  /**
   * Subscribes to election blocks.
   *
   * @param params - The block parameters.
   * @param wsCallbacks - The WebSocket callbacks.
   * @param options - Optional WebSocket client options.
   * @returns A promise that resolves with a Subscription object.
   */
  public subscribeForElectionBlocks<T = Block, M = undefined>(
    params: BlockParams = {},
    wsCallbacks: WebSocketCallbacks<T, M>,
    options: WebsocketClientOptions = DEFAULT_CLIENT_OPTIONS
  ): Promise<Subscription> {
    const { retrieve = RetrieveType.Full } = params
    return this.ws.subscribe<T, M>({ method: 'subscribeForHeadBlock', params: [retrieve === RetrieveType.Full] }, wsCallbacks, options, { filter: isElection })
  }

  /**
   * Subscribes to micro blocks.
   *
   * @param params - The block parameters.
   * @param wsCallbacks - The WebSocket callbacks.
   * @param options - Optional WebSocket client options.
   * @returns A promise that resolves with a Subscription object.
   */
  public subscribeForMicroBlocks<T = MicroBlock, M = undefined>(
    params: BlockParams = {},
    wsCallbacks: WebSocketCallbacks<T, M>,
    options: WebsocketClientOptions = DEFAULT_CLIENT_OPTIONS
  ): Promise<Subscription> {
    const { retrieve = RetrieveType.Full } = params
    return this.ws.subscribe<T, M>({ method: 'subscribeForHeadBlock', params: [retrieve === RetrieveType.Full] }, wsCallbacks, options, { filter: isMicro })
  }

  /**
   * Subscribes to macro blocks.
   *
   * @param params - The block parameters.
   * @param wsCallbacks - The WebSocket callbacks.
   * @param options - Optional WebSocket client options.
   * @returns A promise that resolves with a Subscription object.
   */
  public subscribeForMacroBlocks<T = MacroBlock, M = undefined>(
    params: BlockParams = {},
    wsCallbacks: WebSocketCallbacks<T, M>,
    options: WebsocketClientOptions = DEFAULT_CLIENT_OPTIONS
  ): Promise<Subscription> {
    const { retrieve = RetrieveType.Full } = params || {}
    return this.ws.subscribe<T, M>({ method: 'subscribeForHeadBlock', params: [retrieve === RetrieveType.Full] }, wsCallbacks, options, { filter: isMacro })
  }

  /**
   * Subscribes to all blocks.
   *
   * @param params - The block parameters.
   * @param wsCallbacks - The WebSocket callbacks.
   * @param options - Optional WebSocket client options.
   * @param streamOptions - Optional WebSocket stream options.
   * @returns A promise that resolves with a Subscription object.
   */
  public subscribeForBlocks<T = Block, M = undefined>(
    params: BlockParams = {},
    wsCallbacks: WebSocketCallbacks<T, M>,
    options: WebsocketClientOptions = DEFAULT_CLIENT_OPTIONS,
    streamOptions: WebsocketStreamOptions = DEFAULT_STREAM_OPTIONS,
  ): Promise<Subscription> {
    const { retrieve = RetrieveType.Full } = params
    return this.ws.subscribe<T, M>({ method: 'subscribeForHeadBlock', params: [retrieve === RetrieveType.Full] }, wsCallbacks, options, streamOptions)
  }

  /**
   * Subscribes to pre epoch validators events.
   *
   * @param params - The validator election parameters.
   * @param wsCallbacks - The WebSocket callbacks.
   * @param options - Optional WebSocket client options.
   * @param streamOptions - Optional WebSocket stream options.
   * @returns A promise that resolves with a Subscription object.
   */
  public subscribeForValidatorElectionByAddress<T = Validator, M = BlockchainState>(
    params: ValidatorElectionParams,
    wsCallbacks: WebSocketCallbacks<T, M>,
    options: WebsocketClientOptions = DEFAULT_CLIENT_OPTIONS,
    streamOptions: WebsocketStreamOptions = DEFAULT_STREAM_OPTIONS,
  ): Promise<Subscription> {
    return this.ws.subscribe<T, M>({ method: 'subscribeForValidatorElectionByAddress', params: [params.address] }, wsCallbacks, options, streamOptions)
  }

  /**
   * Subscribes to log events related to a given list of addresses and log types.
   *
   * @param params - The log parameters.
   * @param wsCallbacks - The WebSocket callbacks.
   * @param options - Optional WebSocket client options.
   * @param streamOptions - Optional WebSocket stream options.
   * @returns A promise that resolves with a Subscription object.
   */
  public subscribeForLogsByAddressesAndTypes<T = BlockLog, M = BlockchainState>(
    params: LogsParams = {},
    wsCallbacks: WebSocketCallbacks<T, M>,
    options: WebsocketClientOptions = DEFAULT_CLIENT_OPTIONS,
    streamOptions: WebsocketStreamOptions = DEFAULT_STREAM_OPTIONS,
  ): Promise<Subscription> {
    const { addresses = [], types = [] } = params
    return this.ws.subscribe<T, M>({ method: 'subscribeForLogsByAddressesAndTypes', params: [addresses, types] }, wsCallbacks, options, streamOptions)
  }
}
