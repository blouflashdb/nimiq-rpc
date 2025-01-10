# Nimiq RPC Client for TypeScript
[![JSR](https://jsr.io/badges/@blouflash/nimiq-rpc)](https://jsr.io/@blouflash/nimiq-rpc)
[![JSR Score](https://jsr.io/badges/@blouflash/nimiq-rpc/score)](https://jsr.io/@blouflash/nimiq-rpc)
[![Made with Deno](https://img.shields.io/badge/Deno-2-f7df1e?logo=deno&logoColor=white)](https://deno.land "Go to Deno homepage")
[![License](https://img.shields.io/badge/License-MIT-f7df1e)](#license)

A fully typed Nimiq RPC client for Nodejs and Deno.

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

## License

Released under [MIT](/LICENSE) by [@blouflashdb](https://github.com/blouflashdb).
