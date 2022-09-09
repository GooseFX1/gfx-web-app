import { Market, MARKETS, OpenOrders } from '@project-serum/serum'
import { Order } from '@project-serum/serum/lib/market'
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js'
import { AVAILABLE_MARKETS, MarketSide } from '../context'

const getLatestBid = async (connection: Connection, pair: string, canBeDeprecated = false) => {
  const [[latestBid]] = (await (await getMarket(connection, pair, canBeDeprecated)).loadBids(connection)).getL2(1)
  return latestBid
}

const getMarket = async (connection: Connection, pair: string, canBeDeprecated = false): Promise<Market> => {
  const { address, programId } = getMarketInfo(pair, canBeDeprecated)
  return await Market.load(connection, address, undefined, programId)
}

const getMarketFromAddress = (address: PublicKey) =>
  AVAILABLE_MARKETS.find(({ address: x }) => x.toString() === address.toString())

const getMarketInfo = (pair: string, canBeDeprecated = false) => {
  if (pair === 'GOFX/USDC') {
    return {
      name: 'GOFX/USDC',
      programId: new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'),
      deprecated: false,
      address: new PublicKey('2wgi2FabNsSDdb8dke9mHFB67QtMYjYa318HpSqyJLDD')
    }
  }

  const match = MARKETS.find(
    ({ deprecated, name }) => name === pair && ((!canBeDeprecated && !deprecated) || canBeDeprecated)
  )
  if (!match) {
    throw new Error(`Market not found: ${pair}`)
  }

  return match
}

const getOpenOrders = async (connection: Connection, market: Market, owner: PublicKey): Promise<OpenOrders[]> =>
  await market.findOpenOrdersAccountsForOwner(connection, owner)

const getOrders = async (connection: Connection, market: Market, owner: PublicKey): Promise<Order[]> =>
  await market.loadOrdersForOwner(connection, owner)

const subscribeToOrderBook = async (
  connection: Connection,
  market: Market,
  side: MarketSide,
  callback: (account: AccountInfo<Buffer>, market: Market) => void //eslint-disable-line
): Promise<number> => connection.onAccountChange(market.decoded[side], (account) => callback(account, market))

export const serum = {
  getLatestBid,
  getMarket,
  getMarketFromAddress,
  getMarketInfo,
  getOpenOrders,
  getOrders,
  subscribeToOrderBook
}
