import type { HttpClient } from '../client/http'
import type {
  Account,
  Block,
  BlockchainState,
  Inherent,
  LogType,
  PartialBlock,
  PenalizedSlots,
  RPCData,
  Slot,
  Staker,
  Transaction,
  Validator,
} from '../types/'
import { DEFAULT_OPTIONS } from '../client/http'

export interface GetBlockByHashParams { includeBody?: boolean }
export interface GetBlockByBlockNumberParams { includeBody?: boolean }
export interface GetLatestBlockParams { includeBody?: boolean }
export interface GetSlotAtBlockParams {
  offsetOpt?: number
}
export interface GetTransactionsByAddressParams {
  max: number
  startAt: string
  justHashes?: boolean
}
export interface GetValidatorByAddressParams { address: string }
export interface GetStakersByAddressParams { address: string }
export interface GetStakerByAddressParams { address: string }
export interface SubscribeForHeadHashParams { retrieve: 'HASH' }
export interface SubscribeForValidatorElectionByAddressParams { address: string }
export interface SubscribeForLogsByAddressesAndTypesParams {
  addresses?: string[]
  types?: LogType[]
}

export class BlockchainClient {
  private client: HttpClient

  constructor(http: HttpClient) {
    this.client = http
  }

  /**
   * Returns the block number for the current head.
   */
  public async getBlockNumber<T = number>(options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'getBlockNumber' }, options)
  }

  /**
   * Returns the batch number for the current head.
   */
  public async getBatchNumber<T = number>(options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'getBatchNumber' }, options)
  }

  /**
   * Returns the epoch number for the current head.
   */
  public async getEpochNumber<T = number>(options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'getEpochNumber' }, options)
  }

  /**
   * Tries to fetch a block given its hash. It has an option to include the transactions in the block, which defaults to false.
   */
  public async getBlockByHash<T extends GetBlockByHashParams>(
    hash: string,
    p?: T,
    options = DEFAULT_OPTIONS,
  ): Promise<Error | RPCData<T['includeBody'] extends true ? Block : PartialBlock>> {
    return this.client.call<
      T['includeBody'] extends true ? Block : PartialBlock
    >(
      { method: 'getBlockByHash', params: [hash, p?.includeBody] },
      options,
    )
  }

  /**
   * Tries to fetch a block given its number. It has an option to include the transactions in the block, which defaults to false.
   */
  public async getBlockByNumber<T extends GetBlockByBlockNumberParams>(
    blockNumber: number,
    p?: T,
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<
      T['includeBody'] extends true ? Block : PartialBlock
    >({
      method: 'getBlockByNumber',
      params: [blockNumber, p?.includeBody],
    }, options)
  }

  /**
   * Returns the block at the head of the main chain. It has an option to include the
   * transactions in the block, which defaults to false.
   */
  public async getLatestBlock<T extends GetLatestBlockParams>(
    p = { includeBody: false } as T,
    options = DEFAULT_OPTIONS,
  ) {
    const req = { method: 'getLatestBlock', params: [p.includeBody] }
    return this.client.call<
      T['includeBody'] extends true ? Block : PartialBlock
    >(req, options)
  }

  /**
   * Returns the information for the slot owner at the given block height and offset. The
   * offset is optional, it will default to getting the offset for the existing block
   * at the given height.
   */
  public async getSlotAt<T extends GetSlotAtBlockParams>(
    blockNumber: number,
    p?: T,
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<Slot>({
      method: 'getSlotAt',
      params: [blockNumber, p?.offsetOpt],
    }, options)
  }

  /**
   * Fetches the transaction(s) given the hash.
   */
  public async getTransactionByHash(hash: string, options = DEFAULT_OPTIONS) {
    return this.client.call<Transaction>({
      method: 'getTransactionByHash',
      params: [hash],
    }, options)
  }

  /**
   * Fetches the transaction(s) given the block number.
   */
  public async getTransactionsByBlockNumber(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<Transaction[]>({
      method: 'getTransactionsByBlockNumber',
      params: [blockNumber],
    }, options)
  }

  /**
   * Fetches the transaction(s) given the batch number.
   */
  public async getTransactionsByBatchNumber(
    batchIndex: number,
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<Transaction[]>({
      method: 'getTransactionsByBatchNumber',
      params: [batchIndex],
    }, options)
  }

  /**
   * Fetches the transaction(s) given the address.
   *
   * It returns the latest transactions for a given address. All the transactions
   * where the given address is listed as a recipient or as a sender are considered. Reward
   * transactions are also returned. It has an option to specify the maximum number of transactions
   * to fetch, it defaults to 500.
   */
  public async getTransactionsByAddress<
    T extends GetTransactionsByAddressParams,
  >(
    address: string,
    p: T,
    options = DEFAULT_OPTIONS,
  ) {
    const req = {
      method: p?.justHashes
        ? 'getTransactionHashesByAddress'
        : 'getTransactionsByAddress',
      params: [address, p.max, p.startAt],
    }
    return this.client.call<
      T['justHashes'] extends true ? string[] : Transaction[]
    >(req, options)
  }

  /**
   * Returns all the inherents (including reward inherents) give the block number. Note
   * that this only considers blocks in the main chain.
   */
  public async getInherentsByBlockNumber(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<Inherent[]>({
      method: 'getInherentsByBlockNumber',
      params: [blockNumber],
    }, options)
  }

  /**
   * Returns all the inherents (including reward inherents) give the batch number. Note
   * that this only considers blocks in the main chain.
   */
  public async getInherentsByBatchNumber(
    batchIndex: number,
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<Inherent[]>({
      method: 'getInherentsByBatchNumber',
      params: [batchIndex],
    }, options)
  }

  /**
   * Tries to fetch the account at the given address.
   */
  public async getAccountByAddress(
    address: string,
    options = DEFAULT_OPTIONS,
  ) {
    const req = {
      method: 'getAccountByAddress',
      params: [address],
    }
    return this.client.call<
      Account,
      BlockchainState
    >(req, options)
  }

  /**
   * Fetches all accounts in the accounts tree.
   * IMPORTANT: This operation iterates over all accounts in the accounts tree
   * and thus is extremely computationally expensive.
   */
  public async getAccounts(options = DEFAULT_OPTIONS) {
    return this.client.call<Account[]>({
      method: 'getAccounts',
    }, options)
  }

  /**
   * Returns a collection of the currently active validator's addresses and balances.
   */
  public async getActiveValidators(
    options = DEFAULT_OPTIONS,
  ) {
    const req = { method: 'getActiveValidators' }
    return this.client.call<
      Validator[]
    >(req, options)
  }

  public async getCurrentPenalizedSlots(
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<PenalizedSlots[]>({
      method: 'getCurrentPenalizedSlots',
    }, options)
  }

  public async getPreviousPenalizedSlots(
    options = DEFAULT_OPTIONS,
  ) {
    const req = { method: 'getPreviousPenalizedSlots' }
    return this.client.call<
      PenalizedSlots[]
    >(req, options)
  }

  /**
   * Tries to fetch a validator information given its address.
   */
  public async getValidatorByAddress(
    address: string,
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<Validator>({
      method: 'getValidatorByAddress',
      params: [address],
    }, options)
  }

  /**
   * Fetches all validators in the staking contract.
   * IMPORTANT: This operation iterates over all validators in the staking contract
   * and thus is extremely computationally expensive.
   */
  public async getValidators(options = DEFAULT_OPTIONS) {
    return this.client.call<Validator[]>({
      method: 'getValidators',
    }, options)
  }

  /**
   * Fetches all stakers for a given validator.
   * IMPORTANT: This operation iterates over all stakers of the staking contract
   * and thus is extremely computationally expensive.
   */
  public async getStakersByValidatorAddress(
    address: string,
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<Staker[]>({
      method: 'getStakersByValidatorAddress',
      params: [address],
    }, options)
  }

  /**
   * Tries to fetch a staker information given its address.
   */
  public async getStakerByAddress(address: string, options = DEFAULT_OPTIONS) {
    return this.client.call<Staker>({
      method: 'getStakerByAddress',
      params: [address],
    }, options)
  }
}
