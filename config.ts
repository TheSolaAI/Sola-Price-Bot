import dotenv from 'dotenv'

dotenv.config()

export const config = {
    TOKEN: process.env.TOKEN,
    PRICE_ID: process.env.price_id,
    HOLDERS_ID: process.env.holders_id,
    MCAP_ID: process.env.mcap_id,
    HELIUS_KEY: process.env.helius_key,
    DEFINED_KEY: process.env.defined_key,
}