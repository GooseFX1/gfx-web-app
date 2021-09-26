import { Market, MARKETS } from '@project-serum/serum'
import { Connection } from '@solana/web3.js'

const getSerumMarketInfo = (symbol: string, canBeDeprecated: boolean = false) => {
  const match = MARKETS.find(
    ({ deprecated, name }) => name === symbol && ((!canBeDeprecated && !deprecated) || canBeDeprecated)
  )
  if (!match) {
    throw new Error(`Market not found: ${symbol}`)
  }

  return match
}

export const getSerumAsks = async (connection: Connection, symbol: string, canBeDeprecated: boolean = false) => {
  const { address, programId } = getSerumMarketInfo(symbol, canBeDeprecated)
  const market = await Market.load(connection, address, undefined, programId)
  return await market.loadAsks(connection)
}

export const getSerumBids = async (connection: Connection, symbol: string, canBeDeprecated: boolean = false) => {
  const { address, programId } = getSerumMarketInfo(symbol, canBeDeprecated)
  const market = await Market.load(connection, address, undefined, programId)
  return await market.loadBids(connection)
}

export const getSerumLatestBid = async (connection: Connection, symbol: string, canBeDeprecated: boolean = false) => {
  const [[price]] = (await getSerumBids(connection, symbol, canBeDeprecated)).getL2(1)
  return price
}
