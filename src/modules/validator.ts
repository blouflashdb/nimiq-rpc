import type { HttpClient } from '../client/http.ts'
import { DEFAULT_OPTIONS } from '../client/http.ts'
import type { RPCData } from "../types/index.ts";

export interface SetAutomaticReactivationParams { automaticReactivation: boolean }

/**
 * ValidatorClient class provides methods to interact with the Nimiq Albatross Node's validator.
 */
export class ValidatorClient {
  private client: HttpClient

  constructor(http: HttpClient) {
    this.client = http
  }

  /**
   * Returns our validator address.
   *
   * @param options - Optional call options.
   * @returns The validator address.
   */
  public getAddress<T = string>(options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'getAddress' }, options)
  }

  /**
   * Returns our validator signing key.
   *
   * @param options - Optional call options.
   * @returns The validator signing key.
   */
  public getSigningKey(options = DEFAULT_OPTIONS): Promise<Error | RPCData<string>> {
    return this.client.call<string>({ method: 'getSigningKey' }, options)
  }

  /**
   * Returns our validator voting key.
   *
   * @param options - Optional call options.
   * @returns The validator voting key.
   */
  public getVotingKey(options = DEFAULT_OPTIONS): Promise<Error | RPCData<string>> {
    return this.client.call<string>({ method: 'getVotingKey' }, options)
  }

  /**
   * Updates the configuration setting to automatically reactivate our validator.
   *
   * @param params - The parameters for setting automatic reactivation.
   * @param params.automaticReactivation - Whether to automatically reactivate the validator.
   * @param options - Optional call options.
   * @returns A promise that resolves with null.
   */
  public setAutomaticReactivation({ automaticReactivation }: SetAutomaticReactivationParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<null>> {
    return this.client.call<null>({ method: 'setAutomaticReactivation', params: [automaticReactivation] }, options)
  }

  /**
   * Returns whether our validator is elected.
   *
   * @param options - Optional call options.
   * @returns A boolean indicating whether the validator is elected.
   */
  public isElected(options = DEFAULT_OPTIONS): Promise<Error | RPCData<boolean>> {
    return this.client.call<boolean>({ method: 'isValidatorElected' }, options)
  }

  /**
   * Returns whether our validator is synced.
   *
   * @param options - Optional call options.
   * @returns A boolean indicating whether the validator is synced.
   */
  public isSynced(options = DEFAULT_OPTIONS): Promise<Error | RPCData<boolean>> {
    return this.client.call<boolean>({ method: 'isValidatorSynced' }, options)
  }
}
