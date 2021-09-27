import { Market, MARKETS } from '@project-serum/serum'
import { AccountInfo, Connection } from '@solana/web3.js'

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

export const getSerumMarketInfo = (symbol: string, canBeDeprecated: boolean = false) => {
  const match = MARKETS.find(
    ({ deprecated, name }) => name === symbol && ((!canBeDeprecated && !deprecated) || canBeDeprecated)
  )
  if (!match) {
    throw new Error(`Market not found: ${symbol}`)
  }

  return match
}

export const subscribeToSerumOrderBook = async (
  connection: Connection,
  symbol: string,
  side: 'ask' | 'bid',
  callback: (account: AccountInfo<Buffer>, market: Market) => void
): Promise<number> => {
  const { address, programId } = getSerumMarketInfo(symbol)
  const market = await Market.load(connection, address, undefined, programId)
  const { asks, bids } = market.decoded
  return connection.onAccountChange(side === 'ask' ? asks : bids, (account) => callback(account, market))
}
