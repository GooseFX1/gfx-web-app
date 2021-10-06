import { Market, MARKETS, OpenOrders } from '@project-serum/serum'
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js'
import { MarketSide } from '../context'

export const getSerumAsks = async (connection: Connection, pair: string, canBeDeprecated: boolean = false) => {
  const market = await getSerumMarket(connection, pair, canBeDeprecated)
  return await market.loadAsks(connection)
}

export const getSerumBids = async (connection: Connection, pair: string, canBeDeprecated: boolean = false) => {
  const market = await getSerumMarket(connection, pair, canBeDeprecated)
  return await market.loadBids(connection)
}

export const getSerumLatestBid = async (connection: Connection, pair: string, canBeDeprecated: boolean = false) => {
  const [[price]] = (await getSerumBids(connection, pair, canBeDeprecated)).getL2(1)
  return price
}

export const getSerumMarket = async (
  connection: Connection,
  pair: string,
  canBeDeprecated: boolean = false
): Promise<Market> => {
  const { address, programId } = getSerumMarketInfo(pair, canBeDeprecated)
  return await Market.load(connection, address, undefined, programId)
}

export const getSerumMarketInfo = (pair: string, canBeDeprecated: boolean = false) => {
  const match = MARKETS.find(
    ({ deprecated, name }) => name === pair && ((!canBeDeprecated && !deprecated) || canBeDeprecated)
  )
  if (!match) {
    throw new Error(`Market not found: ${pair}`)
  }

  return match
}

export const getSerumOpenOrders = async (
  connection: Connection,
  pair: string,
  owner: PublicKey,
  canBeDeprecated: boolean = false
) => {
  const { address, programId } = await getSerumMarket(connection, pair, canBeDeprecated)
  const l = await OpenOrders.findForMarketAndOwner(connection, address, owner, programId)
  console.log(l)
}

export const subscribeToSerumOrderBook = async (
  connection: Connection,
  market: Market,
  side: MarketSide,
  callback: (account: AccountInfo<Buffer>, market: Market) => void
): Promise<number> => {
  return connection.onAccountChange(market.decoded[side], (account) => callback(account, market))
}
