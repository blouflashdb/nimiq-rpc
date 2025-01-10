import type { HttpClient } from '../client/http.ts'
import type { RPCData, Signature, WalletAccount } from '../types/index.ts'
import { DEFAULT_OPTIONS } from '../client/http.ts'

export interface ImportKeyParams { keyData: string, passphrase?: string }
export interface UnlockAccountParams { passphrase?: string, duration?: number }
export interface CreateAccountParams { passphrase?: string }
export interface SignParams { message: string, address: string, passphrase: string, isHex: boolean }
export interface VerifySignatureParams { message: string, publicKey: string, signature: Signature, isHex: boolean }

export class WalletClient {
  private client: HttpClient

  constructor(http: HttpClient) {
    this.client = http
  }

  /**
   * Imports a raw key into the wallet.
   *
   * @param params - The parameters for importing the key.
   * @param params.keyData - The raw key data.
   * @param params.passphrase - The passphrase for the key.
   * @param options - Optional call options.
   * @returns The imported key's address.
   */
  public importRawKey<T = string>({ keyData, passphrase }: ImportKeyParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T, undefined>> {
    return this.client.call<T>({ method: 'importRawKey', params: [keyData, passphrase] }, options)
  }

  /**
   * Checks if an account is imported.
   *
   * @param address - The address of the account.
   * @param options - Optional call options.
   * @returns Whether the account is imported.
   */
  public isAccountImported<T = string>(address: string, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'isAccountImported', params: [address] }, options)
  }

  /**
   * Lists all imported accounts.
   *
   * @param options - Optional call options.
   * @returns A list of imported accounts.
   */
  public listAccounts<T = string[]>(options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'listAccounts' }, options)
  }

  /**
   * Locks an account.
   *
   * @param address - The address of the account to lock.
   * @param options - Optional call options.
   * @returns Null if the account was successfully locked.
   */
  public lockAccount<T = null>(address: string, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'lockAccount', params: [address] }, options)
  }

  /**
   * Creates a new account.
   *
   * @param params - The parameters for creating the account.
   * @param params.passphrase - The passphrase for the account.
   * @param options - Optional call options.
   * @returns The created account.
   */
  public createAccount<T = WalletAccount>(p?: CreateAccountParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'createAccount', params: [p?.passphrase] }, options)
  }

  /**
   * Unlocks an account.
   *
   * @param address - The address of the account to unlock.
   * @param params - The parameters for unlocking the account.
   * @param params.passphrase - The passphrase for the account.
   * @param params.duration - The duration to keep the account unlocked.
   * @param options - Optional call options.
   * @returns Whether the account was successfully unlocked.
   */
  public unlockAccount<T = boolean>(address: string, { passphrase, duration }: UnlockAccountParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'unlockAccount', params: [address, passphrase, duration] }, options)
  }

  /**
   * Checks if an account is unlocked.
   *
   * @param address - The address of the account.
   * @param options - Optional call options.
   * @returns Whether the account is unlocked.
   */
  public isAccountUnlocked<T = boolean>(address: string, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'isAccountUnlocked', params: [address] }, options)
  }

  /**
   * Signs a message with an account's key.
   *
   * @param params - The parameters for signing the message.
   * @param params.message - The message to sign.
   * @param params.address - The address of the account.
   * @param params.passphrase - The passphrase for the account.
   * @param params.isHex - Whether the message is in hexadecimal format.
   * @param options - Optional call options.
   * @returns The signature.
   */
  public sign<T = Signature>({ message, address, passphrase, isHex }: SignParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'sign', params: [message, address, passphrase, isHex] }, options)
  }

  /**
   * Verifies a signature.
   *
   * @param params - The parameters for verifying the signature.
   * @param params.message - The message that was signed.
   * @param params.publicKey - The public key of the signer.
   * @param params.signature - The signature to verify.
   * @param params.isHex - Whether the message is in hexadecimal format.
   * @param options - Optional call options.
   * @returns Whether the signature is valid.
   */
  public verifySignature<T = boolean>({ message, publicKey, signature, isHex }: VerifySignatureParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'verifySignature', params: [message, publicKey, signature, isHex] }, options)
  }

  /**
   * Removes an account.
   *
   * @param address - The address of the account to remove.
   * @param options - Optional call options.
   * @returns Whether the account was successfully removed.
   */
  public removeAccount<T = boolean>(address: string, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'removeAccount', params: [address] }, options)
  }
}
