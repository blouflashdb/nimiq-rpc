/**
 * Represents the validity start height for a transaction.
 */
export type ValidityStartHeight =
  | { relativeValidityStartHeight: number }
  | { absoluteValidityStartHeight: number }

/**
 * Enum representing different hash algorithms.
 */
export enum HashAlgorithm {
  Blake2b = 1,
  Sha256 = 3,
  Sha512 = 4,
}

/**
 * Enum representing different account types.
 */
export enum AccountType {
  Basic = 'basic',
  Vesting = 'vesting',
  HTLC = 'htlc',
  Staking = 'staking',
}

/**
 * Enum representing different inherent types.
 */
export enum InherentType {
  Reward = 'reward',
  Jail = 'jail',
  Penalize = 'penalize',
}

/**
 * Represents constants used in the policy module of the blockchain.
 */
export interface PolicyConstants {
  /**
   * The staking contract address in the blockchain.
   */
  stakingContractAddress: string

  /**
   * The address that receives the block rewards (coinbase).
   */
  coinbaseAddress: string

  /**
   * The maximum validity window for transactions (number of blocks).
   */
  transactionValidityWindow: number

  /**
   * The maximum size (in bytes) of the body of a micro block.
   */
  maxSizeMicroBody: number

  /**
   * The version number of the policy constants.
   */
  version: number

  /**
   * The total number of validator slots in the network.
   */
  slots: number

  /**
   * The number of blocks in a batch.
   */
  blocksPerBatch: number

  /**
   * The number of batches in an epoch.
   */
  batchesPerEpoch: number

  /**
   * The total number of blocks in an epoch.
   */
  blocksPerEpoch: number

  /**
   * The deposit amount required for a validator slot (in smallest currency unit, e.g., Lunas).
   */
  validatorDeposit: number

  /**
   * The minimum stake required to participate in staking (in smallest currency unit, e.g., Lunas).
   */
  minimumStake: number

  /**
   * The total supply of coins in the network (in smallest currency unit, e.g., Lunas).
   */
  totalSupply: number

  /**
   * The number of epochs for which a validator is jailed after misbehavior.
   */
  jailEpochs: number

  /**
   * The block number of the genesis block.
   */
  genesisBlockNumber: number

  /**
   * The time (in seconds) between the production of two consecutive blocks.
   */
  blockSeparationTime: number
}

/**
 * Represents a basic account in the blockchain.
 */
export interface BasicAccount {
  type: AccountType.Basic
  address: string
  balance: number
}

/**
 * Represents a vesting account in the blockchain.
 */
export interface VestingAccount {
  type: AccountType.Vesting
  address: string
  balance: number
  owner: string
  vestingStart: number
  vestingStepBlocks: number
  vestingStepAmount: number
  vestingTotalAmount: number
}

/**
 * Represents an HTLC (Hashed Time-Locked Contract) account in the blockchain.
 */
export interface HtlcAccount {
  type: AccountType.HTLC
  address: string
  balance: number
  sender: string
  recipient: string
  hashRoot: string
  hashCount: number
  timeout: number
  totalAmount: number
}

/**
 * Represents a staking account in the blockchain.
 */
export interface StakingAccount {
  type: AccountType.Staking
  address: string
  balance: number
}

/**
 * Represents an account in the blockchain, which can be of different types.
 */
export type Account = BasicAccount | VestingAccount | HtlcAccount | StakingAccount

/**
 * Represents a transaction in the blockchain.
 */
export interface Transaction {
  hash: string
  blockNumber?: number // Optional, corresponds to Option<u32>
  timestamp?: bigint // Optional, corresponds to Option<u64>
  confirmations?: number // Optional, corresponds to Option<u32>
  size: number // Corresponds to usize
  relatedAddresses: Set<string> // Corresponds to BTreeSet<string>
  from: string
  fromType: number // Corresponds to u8
  to: string
  toType: number // Corresponds to u8
  value: number
  fee: number
  senderData: string // Corresponds to Vec<u8>
  recipientData: string // Corresponds to Vec<u8>
  flags: number // Corresponds to u8
  validityStartHeight: number // Corresponds to u32
  proof: string // Corresponds to Vec<u8>
  networkId: number // Corresponds to u8
}

/**
 * Represents a staker in the blockchain.
 */
export interface Staker {
  address: string
  balance: number
  delegation?: string
  inactiveBalance: number
  inactiveFrom: number | null
  retiredBalance: number
}

/**
 * Represents a validator in the blockchain.
 */
export interface Validator {
  address: string
  signingKey: string
  votingKey: string
  rewardAddress: string
  signalData?: string
  balance: number

  /**
   * The total amount of stakers in the validator.
   */
  numStakers: number

  /**
   * Whether the validator has been retired.
   */
  retired: boolean

  /**
   * The block in which the validator was inactive from.
   */
  inactivityFlag?: number

  /**
   * The block in which the validator was jailed from.
   */
  jailedFrom?: number
}

/**
 * Represents a slot in the blockchain.
 */
export interface Slot {
  firstSlotNumber: number
  numSlots: number
  validator: string
  publicKey: string
}

/**
 * Represents penalized slots in the blockchain.
 */
export interface PenalizedSlots {
  blockNumber: number
  disabled: number[]
}

/**
 * Represents an inherent reward in the blockchain.
 */
export interface InherentReward {
  type: InherentType.Reward
  blockNumber: number
  blockTime: number
  validatorAddress: string
  target: string
  value: number
  hash: string
}

/**
 * Represents an inherent penalize action in the blockchain.
 */
export interface InherentPenalize {
  type: InherentType.Penalize
  blockNumber: number
  blockTime: number
  validatorAddress: string
  offenseEventBlock: number
}

/**
 * Represents an inherent jail action in the blockchain.
 */
export interface InherentJail {
  type: InherentType.Jail
  blockNumber: number
  blockTime: number
  validatorAddress: string
  offenseEventBlock: number
}

/**
 * Represents an inherent action in the blockchain, which can be of different types.
 */
export type Inherent = InherentReward | InherentPenalize | InherentJail

/**
 * Represents information about the mempool in the blockchain.
 */
export interface MempoolInfo {
  _0?: number
  _1?: number
  _2?: number
  _5?: number
  _10?: number
  _20?: number
  _50?: number
  _100?: number
  _200?: number
  _500?: number
  _1000?: number
  _2000?: number
  _5000?: number
  _10000?: number
  total: number
  buckets: number[]
}

/**
 * Represents a wallet account in the blockchain.
 */
export interface WalletAccount {
  address: string
  publicKey: string
  privateKey: string
}

/**
 * Represents a signature in the blockchain.
 */
export interface Signature {
  signature: string
  publicKey: string
}

/**
 * Represents the state of the ZKP (Zero-Knowledge Proof) component in the blockchain.
 */
export interface ZKPState {
  latestBlock: Block
  latestProof?: string
}

/**
 * Represents the state of the blockchain.
 */
export interface BlockchainState {
  blockNumber: number
  blockHash: string
}

/**
 * Enum representing different block types.
 */
export enum BlockType {
  Micro = 'micro',
  Macro = 'macro',
}

/**
 * Enum representing different block subscription types.
 */
export enum BlockSubscriptionType {
  Macro = 'macro',
  Micro = 'micro',
  Election = 'election',
}

/**
 * Enum representing different retrieve types.
 */
export enum RetrieveType {
  Full = 'full',
  Partial = 'partial',
  Hash = 'hash',
}

/**
 * Enum representing different network IDs.
 */
enum NetworkId {
  Test = 1,
  Dev = 2,
  Bounty = 3,
  Dummy = 4,
  Main = 42,

  TestAlbatross = 5,
  DevAlbatross = 6,
  UnitAlbatross = 7,
  MainAlbatross = 24,
}

/**
 * Represents a fork proof in the blockchain.
 */
export interface ForkProof {
  blockNumber: number
  hashes: [string, string]
}

/**
 * Represents a double proposal proof in the blockchain.
 */
export interface DoubleProposalProof {
  blockNumber: number
  hashes: [string, string]
}

/**
 * Represents a double vote proof in the blockchain.
 */
export interface DoubleVoteProof {
  blockNumber: number
}

/**
 * Represents an equivocation proof in the blockchain, which can be of different types.
 */
export type EquivocationProof =
  | { type: 'Fork', proof: ForkProof }
  | { type: 'DoubleProposal', proof: DoubleProposalProof }
  | { type: 'DoubleVote', proof: DoubleVoteProof }

/**
 * Represents a partial block in the blockchain.
 */
export interface PartialBlock {
  hash: string
  size: number
  batch: number
  version: number
  number: number
  timestamp: number
  parentHash: string
  seed: string
  extraData: string
  stateHash: string
  bodyHash?: string
  historyHash: string
  network: NetworkId
  transactions?: Transaction[]
}

/**
 * Represents a partial micro block in the blockchain.
 */
export interface PartialMicroBlock extends PartialBlock {
  type: BlockType.Micro
  producer: {
    slotNumber: number
    validator: string
    publicKey: string
  }
  justification: {
    micro: string
  } | {
    skip: {
      sig: {
        signature: { signature: string }
        signers: number[]
      }
    }
  }
  equivocationProofs?: EquivocationProof[]
  epoch: number
  parentElectionHash?: undefined
}

/**
 * Represents a micro block in the blockchain.
 */
export interface MicroBlock extends PartialMicroBlock {
  transactions: Transaction[]
  isElectionBlock?: undefined
  lostRewardSet?: number[]
  disabledSet?: number[]
  interlink?: undefined
  slots?: undefined
  nextBatchInitialPunishedSet?: undefined
}

/**
 * Represents a partial macro block in the blockchain.
 */
export interface PartialMacroBlock extends PartialBlock {
  type: BlockType.Macro
  epoch: number
  parentElectionHash: string
  producer?: undefined
  equivocationProofs?: undefined
}

/**
 * Represents a macro block in the blockchain.
 */
export interface MacroBlock extends PartialMacroBlock {
  isElectionBlock: false
  transactions: Transaction[]
  lostRewardSet: number[]
  disabledSet: number[]
  justification?: {
    round: number
    sig: {
      signature: { signature: string }
      signers: number[]
    }
  }
  interlink?: undefined
  slots?: undefined
  nextBatchInitialPunishedSet?: undefined
}

/**
 * Represents an election macro block in the blockchain.
 */
export interface ElectionMacroBlock extends PartialMacroBlock {
  isElectionBlock: true
  transactions: Transaction[]
  interlink: string[]
  slots: Slot[]
  nextBatchInitialPunishedSet: number[]
}

/**
 * Represents a block in the blockchain, which can be of different types.
 */
export type Block = MicroBlock | MacroBlock | ElectionMacroBlock
