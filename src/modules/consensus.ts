import type { HttpClient, SendTxCallOptions } from '../client/http.ts'
import type { Transaction, ValidityStartHeight } from '../types/index.ts'
import type { BlockLog, RPCData } from '../types/logs.ts'
import { DEFAULT_OPTIONS, DEFAULT_OPTIONS_SEND_TX } from '../client/http.ts'

export interface RawTransactionInfoParams { rawTransaction: string }
export type TransactionParams = { wallet: string, recipient: string, value: number, fee: number, data?: string } & ValidityStartHeight
export type VestingTxParams = { wallet: string, owner: string, startTime: number, timeStep: number, numSteps: number, value: number, fee: number } & ValidityStartHeight
export type RedeemVestingTxParams = { wallet: string, contractAddress: string, recipient: string, value: number, fee: number } & ValidityStartHeight
export type HtlcTransactionParams = { wallet: string, htlcSender: string, htlcRecipient: string, hashRoot: string, hashCount: number, timeout: number, value: number, fee: number } & ValidityStartHeight
export type RedeemRegularHtlcTxParams = { wallet: string, contractAddress: string, recipient: string, preImage: string, hashRoot: string, hashCount: number, value: number, fee: number } & ValidityStartHeight
export type RedeemTimeoutHtlcTxParams = { wallet: string, contractAddress: string, recipient: string, value: number, fee: number } & ValidityStartHeight
export type RedeemEarlyHtlcTxParams = { contractAddress: string, recipient: string, htlcSenderSignature: string, htlcRecipientSignature: string, value: number, fee: number } & ValidityStartHeight
export type CreateStakeTxParams = { senderWallet: string, stakerWallet: string, delegation: string | undefined, value: number, fee: number } & ValidityStartHeight
export type UpdateStakeTxParams = { senderWallet: string, stakerWallet: string, newDelegation: string | undefined, newInactiveBalance: boolean, fee: number } & ValidityStartHeight
export type StakeTxParams = { senderWallet: string, stakerWallet: string, value: number, fee: number } & ValidityStartHeight
export type SetActiveStakeTxParams = { senderWallet: string, stakerWallet: string, newActiveBalance: number, fee: number } & ValidityStartHeight
export type CreateRetireStakeTxParams = { senderWallet: string, stakerWallet: string, retireStake: number, fee: number } & ValidityStartHeight
export type RemoveStakeTxParams = { stakerWallet: string, recipient: string, value: number, fee: number } & ValidityStartHeight
export type NewValidatorTxParams = { senderWallet: string, validator: string, signingSecretKey: string, votingSecretKey: string, rewardAddress: string, signalData: string, fee: number } & ValidityStartHeight
export type UpdateValidatorTxParams = { senderWallet: string, validator: string, newSigningSecretKey: string, newVotingSecretKey: string, newRewardAddress: string, newSignalData: string, fee: number } & ValidityStartHeight
export type DeactiveValidatorTxParams = { senderWallet: string, validator: string, signingSecretKey: string, fee: number } & ValidityStartHeight
export type ReactivateValidatorTxParams = { senderWallet: string, validator: string, signingSecretKey: string, fee: number } & ValidityStartHeight
export type RetireValidatorTxParams = { senderWallet: string, validator: string, fee: number } & ValidityStartHeight
export type DeleteValidatorTxParams = { validator: string, recipient: string, fee: number, value: number } & ValidityStartHeight

export interface TxLog { tx: Transaction, log?: BlockLog, hash: string }

export class ConsensusClient {
  private client: HttpClient

  constructor(client: HttpClient) {
    this.client = client
  }

  private getValidityStartHeight(p: ValidityStartHeight): string {
    return 'relativeValidityStartHeight' in p ? `+${p.relativeValidityStartHeight}` : `${p.absoluteValidityStartHeight}`
  }

  /**
   * Returns a boolean specifying if we have established consensus with the network
   */
  public isConsensusEstablished<T = boolean>(options = DEFAULT_OPTIONS): Promise<RPCData<T> | Error> {
    return this.client.call<T>({ method: 'isConsensusEstablished' }, options)
  }

  /**
   * Given a serialized transaction, it will return the corresponding transaction struct
   */
  public getRawTransactionInfo<T = Transaction>({ rawTransaction }: RawTransactionInfoParams, options = DEFAULT_OPTIONS): Promise<RPCData<T> | Error> {
    return this.client.call<T>({ method: 'getRawTransactionInfo', params: [rawTransaction] }, options)
  }

  /**
   * Sends a raw transaction to the network
   */
  public sendRawTransaction<T = string>({ rawTransaction }: RawTransactionInfoParams, options = DEFAULT_OPTIONS): Promise<RPCData<T> | Error> {
    return this.client.call<T>({ method: 'sendRawTransaction', params: [rawTransaction] }, options)
  }

  /**
   * Creates a serialized transaction
   */
  public createTransaction<T = string>(p: TransactionParams, options = DEFAULT_OPTIONS): Promise<RPCData<T> | Error> {
    if (p.data) {
      const req = { method: 'createBasicTransactionWithData', params: [p.wallet, p.recipient, p.data, p.value, p.fee, this.getValidityStartHeight(p)] }
      return this.client.call<T>(req, options)
    }
    else {
      const req = { method: 'createBasicTransaction', params: [p.wallet, p.recipient, p.value, p.fee, this.getValidityStartHeight(p)] }
      return this.client.call<T>(req, options)
    }
  }

  /**
   * Sends a transaction
   */
  public sendTransaction<T = string>(p: TransactionParams, options = DEFAULT_OPTIONS): Promise<RPCData<T> | Error> {
    const req = p.data
      ? { method: 'sendBasicTransactionWithData', params: [p.wallet, p.recipient, p.data, p.value, p.fee, this.getValidityStartHeight(p)] }
      : { method: 'sendBasicTransaction', params: [p.wallet, p.recipient, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<T>(req, options)
  }

  /**
   * Sends a transaction and waits for confirmation
   */
  public sendSyncTransaction<T = string>(p: TransactionParams, options: SendTxCallOptions): Promise<RPCData<T> | Error> {
    return this.sendTransaction<T>(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.wallet, p.recipient], types: [LogType.Transfer] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized transaction creating a new vesting contract
   */
  public createNewVestingTransaction<T = string>(p: VestingTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<T> | Error> {
    const req = { method: 'createNewVestingTransaction', params: [p.wallet, p.owner, p.startTime, p.timeStep, p.numSteps, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<T>(req, options)
  }

  /**
   * Sends a transaction creating a new vesting contract to the network
   */
  public sendNewVestingTransaction<T = string>(p: VestingTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<T> | Error> {
    const req = { method: 'sendNewVestingTransaction', params: [p.wallet, p.owner, p.startTime, p.timeStep, p.numSteps, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<T>(req, options)
  }

  /**
   * Sends a transaction creating a new vesting contract to the network and waits for confirmation
   */
  public sendSyncNewVestingTransaction(p: VestingTxParams, options: SendTxCallOptions): Promise<RPCData<string> | Error> {
    return this.sendNewVestingTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.wallet] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized transaction redeeming a vesting contract
   */
  public createRedeemVestingTransaction(p: RedeemVestingTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createRedeemVestingTransaction', params: [p.wallet, p.contractAddress, p.recipient, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction redeeming a vesting contract
   */
  public sendRedeemVestingTransaction(p: RedeemVestingTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendRedeemVestingTransaction', params: [p.wallet, p.contractAddress, p.recipient, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction redeeming a vesting contract and waits for confirmation
   */
  public sendSyncRedeemVestingTransaction(p: RedeemVestingTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendRedeemVestingTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.wallet] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized transaction creating a new HTLC contract
   */
  public createNewHtlcTransaction(p: HtlcTransactionParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createNewHtlcTransaction', params: [p.wallet, p.htlcSender, p.htlcRecipient, p.hashRoot, p.hashCount, p.timeout, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction creating a new HTLC contract
   */
  public sendNewHtlcTransaction(p: HtlcTransactionParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendNewHtlcTransaction', params: [p.wallet, p.htlcSender, p.htlcRecipient, p.hashRoot, p.hashCount, p.timeout, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction creating a new HTLC contract and waits for confirmation
   */
  public sendSyncNewHtlcTransaction(p: HtlcTransactionParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendNewHtlcTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.wallet] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized transaction redeeming an HTLC contract
   */
  public createRedeemRegularHtlcTransaction(p: RedeemRegularHtlcTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createRedeemRegularHtlcTransaction', params: [p.wallet, p.contractAddress, p.recipient, p.preImage, p.hashRoot, p.hashCount, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction redeeming an HTLC contract
   */
  public sendRedeemRegularHtlcTransaction(p: RedeemRegularHtlcTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendRedeemRegularHtlcTransaction', params: [p.wallet, p.contractAddress, p.recipient, p.preImage, p.hashRoot, p.hashCount, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction redeeming a new HTLC contract and waits for confirmation
   */
  public sendSyncRedeemRegularHtlcTransaction(p: RedeemRegularHtlcTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendRedeemRegularHtlcTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.wallet] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized transaction redeeming a HTLC contract using the `TimeoutResolve`
   * method
   */
  public createRedeemTimeoutHtlcTransaction(p: RedeemTimeoutHtlcTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createRedeemRegularHtlcTransaction', params: [p.wallet, p.contractAddress, p.recipient, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction redeeming a HTLC contract using the `TimeoutResolve`
   * method to network
   */
  public sendRedeemTimeoutHtlcTransaction(p: RedeemTimeoutHtlcTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendRedeemRegularHtlcTransaction', params: [p.wallet, p.contractAddress, p.recipient, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction redeeming a HTLC contract using the `TimeoutResolve`
   * method to network and waits for confirmation
   */
  public sendSyncRedeemTimeoutHtlcTransaction(p: RedeemTimeoutHtlcTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendRedeemTimeoutHtlcTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.wallet] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized transaction redeeming a HTLC contract using the `EarlyResolve`
   * method.
   */
  public createRedeemEarlyHtlcTransaction(p: RedeemEarlyHtlcTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createRedeemEarlyHtlcTransaction', params: [p.contractAddress, p.recipient, p.htlcSenderSignature, p.htlcRecipientSignature, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction redeeming a HTLC contract using the `EarlyResolve`
   * method.
   */
  public sendRedeemEarlyHtlcTransaction(p: RedeemEarlyHtlcTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendRedeemEarlyHtlcTransaction', params: [p.contractAddress, p.recipient, p.htlcSenderSignature, p.htlcRecipientSignature, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a transaction redeeming a HTLC contract using the `EarlyResolve`
   * method and waits for confirmation
   */
  public sendSyncRedeemEarlyHtlcTransaction(p: RedeemEarlyHtlcTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendRedeemEarlyHtlcTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.contractAddress] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized signature that can be used to redeem funds from a HTLC contract using
   * the `EarlyResolve` method.
   */
  public signRedeemEarlyHtlcTransaction(p: RedeemEarlyHtlcTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'signRedeemEarlyHtlcTransaction', params: [p.contractAddress, p.recipient, p.htlcSenderSignature, p.htlcRecipientSignature, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Returns a serialized `new_staker` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   */
  public createNewStakerTransaction(p: CreateStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createNewStakerTransaction', params: [p.senderWallet, p.stakerWallet, p.delegation, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `new_staker` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   */
  public sendNewStakerTransaction(p: CreateStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendNewStakerTransaction', params: [p.senderWallet, p.stakerWallet, p.delegation, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `new_staker` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee and waits for confirmation.
   */
  public sendSyncNewStakerTransaction(p: CreateStakeTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendNewStakerTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.senderWallet], types: [LogType.CreateStaker] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `stake` transaction. The funds to be staked and the transaction fee will
   * be paid from the `sender_wallet`.
   */
  public createStakeTransaction(p: StakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createStakeTransaction', params: [p.senderWallet, p.stakerWallet, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `stake` transaction. The funds to be staked and the transaction fee will
   * be paid from the `sender_wallet`.
   */
  public sendStakeTransaction(p: StakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendStakeTransaction', params: [p.senderWallet, p.stakerWallet, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `stake` transaction. The funds to be staked and the transaction fee will
   * be paid from the `sender_wallet` and waits for confirmation.
   */
  public sendSyncStakeTransaction(p: StakeTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendStakeTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.senderWallet], types: [LogType.Stake] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `update_staker` transaction. You can pay the transaction fee from a basic
   * account (by providing the sender wallet) or from the staker account's balance (by not
   * providing a sender wallet).
   */
  public createUpdateStakerTransaction(p: UpdateStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createUpdateStakerTransaction', params: [p.senderWallet, p.stakerWallet, p.newDelegation, p.newInactiveBalance, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `update_staker` transaction. You can pay the transaction fee from a basic
   * account (by providing the sender wallet) or from the staker account's balance (by not
   * providing a sender wallet).
   */
  public sendUpdateStakerTransaction(p: UpdateStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendUpdateStakerTransaction', params: [p.senderWallet, p.stakerWallet, p.newDelegation, p.newInactiveBalance, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `update_staker` transaction. You can pay the transaction fee from a basic
   * account (by providing the sender wallet) or from the staker account's balance (by not
   * providing a sender wallet) and waits for confirmation.
   */
  public sendSyncUpdateStakerTransaction(p: UpdateStakeTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendUpdateStakerTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.senderWallet], types: [LogType.UpdateStaker] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `set_active_stake` transaction. You can pay the transaction fee from a basic
   * account (by providing the sender wallet) or from the staker account's balance (by not
   * providing a sender wallet).
   */
  public createSetActiveStakeTransaction(p: SetActiveStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createSetActiveStakeTransaction', params: [p.senderWallet, p.stakerWallet, p.newActiveBalance, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `set_active_stake` transaction. You can pay the transaction fee from a basic
   * account (by providing the sender wallet) or from the staker account's balance (by not
   * providing a sender wallet).
   */
  public sendSetActiveStakeTransaction(p: SetActiveStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendSetActiveStakeTransaction', params: [p.senderWallet, p.stakerWallet, p.newActiveBalance, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `set_active_stake` transaction. You can pay the transaction fee from a basic
   * account (by providing the sender wallet) or from the staker account's balance (by not
   * providing a sender wallet) and waits for confirmation.
   */
  public sendSyncSetActiveStakeTransaction(p: SetActiveStakeTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendSetActiveStakeTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.senderWallet], types: [LogType.SetActiveStake] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `retire_stake` transaction. You can pay the transaction fee from a basic
   * account (by providing the sender wallet) or from the staker account's balance (by not
   * providing a sender wallet).
   */
  public createRetireStakeTransaction(p: CreateRetireStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createRetireStakeTransaction', params: [p.senderWallet, p.stakerWallet, p.retireStake, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `retire_stake` transaction. You can pay the transaction fee from a basic
   * account (by providing the sender wallet) or from the staker account's balance (by not
   * providing a sender wallet).
   */
  public sendRetireStakeTransaction(p: CreateRetireStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendRetireStakeTransaction', params: [p.senderWallet, p.stakerWallet, p.retireStake, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `retire_stake` transaction. You can pay the transaction fee from a basic
   * account (by providing the sender wallet) or from the staker account's balance (by not
   * providing a sender wallet) and waits for confirmation.
   */
  public sendSyncRetireStakeTransaction(p: CreateRetireStakeTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendRetireStakeTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.senderWallet], types: [LogType.RetireStake] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `remove_stake` transaction.
   */
  public createRemoveStakeTransaction(p: RemoveStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createRemoveStakeTransaction', params: [p.stakerWallet, p.recipient, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `remove_stake` transaction.
   */
  public sendRemoveStakeTransaction(p: RemoveStakeTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendRemoveStakeTransaction', params: [p.stakerWallet, p.recipient, p.value, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `remove_stake` transaction and waits for confirmation.
   */
  public sendSyncRemoveStakeTransaction(p: RemoveStakeTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendRemoveStakeTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.stakerWallet], types: [LogType.RemoveStake] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `new_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee and the validator deposit.
   * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
   * have a double Option. So we use the following work-around for the signal data:
   * "" = Set the signal data field to None.
   * "0x29a4b..." = Set the signal data field to Some(0x29a4b...).
   */
  public createNewValidatorTransaction(p: NewValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createNewValidatorTransaction', params: [p.senderWallet, p.validator, p.signingSecretKey, p.votingSecretKey, p.rewardAddress, p.signalData, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `new_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee and the validator deposit.
   * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
   * have a double Option. So we use the following work-around for the signal data:
   * "" = Set the signal data field to None.
   * "0x29a4b..." = Set the signal data field to Some(0x29a4b...).
   */
  public sendNewValidatorTransaction(p: NewValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendNewValidatorTransaction', params: [p.senderWallet, p.validator, p.signingSecretKey, p.votingSecretKey, p.rewardAddress, p.signalData, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `new_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee and the validator deposit
   * and waits for confirmation.
   * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
   * have a double Option. So we use the following work-around for the signal data:
   * "" = Set the signal data field to None.
   * "0x29a4b..." = Set the signal data field to Some(0x29a4b...).
   */
  public sendSyncNewValidatorTransaction(p: NewValidatorTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendNewValidatorTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.senderWallet], types: [LogType.CreateValidator] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `update_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
   * have a double Option. So we use the following work-around for the signal data:
   * null = No change in the signal data field.
   * "" = Change the signal data field to None.
   * "0x29a4b..." = Change the signal data field to Some(0x29a4b...).
   */
  public createUpdateValidatorTransaction(p: UpdateValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createUpdateValidatorTransaction', params: [p.senderWallet, p.validator, p.newSigningSecretKey, p.newVotingSecretKey, p.newRewardAddress, p.newSignalData, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `update_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
   * have a double Option. So we use the following work-around for the signal data:
   * null = No change in the signal data field.
   * "" = Change the signal data field to None.
   * "0x29a4b..." = Change the signal data field to Some(0x29a4b...).
   */
  public sendUpdateValidatorTransaction(p: UpdateValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendUpdateValidatorTransaction', params: [p.senderWallet, p.validator, p.newSigningSecretKey, p.newVotingSecretKey, p.newRewardAddress, p.newSignalData, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `update_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee and waits for confirmation.
   * Since JSON doesn't have a primitive for Option (it just has the null primitive), we can't
   * have a double Option. So we use the following work-around for the signal data:
   * null = No change in the signal data field.
   * "" = Change the signal data field to None.
   * "0x29a4b..." = Change the signal data field to Some(0x29a4b...).
   */
  public sendSyncUpdateValidatorTransaction(p: UpdateValidatorTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendUpdateValidatorTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.validator], types: [LogType.UpdateValidator] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `inactivate_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   */
  public createDeactivateValidatorTransaction(p: DeactiveValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createDeactivateValidatorTransaction', params: [p.senderWallet, p.validator, p.signingSecretKey, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `inactivate_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   */
  public sendDeactivateValidatorTransaction(p: DeactiveValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendDeactivateValidatorTransaction', params: [p.senderWallet, p.validator, p.signingSecretKey, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `inactivate_validator` transaction and waits for confirmation.
   * You need to provide the address of a basic account (the sender wallet)
   * to pay the transaction fee.
   */
  public sendSyncDeactivateValidatorTransaction(p: DeactiveValidatorTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendDeactivateValidatorTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.validator], types: [LogType.DeactivateValidator] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `reactivate_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   */
  public createReactivateValidatorTransaction(p: ReactivateValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createReactivateValidatorTransaction', params: [p.senderWallet, p.validator, p.signingSecretKey, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `reactivate_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   */
  public sendReactivateValidatorTransaction(p: ReactivateValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendReactivateValidatorTransaction', params: [p.senderWallet, p.validator, p.signingSecretKey, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `reactivate_validator` transaction and waits for confirmation.
   * You need to provide the address of a basic account (the sender wallet)
   * to pay the transaction fee.
   */
  public sendSyncReactivateValidatorTransaction(p: ReactivateValidatorTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendReactivateValidatorTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.validator], types: [LogType.ReactivateValidator] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `retire_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   */
  public createRetireValidatorTransaction(p: RetireValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createRetireValidatorTransaction', params: [p.senderWallet, p.validator, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `retire_validator` transaction. You need to provide the address of a basic
   * account (the sender wallet) to pay the transaction fee.
   */
  public sendRetireValidatorTransaction(p: RetireValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendRetireValidatorTransaction', params: [p.senderWallet, p.validator, p.fee, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `retire_validator` transaction and waits for confirmation.
   * You need to provide the address of a basic account (the sender wallet)
   * to pay the transaction fee.
   */
  public sendSyncRetireValidatorTransaction(p: RetireValidatorTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendRetireValidatorTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.validator], types: [LogType.RetireValidator] }, options.waitForConfirmationTimeout, hash.context)
  }

  /**
   * Returns a serialized `delete_validator` transaction. The transaction fee will be paid from the
   * validator deposit that is being returned.
   * Note in order for this transaction to be accepted fee + value should be equal to the validator deposit, which is not a fixed value:
   * Failed delete validator transactions can diminish the validator deposit
   */
  public createDeleteValidatorTransaction(p: DeleteValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'createDeleteValidatorTransaction', params: [p.validator, p.recipient, p.fee, p.value, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `delete_validator` transaction. The transaction fee will be paid from the
   * validator deposit that is being returned.
   * Note in order for this transaction to be accepted fee + value should be equal to the validator deposit, which is not a fixed value:
   * Failed delete validator transactions can diminish the validator deposit
   */
  public sendDeleteValidatorTransaction(p: DeleteValidatorTxParams, options = DEFAULT_OPTIONS): Promise<RPCData<string> | Error> {
    const req = { method: 'sendDeleteValidatorTransaction', params: [p.validator, p.recipient, p.fee, p.value, this.getValidityStartHeight(p)] }
    return this.client.call<string>(req, options)
  }

  /**
   * Sends a `delete_validator` transaction and waits for confirmation.
   * The transaction fee will be paid from the validator deposit that is being returned.
   * Note in order for this transaction to be accepted fee + value should be equal to the validator deposit, which is not a fixed value:
   * Failed delete validator transactions can diminish the validator deposit
   */
  public sendSyncDeleteValidatorTransaction(p: DeleteValidatorTxParams, options = DEFAULT_OPTIONS_SEND_TX): Promise<RPCData<string> | Error> {
    return this.sendDeleteValidatorTransaction(p, options)
    // return await this.waitForConfirmation(hash.data!, { addresses: [p.validator], types: [LogType.DeleteValidator] }, options.waitForConfirmationTimeout, hash.context)
  }
}
