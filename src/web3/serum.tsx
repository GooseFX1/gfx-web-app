import { Market, MARKETS } from '@project-serum/serum'
import { Connection } from '@solana/web3.js'

const getMarketInfo = (symbol: string, canBeDeprecated: boolean = false) => {
  const match = MARKETS.find(({ deprecated, name }) => name === symbol && ((!canBeDeprecated && !deprecated) || canBeDeprecated))
  if (!match) {
    throw new Error(`Market not found: ${symbol}`)
  }

  return match
}

export const getAsks = async (connection: Connection, symbol: string, canBeDeprecated: boolean = false) => {
  const { address, programId } = getMarketInfo(symbol, canBeDeprecated)
  const market = await Market.load(connection, address, {}, programId)
  return await market.loadAsks(connection)
}

export const getBids = async (connection: Connection, symbol: string, canBeDeprecated: boolean = false) => {
  const { address, programId } = getMarketInfo(symbol, canBeDeprecated)
  const market = await Market.load(connection, address, {}, programId)
  return await market.loadBids(connection)
}

export const getLatestBid = async (connection: Connection, symbol: string, canBeDeprecated: boolean = false) => {
  const { address, programId } = getMarketInfo(symbol, canBeDeprecated)
  const market = await Market.load(connection, address, {}, programId)
  return (await market.loadBids(connection)).getL2(1)[0][0]
}
