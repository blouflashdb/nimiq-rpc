import type { BlockchainState } from './common.ts'

/**
 * Enum representing different log types.
 */
export enum LogType {
  PayFee = 'pay-fee',
  Transfer = 'transfer',
  HtlcCreate = 'htlc-create',
  HtlcTimeoutResolve = 'htlc-timeout-resolve',
  HtlcRegularTransfer = 'htlc-regular-transfer',
  HtlcEarlyResolve = 'htlc-early-resolve',
  VestingCreate = 'vesting-create',
  CreateValidator = 'create-validator',
  UpdateValidator = 'update-validator',
  ValidatorFeeDeduction = 'validator-fee-deduction',
  DeactivateValidator = 'deactivate-validator',
  ReactivateValidator = 'reactivate-validator',
  RetireValidator = 'retire-validator',
  DeleteValidator = 'delete-validator',
  CreateStaker = 'create-staker',
  Stake = 'stake',
  UpdateStaker = 'update-staker',
  SetActiveStake = 'set-active-stake',
  RetireStake = 'retire-stake',
  RemoveStake = 'remove-stake',
  DeleteStaker = 'delete-staker',
  StakerFeeDeduction = 'staker-fee-deduction',
  PayoutReward = 'payout-reward',
  Penalize = 'penalize',
  JailValidator = 'jail-validator',
  RevertContract = 'revert-contract',
  FailedTransaction = 'failed-transaction',
}

/**
 * Log representing a fee payment.
 */
export interface PayFeeLog {
  type: LogType.PayFee
  from: string
  fee: number
}

/**
 * Log representing a transfer.
 */
export interface TransferLog {
  type: LogType.Transfer
  from: string
  to: string
  amount: number
  data?: Uint8Array
}

/**
 * Log representing the creation of an HTLC.
 */
export interface HtlcCreateLog {
  type: LogType.HtlcCreate
  contractAddress: string
  sender: string
  recipient: string
  hashRoot: string
  hashCount: number
  timeout: bigint
  totalAmount: number
}

/**
 * Log representing the timeout resolution of an HTLC.
 */
export interface HtlcTimeoutResolveLog {
  type: LogType.HtlcTimeoutResolve
  contractAddress: string
}

/**
 * Log representing a regular transfer in an HTLC.
 */
export interface HtlcRegularTransferLog {
  type: LogType.HtlcRegularTransfer
  contractAddress: string
  preImage: string
  hashDepth: number
}

/**
 * Log representing the early resolution of an HTLC.
 */
export interface HtlcEarlyResolveLog {
  type: LogType.HtlcEarlyResolve
  contractAddress: string
}

/**
 * Log representing the creation of a vesting contract.
 */
export interface VestingCreateLog {
  type: LogType.VestingCreate
  contractAddress: string
  owner: string
  vestingStartTime: bigint
  vestingTimeStep: bigint
  vestingStepAmount: number
  vestingTotalAmount: number
}

/**
 * Log representing the creation of a validator.
 */
export interface CreateValidatorLog {
  type: LogType.CreateValidator
  validatorAddress: string
  rewardAddress: string
}

/**
 * Log representing the update of a validator.
 */
export interface UpdateValidatorLog {
  type: LogType.UpdateValidator
  validatorAddress: string
  oldRewardAddress: string
  newRewardAddress: string | null
}

/**
 * Log representing a fee deduction for a validator.
 */
export interface ValidatorFeeDeductionLog {
  type: LogType.ValidatorFeeDeduction
  validatorAddress: string
  fee: number
}

/**
 * Log representing the deactivation of a validator.
 */
export interface DeactivateValidatorLog {
  type: LogType.DeactivateValidator
  validatorAddress: string
  inactiveFrom: number
}

/**
 * Log representing the reactivation of a validator.
 */
export interface ReactivateValidatorLog {
  type: LogType.ReactivateValidator
  validatorAddress: string
}

/**
 * Log representing the retirement of a validator.
 */
export interface RetireValidatorLog {
  type: LogType.RetireValidator
  validatorAddress: string
}

/**
 * Log representing the deletion of a validator.
 */
export interface DeleteValidatorLog {
  type: LogType.DeleteValidator
  validatorAddress: string
  rewardAddress: string
}

/**
 * Log representing the creation of a staker.
 */
export interface CreateStakerLog {
  type: LogType.CreateStaker
  stakerAddress: string
  validatorAddress: string | null
  value: number
}

/**
 * Log representing a stake action.
 */
export interface StakeLog {
  type: LogType.Stake
  stakerAddress: string
  validatorAddress: string | null
  value: number
}

/**
 * Log representing the update of a staker.
 */
export interface UpdateStakerLog {
  type: LogType.UpdateStaker
  stakerAddress: string
  oldValidatorAddress: string | null
  newValidatorAddress: string | null
  activeBalance: number
  inactiveFrom: number | null
}

/**
 * Log representing the setting of an active stake.
 */
export interface SetActiveStakeLog {
  type: LogType.SetActiveStake
  stakerAddress: string
  validatorAddress: string | null
  activeBalance: number
  inactiveBalance: number
  inactiveFrom: number | null
}

/**
 * Log representing the retirement of a stake.
 */
export interface RetireStakeLog {
  type: LogType.RetireStake
  stakerAddress: string
  validatorAddress: string | null
  inactiveBalance: number
  inactiveFrom: number | null
  retiredBalance: number
}

/**
 * Log representing the removal of a stake.
 */
export interface RemoveStakeLog {
  type: LogType.RemoveStake
  stakerAddress: string
  validatorAddress: string | null
  value: number
}

/**
 * Log representing the deletion of a staker.
 */
export interface DeleteStakerLog {
  type: LogType.DeleteStaker
  stakerAddress: string
  validatorAddress: string | null
}

/**
 * Log representing a fee deduction for a staker.
 */
export interface StakerFeeDeductionLog {
  type: LogType.StakerFeeDeduction
  stakerAddress: string
  fee: number
}

/**
 * Log representing a reward payout.
 */
export interface PayoutRewardLog {
  type: LogType.PayoutReward
  to: string
  value: number
}

/**
 * Log representing a penalization.
 */
export interface PenalizeLog {
  type: LogType.Penalize
  validatorAddress: string
  offenseEventBlock: number
  slot: number
  newlyDeactivated: boolean
}

/**
 * Log representing the jailing of a validator.
 */
export interface JailValidatorLog {
  type: LogType.JailValidator
  validatorAddress: string
  jailedFrom: number
}

/**
 * Log representing the reversion of a contract.
 */
export interface RevertContractLog {
  type: LogType.RevertContract
  contractAddress: string
}

/**
 * Log representing a failed transaction.
 */
export interface FailedTransactionLog {
  type: LogType.FailedTransaction
  from: string
  to: string
  failureReason: string
}

/**
 * Union type representing all possible logs.
 */
export type Log =
  | PayFeeLog
  | TransferLog
  | HtlcCreateLog
  | HtlcTimeoutResolveLog
  | HtlcRegularTransferLog
  | HtlcEarlyResolveLog
  | VestingCreateLog
  | CreateValidatorLog
  | UpdateValidatorLog
  | ValidatorFeeDeductionLog
  | DeactivateValidatorLog
  | ReactivateValidatorLog
  | RetireValidatorLog
  | DeleteValidatorLog
  | CreateStakerLog
  | StakeLog
  | UpdateStakerLog
  | SetActiveStakeLog
  | RetireStakeLog
  | RemoveStakeLog
  | DeleteStakerLog
  | StakerFeeDeductionLog
  | PayoutRewardLog
  | PenalizeLog
  | JailValidatorLog
  | RevertContractLog
  | FailedTransactionLog

/**
 * Represents a transaction log.
 */
export interface TransactionLog {
  hash: string
  logs: Log[]
  failed: boolean
}

/**
 * Represents a block log.
 */
export interface BlockLog {
  inherents: Log[]
  transactions: TransactionLog[]
}

/**
 * Represents an applied block log.
 */
export interface AppliedBlockLog extends BlockLog {
  type: 'applied-block'
  timestamp: bigint
}

/**
 * Represents a reverted block log.
 */
export interface RevertedBlockLog extends BlockLog {
  type: 'reverted-block'
}

/**
 * Union type representing all possible block log types.
 */
export type BlockLogType = AppliedBlockLog | RevertedBlockLog

/**
 * Represents the data returned by an RPC call.
 *
 * @template T - The type of the data.
 * @template M - The type of the metadata.
 */
export interface RPCData<T, M = undefined> {
  data: T
  metadata: M
}

/**
 * Represents the response of a block log RPC call.
 */
export type BlockLogResponse = RPCData<BlockLogType, BlockchainState>
