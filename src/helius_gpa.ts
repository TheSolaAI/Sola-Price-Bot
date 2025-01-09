import { config } from "../config";
import fetch from "node-fetch";

const url = `https://mainnet.helius-rpc.com/?api-key=${config.HELIUS_KEY}`;

export const findHolders = async () => {
  let page = 1;
    let owner_count = 0;

  while (true) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "getTokenAccounts",
        id: "test",
        params: {
          page: page,
          limit: 1000,
          displayOptions: {},
          mint: "B5UsiUYcTD3PcQa8r2uXcVgRmDL8jUYuXPiYjrY7pump",
        },
      }),
    });

		// Check if any error in the response
      if (!response.ok) {
        console.log(
          `Error: ${response.status}, ${response.statusText}`
        );
        break;
      }

    const data = await response.json();

    if (!data.result || data.result.token_accounts.length === 0) {
      console.log(`No more results. Total pages: ${page - 1}`);

      break;
    }
    console.log(`Processing results from page ${page}`);
    data.result.token_accounts.forEach((account:any) =>
      owner_count+=1
    );
    page++;
  }

    return owner_count;
 
};


