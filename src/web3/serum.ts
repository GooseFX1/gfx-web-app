import { Market, MARKETS, OpenOrders } from '@project-serum/serum'
import { Order } from '@project-serum/serum/lib/market'
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js'
import { AVAILABLE_MARKETS, MarketSide } from '../context'

const getAsks = async (connection: Connection, pair: string, canBeDeprecated: boolean = false) => {
  const market = await getMarket(connection, pair, canBeDeprecated)
  return await market.loadAsks(connection)
}

const getBids = async (connection: Connection, pair: string, canBeDeprecated: boolean = false) => {
  const market = await getMarket(connection, pair, canBeDeprecated)
  return await market.loadBids(connection)
}

const getLatestBid = async (connection: Connection, pair: string, canBeDeprecated: boolean = false) => {
  const [[latestBid]] = (await getBids(connection, pair, canBeDeprecated)).getL2(1)
  return latestBid
}

const getMarket = async (
  connection: Connection,
  pair: string,
  canBeDeprecated: boolean = false
): Promise<Market> => {
  const { address, programId } = getMarketInfo(pair, canBeDeprecated)
  return await Market.load(connection, address, undefined, programId)
}

const getMarketFromAddress = (address: PublicKey) => {
  return AVAILABLE_MARKETS.find(({ address: x }) => x.toString() === address.toString())
}

const getMarketInfo = (pair: string, canBeDeprecated: boolean = false) => {
  const match = MARKETS.find(
    ({ deprecated, name }) => name === pair && ((!canBeDeprecated && !deprecated) || canBeDeprecated)
  )
  if (!match) {
    throw new Error(`Market not found: ${pair}`)
  }

  return match
}

const getOpenOrders = async (connection: Connection, market: Market, owner: PublicKey): Promise<OpenOrders[]> => {
  return await market.findOpenOrdersAccountsForOwner(connection, owner)
}

const getOrders = async (connection: Connection, market: Market, owner: PublicKey): Promise<Order[]> => {
  return await market.loadOrdersForOwner(connection, owner)
}

const subscribeToOrderBook = async (
  connection: Connection,
  market: Market,
  side: MarketSide,
  callback: (account: AccountInfo<Buffer>, market: Market) => void
): Promise<number> => {
  return connection.onAccountChange(market.decoded[side], (account) => callback(account, market))
}

export const serum = {
  getAsks,
  getBids,
  getLatestBid,
  getMarket,
  getMarketFromAddress,
  getMarketInfo,
  getOpenOrders,
  getOrders,
  subscribeToOrderBook
}
