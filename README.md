# Nimiq RPC Client for TypeScript

A fully typed Nimiq RPC client for Nodejs.

## How to use

### Usage

It is structured the same way as the [`Rust RPC Client`](https://github.com/nimiq/core-rs-albatross/tree/albatross/rpc-server/src/dispatchers)

```typescript
import { NimiqRPCClient } from '@blouflash/nimiq-rpc'

const url = 'NODE_URL'
const client = new NimiqRPCClient(new URL(url))
const { data: currentEpoch, error: errorCurrentEpoch } = await client.blockchain.getEpochNumber()
if (errorCurrentEpoch || !currentEpoch)
  throw new Error(errorCurrentEpoch?.message || 'No current epoch')

client.blockchain.getBlockNumber()
client.network.getPeerCount()
```
