import DiscordJs, { VoiceChannel } from "discord.js";
import Cron from "cron";
import axios from "axios";
import { config } from "../config";
import { findHolders } from "./helius_gpa";

export const client = new DiscordJs.Client({
  intents: [],
});

client.login(config.TOKEN);

client.on("ready", async () => {
  console.log("Price Tracker Bot Connected!");
});


let price_query =  `query {
  getTokenPrices(
    inputs: [
      { address: "B5UsiUYcTD3PcQa8r2uXcVgRmDL8jUYuXPiYjrY7pump", networkId: 1399811149 }
    ]
  ) {
    priceUsd
  }
}`



let headers = {
        "Content-Type": "application/json",
        "Authorization": config.DEFINED_KEY
      }

async function price_channel(price: number) { 
    try {
        let id = config.PRICE_ID
        if (!id) { 
            console.error("Price ID not found!");
            return;
        }
        const channel = await client.channels.fetch(id.toString());
        
        if (!channel) {
            console.error("Channel not found!");
            return;
        }
        if (channel instanceof VoiceChannel) {
            
            const newChannel = await channel.setName(`Price: $${price.toFixed(2)}`);
            console.log(`The channel's new name is: ${newChannel.name}`);
        } else {
            console.error("The channel is not a voice channel.");
        }
    } catch (error) {
        console.error("Error updating channel name:", error);
    }
}

async function holders_channel(holders:number) { 
    try {

        let id = config.HOLDERS_ID
        if (!id) { 
            console.error("Price ID not found!");
            return;
        }
        const channel = await client.channels.fetch(id.toString());
        if (!channel) {
            console.error("Channel not found!");
            return;
        }
        if (channel instanceof VoiceChannel) {
            const newChannel = await channel.setName(`Holders: ${holders}`);
            console.log(`The channel's new name is: ${newChannel.name}`);
        } else {
            console.error("The channel is not a voice channel.");
        }
    } catch (error) {
        console.error("Error updating channel name:", error);
    }
}

async function mcap_channel(price:number) { 
    try {

        let id = config.MCAP_ID;
        if (!id) { 
            console.error("Price ID not found!");
            return;
        }
        const channel = await client.channels.fetch(id.toString());
        if (!channel) {
            console.error("Channel not found!");
            return;
        }
        if (channel instanceof VoiceChannel) {
            const newChannel = await channel.setName(`Mcap: $${formatNumber(price)}`);
            console.log(`The channel's new name is: ${newChannel.name}`);
        } else {
            console.error("The channel is not a voice channel.");
        }
    } catch (error) {
        console.error("Error updating channel name:", error);
    }
}
function formatNumber(num:number) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toString();
  }
}

export const bot = async () => {
    async function setChannels() {
    
    try {
        axios.post(
          "https://graph.defined.fi/graphql",
          {
            query: price_query
          },{
            headers: headers,
          }
        ).then(async (response) => {
            let price = response.data.data.getTokenPrices[0]["priceUsd"];
            price_channel(price);
            mcap_channel(price * 1000000000);
          });
        const holders = findHolders();
        holders_channel(await holders);
        
    } catch (error) {
        console.log(error);
    }
  }

client.on("ready", async () => {
    setChannels();
    new Cron.CronJob(
      `*/${5} * * * *`,
      async function () {
        setChannels();
      },
      null,
      true
    );
  });
};


