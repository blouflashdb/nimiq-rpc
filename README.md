# Nimiq RPC Client for TypeScript
[![JSR](https://jsr.io/badges/@blouflash/nimiq-rpc)](https://jsr.io/@blouflash/nimiq-rpc)
[![JSR Score](https://jsr.io/badges/@blouflash/nimiq-rpc/score)](https://jsr.io/@blouflash/nimiq-rpc)
[![Made with Deno](https://img.shields.io/badge/Deno-2-f7df1e?logo=deno&logoColor=white)](https://deno.land "Go to Deno homepage")
[![License](https://img.shields.io/badge/License-MIT-f7df1e)](#license)

A fully typed Nimiq RPC client for Nodejs and Deno.

## How to use

### Installation
deno:

`deno add jsr:@blouflash/nimiq-rpc`

npm:

`npx jsr add @blouflash/nimiq-rpc`

pnpm: 

`pnpm dlx jsr add @blouflash/nimiq-rpc`

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

## License

Released under [MIT](/LICENSE) by [@blouflashdb](https://github.com/blouflashdb).
