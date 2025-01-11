import type { HttpClient } from '../client/http.ts'
import type {
  PolicyConstants,
} from '../types/index.ts'
import { DEFAULT_OPTIONS } from '../client/http.ts'
import type { RPCData } from "../types/logs.ts";

export interface SupplyAtParams {
  genesisSupply: number
  genesisTime: number
  currentTime: number
}

/**
 * PolicyClient class provides methods to interact with the Nimiq Albatross Node's policy.
 */
export class PolicyClient {
  private client: HttpClient

  constructor(http: HttpClient) {
    this.client = http
  }

  /**
   * Gets a bundle of policy constants
   *
   * RPC method name: "getPolicyConstants"
   *
   * @param options - Optional call options.
   * @returns A promise that resolves with the policy constants.
   */
  public getPolicyConstants(options = DEFAULT_OPTIONS): Promise<RPCData<PolicyConstants>> {
    return this.client.call<PolicyConstants>(
      { method: 'getPolicyConstants' },
      options,
    )
  }

  /**
   * Returns the epoch number at a given block number (height).
   *
   * RPC method name: "getEpochAt"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the epoch number.
   */
  public getEpochAt(blockNumber: number, options = DEFAULT_OPTIONS): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getEpochAt',
      params: [blockNumber],
    }, options)
  }

  /**
   *  Returns the epoch index at a given block number. The epoch index is the number of a block relative
   * to the epoch it is in. For example, the first block of any epoch always has an epoch index of 0.
   *
   * RPC method name: "getEpochIndexAt"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the epoch index at a given block number.
   */
  public getEpochIndexAt(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getEpochIndexAt',
      params: [blockNumber],
    }, options)
  }

  /**
   * Returns the batch number at a given `block_number` (height)
   *
   * RPC method name: "getBatchAt"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the batch number at a given `block_number` (height).
   */
  public getBatchAt(blockNumber: number, options = DEFAULT_OPTIONS): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getBatchAt',
      params: [blockNumber],
    }, options)
  }

  /**
   * Returns the batch index at a given block number. The batch index is the number of a block relative
   * to the batch it is in. For example, the first block of any batch always has an batch index of 0.
   *
   * RPC method name: "getBatchIndexAt"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the batch index at a given block number.
   */
  public getBatchIndexAt(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getBatchIndexAt',
      params: [blockNumber],
    }, options)
  }

  /**
   * Gets the number (height) of the next election macro block after a given block number (height).
   *
   * RPC method name: "getElectionBlockAfter"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the number (height) of the next election macro block after a given block number (height).
   */
  public getElectionBlockAfter(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getElectionBlockAfter',
      params: [blockNumber],
    }, options)
  }

  /**
   * Gets the block number (height) of the preceding election macro block before a given block number (height).
   * If the given block number is an election macro block, it returns the election macro block before it.
   *
   * RPC method name: "getElectionBlockBefore"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number (height) of the preceding election macro block before a given block number (height).
   */
  public getElectionBlockBefore(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getElectionBlockBefore',
      params: [blockNumber],
    }, options)
  }

  /**
   * Gets the block number (height) of the last election macro block at a given block number (height).
   * If the given block number is an election macro block, then it returns that block number.
   *
   * RPC method name: "getLastElectionBlock"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number (height) of the last election macro block at a given block number (height).
   */
  public getLastElectionBlock(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getLastElectionBlock',
      params: [blockNumber],
    }, options)
  }

  /**
   * Gets a boolean expressing if the block at a given block number (height) is an election macro block.
   *
   * RPC method name: "isElectionBlockAt"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with a boolean expressing if the block at a given block number (height) is an election macro block.
   */
  public isElectionBlockAt(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<boolean>> {
    return this.client.call<boolean>({
      method: 'isElectionBlockAt',
      params: [blockNumber],
    }, options)
  }

  /**
   * Gets the block number (height) of the next macro block after a given block number (height).
   *
   * RPC method name: "getMacroBlockAfter"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number (height) of the next macro block after a given block number (height).
   */
  public getMacroBlockAfter(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getMacroBlockAfter',
      params: [blockNumber],
    }, options)
  }

  /**
   * Gets the block number (height) of the preceding macro block before a given block number (height).
   *
   * RPC method name: "getMacroBlockBefore"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number (height) of the preceding macro block before a given block number (height).
   */
  public getMacroBlockBefore(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getMacroBlockBefore',
      params: [blockNumber],
    }, options)
  }

  /**
   * Gets the block number (height) of the last macro block at a given block number (height).
   * If the given block number is a macro block, then it returns that block number.
   *
   * RPC method name: "getLastMacroBlock"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number (height) of the last macro block at a given block number (height).
   */
  public getLastMacroBlock(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    return this.client.call<number>({
      method: 'getLastMacroBlock',
      params: [blockNumber],
    }, options)
  }

  /**
   * Gets a boolean expressing if the block at a given block number (height) is a macro block.
   *
   * RPC method name: "isMacroBlockAt"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with a boolean expressing if the block at a given block number (height) is a macro block.
   */
  public isMacroBlockAt(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<boolean>> {
    return this.client.call<boolean>({
      method: 'isMacroBlockAt',
      params: [blockNumber],
    }, options)
  }

  /**
   * Gets the block number (height) of the next micro block after a given block number (height).
   *
   * RPC method name: "isMicroBlockAt"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number (height) of the next micro block after a given block number (height).
   */
  public isMicroBlockAt(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<boolean>> {
    const req = { method: 'isMicroBlockAt', params: [blockNumber] }
    return this.client.call<boolean>(req, options)
  }

  /**
   * Gets the block number (height) of the first block of the given epoch (which is always a micro block).
   *
   * RPC method name: "getFirstBlockOf"
   *
   * @param epochIndex - The epoch index to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number (height) of the first block of the given epoch (which is always a micro block).
   */
  public getFirstBlockOfEpoch(
    epochIndex: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    const req = { method: 'getFirstBlockOf', params: [epochIndex] }
    return this.client.call<number>(req, options)
  }

  /**
   * Gets the block number of the first block of the given reporting window (which is always a micro block).
   *
   * RPC method name: "getBlockAfterReportingWindow"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number of the first block of the given reporting window (which is always a micro block).
   */
  public getBlockAfterReportingWindow(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    const req = { method: 'getBlockAfterReportingWindow', params: [blockNumber] }
    return this.client.call<number>(req, options)
  }

  /**
   * Gets the block number of the first block of the given jail (which is always a micro block).
   *
   * RPC method name: "getBlockAfterJail"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number of the first block of the given jail (which is always a micro block).
   */
  public getBlockAfterJail(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    const req = { method: 'getBlockAfterJail', params: [blockNumber] }
    return this.client.call<number>(req, options)
  }

  /**
   * Gets the block number of the first block of the given batch (which is always a micro block).
   *
   * RPC method name: "getFirstBlockOfBatch"
   *
   * @param batchIndex - The batch index to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number of the first block of the given batch (which is always a micro block).
   */
  public getFirstBlockOfBatch(
    batchIndex: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    const req = { method: 'getFirstBlockOfBatch', params: [batchIndex] }
    return this.client.call<number>(req, options)
  }

  /**
   * Gets the block number of the election macro block of the given epoch (which is always the last block).
   *
   * RPC method name: "getElectionBlockOf"
   *
   * @param epochIndex - The epoch index to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number of the election macro block of the given epoch (which is always the last block).
   */
  public getElectionBlockOfEpoch(
    epochIndex: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    const req = { method: 'getElectionBlockOf', params: [epochIndex] }
    return this.client.call<number>(req, options)
  }

  /**
   * Gets the block number of the macro block (checkpoint or election) of the given batch (which is always the last block).
   *
   * RPC method name: "getMacroBlockOf"
   *
   * @param batchIndex - The batch index to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with the block number of the macro block (checkpoint or election) of the given batch (which is always the last block).
   */
  public getMacroBlockOfBatch(
    batchIndex: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    const req = { method: 'getMacroBlockOf', params: [batchIndex] }
    return this.client.call<number>(req, options)
  }

  /**
   * Gets a boolean expressing if the batch at a given block number (height) is the first batch
   * of the epoch.
   *
   * RPC method name: "getFirstBatchOfEpoch"
   *
   * @param blockNumber - The block number (height) to query.
   * @param options - Optional call options.
   * @returns A promise that resolves with a boolean expressing if the batch at a given block number (height) is the first batch.
   */
  public getFirstBatchOfEpoch(
    blockNumber: number,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    const req = { method: 'getFirstBatchOfEpoch', params: [blockNumber] }
    return this.client.call<number>(req, options)
  }

  /**
   * Gets the supply at a given time (as Unix time) in Lunas (1 NIM = 100,000 Lunas). It is
   * calculated using the following formula:
   * Supply (t) = Genesis_supply + Initial_supply_velocity / Supply_decay * (1 - e^(- Supply_decay * t))
   * Where e is the exponential function, t is the time in milliseconds since the genesis block and
   * Genesis_supply is the supply at the genesis of the Nimiq 2.0 chain.
   *
   * RPC method name: "getSupplyAt"
   *
   * @param params - The parameters for calculating the supply.
   * @param params.genesisSupply - The supply at genesis.
   * @param params.genesisTime - The timestamp of the genesis block.
   * @param params.currentTime - The timestamp to calculate supply at.
   * @param options - Optional call options.
   * @returns A promise that resolves with the supply at a given time (as Unix time) in Lunas (1 NIM = 100,000 Lunas).
   */
  public getSupplyAt(
    { genesisSupply, genesisTime, currentTime }: SupplyAtParams,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<number>> {
    const req = {
      method: 'getSupplyAt',
      params: [genesisSupply, genesisTime, currentTime],
    }
    return this.client.call<number>(req, options)
  }
}
