import type { HttpClient } from '../client/http'
import type { RPCData, Signature, WalletAccount } from '../types/'
import { DEFAULT_OPTIONS } from '../client/http'

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

  public async importRawKey<T = string>({ keyData, passphrase }: ImportKeyParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T, undefined>> {
    return this.client.call<T>({ method: 'importRawKey', params: [keyData, passphrase] }, options)
  }

  public async isAccountImported<T = string>(address: string, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'isAccountImported', params: [address] }, options)
  }

  public async listAccounts<T = string[]>(options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'listAccounts' }, options)
  }

  public async lockAccount<T = null>(address: string, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'lockAccount', params: [address] }, options)
  }

  public async createAccount<T = WalletAccount>(p?: CreateAccountParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'createAccount', params: [p?.passphrase] }, options)
  }

  public async unlockAccount<T = boolean>(address: string, { passphrase, duration }: UnlockAccountParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'unlockAccount', params: [address, passphrase, duration] }, options)
  }

  public async isAccountUnlocked<T = boolean>(address: string, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'isAccountUnlocked', params: [address] }, options)
  }

  public async sign<T = Signature>({ message, address, passphrase, isHex }: SignParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'sign', params: [message, address, passphrase, isHex] }, options)
  }

  public async verifySignature<T = boolean>({ message, publicKey, signature, isHex }: VerifySignatureParams, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'verifySignature', params: [message, publicKey, signature, isHex] }, options)
  }

  public async removeAccount<T = boolean>(address: string, options = DEFAULT_OPTIONS): Promise<Error | RPCData<T>> {
    return this.client.call<T>({ method: 'removeAccount', params: [address] }, options)
  }
}
