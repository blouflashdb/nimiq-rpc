# Nimiq RPC Client for TypeScript
[![JSR](https://jsr.io/badges/@blouflash/nimiq-rpc)](https://jsr.io/@blouflash/nimiq-rpc)
[![JSR Score](https://jsr.io/badges/@blouflash/nimiq-rpc/score)](https://jsr.io/@blouflash/nimiq-rpc)
[![Made with Deno](https://img.shields.io/badge/Deno-2-f7df1e?logo=deno&logoColor=white)](https://deno.land "Go to Deno homepage")
[![License](https://img.shields.io/badge/License-MIT-f7df1e)](#license)

A fully typed Nimiq RPC client for Nodejs and Deno.

## Table of Contents
- [Nimiq RPC Client for TypeScript](#nimiq-rpc-client-for-typescript)
- [How to use](#how-to-use)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Auth](#auth)
- [Modules](#modules)
- [License](#license)

## How to use

### Installation
deno:
```
deno add jsr:@blouflash/nimiq-rpc
```
npm:
```
npx jsr add @blouflash/nimiq-rpc
```

pnpm: 
```
pnpm dlx jsr add @blouflash/nimiq-rpc
```

### Usage

It is structured the same way as the [`Rust RPC Client`](https://github.com/nimiq/core-rs-albatross/tree/albatross/rpc-server/src/dispatchers)

```typescript
import { NimiqRPCClient } from '@blouflash/nimiq-rpc'

const client = new NimiqRPCClient();

// async/await based example http call
try {
  const result = await client.blockchain.getEpochNumber();
  console.log("Result:", result);
} catch (error) {
  if (error instanceof JSONRPCError) {
    console.error("JSON-RPC Error:", error);
  } else {
    console.error("An unknown error occurred:", error);
  }
}

// Promise based example http call
client.blockchain.getBlockNumber().then((result) => {
  console.log("Result:", result);
}).catch((error) => {
  if (error instanceof JSONRPCError) {
    console.error("JSON-RPC Error:", error);
  } else {
    console.error("An unknown error occurred:", error);
  }
});

// async/await based example ws stream call
const subscribtion = await client.blockchainStreams.subscribeForBlockHashes(
  {
    onMessage: (result) => {
      console.log("onMessage", result);
    },
    onError: (error) => {
      console.error("onError", error);
    },
    onConnectionError: (error) => {
      console.error("onConnectionError", error);
    },
  },
  { maxReconnects: 5, reconnectTimeout: 1000, callTimeout: 10000 }, // optional
  { filter: (_data) => true }, // optional
);

console.log(subscribtion.getSubscriptionId());

subscribtion.close();
```

### Auth
Auth is not supported however you can use a proxy like nginx and pass the auth token via query url. I recommend to use tls.
```typescript
const client = new NimiqRPCClient("http://localhost/?token=mysecrettoken", "ws://localhost/ws?token=mysecrettoken");
```

NGINX Config:
```
http {
    server {
        listen 80;

        location / {
            # Check the token from the query parameter (?token=...)
            if ($arg_token != "mysecrettoken") {
                return 403;  # Deny if the token is missing or invalid
            }

            # Forward valid requests to the node
            proxy_pass http://127.0.0.1:8648;
        }

        location /ws {
            # Check the token from the query parameter (?token=...)
            if ($arg_token != "mysecrettoken") {
                return 403;  # Deny if the token is missing or invalid
            }

            proxy_pass http://127.0.0.1:8648;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_read_timeout 3600;
        }
    }
}
```

## Modules

### BlockchainClient
The `BlockchainClient` class provides methods to interact with the blockchain.

#### Methods
- `getBlockNumber(options)`: Returns the block number for the current head.
- `getBatchNumber(options)`: Returns the batch number for the current head.
- `getEpochNumber(options)`: Returns the epoch number for the current head.
- `getBlockByHash(hash, params, options)`: Tries to fetch a block given its hash.
- `getBlockByNumber(blockNumber, params, options)`: Tries to fetch a block given its number.
- `getLatestBlock(params, options)`: Returns the block at the head of the main chain.
- `getSlotAt(blockNumber, params, options)`: Returns the information for the slot owner at the given block height and offset.
- `getTransactionByHash(hash, options)`: Fetches the transaction(s) given the hash.
- `getTransactionsByBlockNumber(blockNumber, options)`: Fetches the transaction(s) given the block number.
- `getTransactionsByBatchNumber(batchIndex, options)`: Fetches the transaction(s) given the batch number.
- `getTransactionsByAddress(address, params, options)`: Fetches the transaction(s) given the address.
- `getInherentsByBlockNumber(blockNumber, options)`: Returns all the inherents (including reward inherents) given the block number.
- `getInherentsByBatchNumber(batchIndex, options)`: Returns all the inherents (including reward inherents) given the batch number.
- `getAccountByAddress(address, options)`: Tries to fetch the account at the given address.
- `getAccounts(options)`: Fetches all accounts in the accounts tree.
- `getActiveValidators(options)`: Returns a collection of the currently active validator's addresses and balances.
- `getCurrentPenalizedSlots(options)`: Returns the currently penalized slots.
- `getPreviousPenalizedSlots(options)`: Returns the previously penalized slots.
- `getValidatorByAddress(address, options)`: Tries to fetch a validator information given its address.
- `getValidators(options)`: Fetches all validators in the staking contract.
- `getStakersByValidatorAddress(address, options)`: Fetches all stakers for a given validator.
- `getStakerByAddress(address, options)`: Tries to fetch a staker information given its address.

### BlockchainStream
The `BlockchainStream` class provides methods to interact with the Nimiq Albatross Node's blockchain streams.

#### Methods
- `subscribeForBlockHashes(wsCallbacks, options, streamOptions)`: Subscribes to block hash events.
- `subscribeForElectionBlocks(params, wsCallbacks, options)`: Subscribes to election blocks.
- `subscribeForMicroBlocks(params, wsCallbacks, options)`: Subscribes to micro blocks.
- `subscribeForMacroBlocks(params, wsCallbacks, options)`: Subscribes to macro blocks.
- `subscribeForBlocks(params, wsCallbacks, options, streamOptions)`: Subscribes to all blocks.
- `subscribeForValidatorElectionByAddress(params, wsCallbacks, options, streamOptions)`: Subscribes to pre epoch validators events.
- `subscribeForLogsByAddressesAndTypes(params, wsCallbacks, options, streamOptions)`: Subscribes to log events related to a given list of addresses and log types.

### ConsensusClient
The `ConsensusClient` class provides methods to interact with the consensus layer of the blockchain.

#### Methods
- `isConsensusEstablished(options)`: Returns a boolean specifying if we have established consensus with the network.
- `getRawTransactionInfo(params, options)`: Given a serialized transaction, it will return the corresponding transaction struct.
- `sendRawTransaction(params, options)`: Sends a raw transaction to the network.
- `createTransaction(params, options)`: Creates a serialized transaction.
- `sendTransaction(params, options)`: Sends a transaction.
- `sendSyncTransaction(params, options)`: Sends a transaction and waits for confirmation.
- `createNewVestingTransaction(params, options)`: Returns a serialized transaction creating a new vesting contract.
- `sendNewVestingTransaction(params, options)`: Sends a transaction creating a new vesting contract to the network.
- `sendSyncNewVestingTransaction(params, options)`: Sends a transaction creating a new vesting contract to the network and waits for confirmation.
- `createRedeemVestingTransaction(params, options)`: Returns a serialized transaction redeeming a vesting contract.
- `sendRedeemVestingTransaction(params, options)`: Sends a transaction redeeming a vesting contract.
- `sendSyncRedeemVestingTransaction(params, options)`: Sends a transaction redeeming a vesting contract and waits for confirmation.
- `createNewHtlcTransaction(params, options)`: Returns a serialized transaction creating a new HTLC contract.
- `sendNewHtlcTransaction(params, options)`: Sends a transaction creating a new HTLC contract.
- `sendSyncNewHtlcTransaction(params, options)`: Sends a transaction creating a new HTLC contract and waits for confirmation.
- `createRedeemRegularHtlcTransaction(params, options)`: Returns a serialized transaction redeeming an HTLC contract.
- `sendRedeemRegularHtlcTransaction(params, options)`: Sends a transaction redeeming an HTLC contract.
- `sendSyncRedeemRegularHtlcTransaction(params, options)`: Sends a transaction redeeming a new HTLC contract and waits for confirmation.
- `createRedeemTimeoutHtlcTransaction(params, options)`: Returns a serialized transaction redeeming a HTLC contract using the `TimeoutResolve` method.
- `sendRedeemTimeoutHtlcTransaction(params, options)`: Sends a transaction redeeming a HTLC contract using the `TimeoutResolve` method to network.
- `sendSyncRedeemTimeoutHtlcTransaction(params, options)`: Sends a transaction redeeming a HTLC contract using the `TimeoutResolve` method to network and waits for confirmation.
- `createRedeemEarlyHtlcTransaction(params, options)`: Returns a serialized transaction redeeming a HTLC contract using the `EarlyResolve` method.
- `sendRedeemEarlyHtlcTransaction(params, options)`: Sends a transaction redeeming a HTLC contract using the `EarlyResolve` method.
- `sendSyncRedeemEarlyHtlcTransaction(params, options)`: Sends a transaction redeeming a HTLC contract using the `EarlyResolve` method and waits for confirmation.
- `signRedeemEarlyHtlcTransaction(params, options)`: Returns a serialized signature that can be used to redeem funds from a HTLC contract using the `EarlyResolve` method.
- `createNewStakerTransaction(params, options)`: Returns a serialized `new_staker` transaction.
- `sendNewStakerTransaction(params, options)`: Sends a `new_staker` transaction.
- `sendSyncNewStakerTransaction(params, options)`: Sends a `new_staker` transaction and waits for confirmation.
- `createStakeTransaction(params, options)`: Returns a serialized `stake` transaction.
- `sendStakeTransaction(params, options)`: Sends a `stake` transaction.
- `sendSyncStakeTransaction(params, options)`: Sends a `stake` transaction and waits for confirmation.
- `createUpdateStakerTransaction(params, options)`: Returns a serialized `update_staker` transaction.
- `sendUpdateStakerTransaction(params, options)`: Sends a `update_staker` transaction.
- `sendSyncUpdateStakerTransaction(params, options)`: Sends a `update_staker` transaction and waits for confirmation.
- `createSetActiveStakeTransaction(params, options)`: Returns a serialized `set_active_stake` transaction.
- `sendSetActiveStakeTransaction(params, options)`: Sends a `set_active_stake` transaction.
- `sendSyncSetActiveStakeTransaction(params, options)`: Sends a `set_active_stake` transaction and waits for confirmation.
- `createRetireStakeTransaction(params, options)`: Returns a serialized `retire_stake` transaction.
- `sendRetireStakeTransaction(params, options)`: Sends a `retire_stake` transaction.
- `sendSyncRetireStakeTransaction(params, options)`: Sends a `retire_stake` transaction and waits for confirmation.
- `createRemoveStakeTransaction(params, options)`: Returns a serialized `remove_stake` transaction.
- `sendRemoveStakeTransaction(params, options)`: Sends a `remove_stake` transaction.
- `sendSyncRemoveStakeTransaction(params, options)`: Sends a `remove_stake` transaction and waits for confirmation.
- `createNewValidatorTransaction(params, options)`: Returns a serialized `new_validator` transaction.
- `sendNewValidatorTransaction(params, options)`: Sends a `new_validator` transaction.
- `sendSyncNewValidatorTransaction(params, options)`: Sends a `new_validator` transaction and waits for confirmation.
- `createUpdateValidatorTransaction(params, options)`: Returns a serialized `update_validator` transaction.
- `sendUpdateValidatorTransaction(params, options)`: Sends a `update_validator` transaction.
- `sendSyncUpdateValidatorTransaction(params, options)`: Sends a `update_validator` transaction and waits for confirmation.
- `createDeactivateValidatorTransaction(params, options)`: Returns a serialized `inactivate_validator` transaction.
- `sendDeactivateValidatorTransaction(params, options)`: Sends a `inactivate_validator` transaction.
- `sendSyncDeactivateValidatorTransaction(params, options)`: Sends a `inactivate_validator` transaction and waits for confirmation.
- `createReactivateValidatorTransaction(params, options)`: Returns a serialized `reactivate_validator` transaction.
- `sendReactivateValidatorTransaction(params, options)`: Sends a `reactivate_validator` transaction.
- `sendSyncReactivateValidatorTransaction(params, options)`: Sends a `reactivate_validator` transaction and waits for confirmation.
- `createRetireValidatorTransaction(params, options)`: Returns a serialized `retire_validator` transaction.
- `sendRetireValidatorTransaction(params, options)`: Sends a `retire_validator` transaction.
- `sendSyncRetireValidatorTransaction(params, options)`: Sends a `retire_validator` transaction and waits for confirmation.
- `createDeleteValidatorTransaction(params, options)`: Returns a serialized `delete_validator` transaction.
- `sendDeleteValidatorTransaction(params, options)`: Sends a `delete_validator` transaction.
- `sendSyncDeleteValidatorTransaction(params, options)`: Sends a `delete_validator` transaction and waits for confirmation.

### MempoolClient
The `MempoolClient` class provides methods to interact with the Nimiq Albatross Node's mempool.

#### Methods
- `pushTransaction(params, options)`: Pushes the given serialized transaction to the local mempool.
- `mempoolContent(params, options)`: Content of the mempool.
- `mempool(options)`: Obtains the mempool content in fee per byte buckets.
- `getMinFeePerByte(options)`: Obtains the minimum fee per byte as per mempool configuration.
- `getTransactionFromMempool(hash, options)`: Fetches a transaction from the mempool given its hash.

### NetworkClient
The `NetworkClient` class provides methods to interact with the Nimiq Albatross Node's network.

#### Methods
- `getPeerId(options)`: The peer ID for our local peer.
- `getPeerCount(options)`: Returns the number of peers.
- `getPeerList(options)`: Returns a list with the IDs of all our peers.

### PolicyClient
The `PolicyClient` class provides methods to interact with the Nimiq Albatross Node's policy.

#### Methods
- `getPolicyConstants(options)`: Gets a bundle of policy constants.
- `getEpochAt(blockNumber, options)`: Returns the epoch number at a given block number (height).
- `getEpochIndexAt(blockNumber, options)`: Returns the epoch index at a given block number.
- `getBatchAt(blockNumber, options)`: Returns the batch number at a given block number (height).
- `getBatchIndexAt(blockNumber, options)`: Returns the batch index at a given block number.
- `getElectionBlockAfter(blockNumber, options)`: Gets the number (height) of the next election macro block after a given block number (height).
- `getElectionBlockBefore(blockNumber, options)`: Gets the block number (height) of the preceding election macro block before a given block number (height).
- `getLastElectionBlock(blockNumber, options)`: Gets the block number (height) of the last election macro block at a given block number (height).
- `isElectionBlockAt(blockNumber, options)`: Gets a boolean expressing if the block at a given block number (height) is an election macro block.
- `getMacroBlockAfter(blockNumber, options)`: Gets the block number (height) of the next macro block after a given block number (height).
- `getMacroBlockBefore(blockNumber, options)`: Gets the block number (height) of the preceding macro block before a given block number (height).
- `getLastMacroBlock(blockNumber, options)`: Gets the block number (height) of the last macro block at a given block number (height).
- `isMacroBlockAt(blockNumber, options)`: Gets a boolean expressing if the block at a given block number (height) is a macro block.
- `isMicroBlockAt(blockNumber, options)`: Gets the block number (height) of the next micro block after a given block number (height).
- `getFirstBlockOfEpoch(epochIndex, options)`: Gets the block number (height) of the first block of the given epoch (which is always a micro block).
- `getBlockAfterReportingWindow(blockNumber, options)`: Gets the block number of the first block of the given reporting window (which is always a micro block).
- `getBlockAfterJail(blockNumber, options)`: Gets the block number of the first block of the given jail (which is always a micro block).
- `getFirstBlockOfBatch(batchIndex, options)`: Gets the block number of the first block of the given batch (which is always a micro block).
- `getElectionBlockOfEpoch(epochIndex, options)`: Gets the block number of the election macro block of the given epoch (which is always the last block).
- `getMacroBlockOfBatch(batchIndex, options)`: Gets the block number of the macro block (checkpoint or election) of the given batch (which is always the last block).
- `getFirstBatchOfEpoch(blockNumber, options)`: Gets a boolean expressing if the batch at a given block number (height) is the first batch of the epoch.
- `getSupplyAt(params, options)`: Gets the supply at a given time (as Unix time) in Lunas (1 NIM = 100,000 Lunas).

### SerdeHelper
The `SerdeHelper` class provides methods to serialize and deserialize data.

#### Methods
- `serializeToHex(params, options)`: Serializes a byte array to a hexadecimal string.
- `deserializeFromHex(params, options)`: Deserializes a hexadecimal string to a byte array.

### ValidatorClient
The `ValidatorClient` class provides methods to interact with the Nimiq Albatross Node's validator.

#### Methods
- `getAddress(options)`: Returns our validator address.
- `getSigningKey(options)`: Returns our validator signing key.
- `getVotingKey(options)`: Returns our validator voting key.
- `setAutomaticReactivation(params, options)`: Updates the configuration setting to automatically reactivate our validator.
- `isElected(options)`: Returns whether our validator is elected.
- `isSynced(options)`: Returns whether our validator is synced.

### WalletClient
The `WalletClient` class provides methods to interact with the Nimiq Albatross Node's wallet.

#### Methods
- `importRawKey(params, options)`: Imports a raw key into the wallet.
- `isAccountImported(address, options)`: Checks if an account is imported.
- `listAccounts(options)`: Lists all imported accounts.
- `lockAccount(address, options)`: Locks an account.
- `createAccount(params, options)`: Creates a new account.
- `unlockAccount(address, params, options)`: Unlocks an account.
- `isAccountUnlocked(address, options)`: Checks if an account is unlocked.
- `sign(params, options)`: Signs a message with an account's key.
- `verifySignature(params, options)`: Verifies a signature.
- `removeAccount(address, options)`: Removes an account.

### ZkpComponentClient
The `ZkpComponentClient` class provides methods to interact with the Nimiq Albatross Node's ZKP component.

#### Methods
- `getZkpState(options)`: Returns the latest header number, block number and proof.

## License

Released under [MIT](/LICENSE) by [@blouflashdb](https://github.com/blouflashdb).
