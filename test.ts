import { NimiqRPCClient } from "./main.ts";

const client = new NimiqRPCClient("http://localhost:8648");

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
  { maxReconnects: 5, reconnectTimeout: 1000, callTimeout: 10000 },
  { filter: (_data) => true },
);

console.log(subscribtion.getSubscriptionId());

subscribtion.close();
