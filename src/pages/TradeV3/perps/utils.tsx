/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ALPHA,
  BETA,
  DERIVATIVE_SEED,
  DEX_ID,
  FEES_ID,
  FEES_SEED,
  GAMMA,
  INSTRUMENTS_ID,
  MPG_ID as MAINNET_MPG_ID,
  PYTH_DEVNET,
  PYTH_MAINNET,
  RISK_ID,
  RISK_OUTPUT_REGISTER,
  TRADER_FEE_ACCT_SEED,
  ZERO_FRACTIONAL
} from './perpsConstants'
import * as anchor from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import riskIdl from './idl/alpha_risk_engine.json'
import dexIdl from './idl/dex.json'
import { Fractional } from './dexterity/types'
import { ITraderBalances } from '../../../types/dexterity_instructions'
import { MarketProductGroup, TraderRiskGroup } from './dexterity/accounts'
import { pyth, SYSTEM } from '../../../web3'
import { Slab } from './instructions/Agnostic'
import { ITraderHistory } from '../../../context/trader_risk_group'
import { IActiveProduct } from '../../../context/market_product_group'
import { OrderBook, OrderSide } from '../../../context'

export const getDexProgram = async (connection: Connection, wallet: any): Promise<anchor.Program> => {
  const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions())
  const idl_o: any = dexIdl
  return new anchor.Program(idl_o, DEX_ID, provider)
}

export const getRiskProgram = (connection: Connection, wallet: any): anchor.Program => {
  const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions())
  const idl_o: any = riskIdl
  return new anchor.Program(idl_o, RISK_ID, provider)
}

export const int64to8 = (n: number): Uint8Array => {
  const arr = BigUint64Array.of(BigInt(n))
  return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength)
}

export const getDerivativeKey = (args): anchor.web3.PublicKey => {
  const seeds = [
    Buffer.from(DERIVATIVE_SEED),
    args.priceOracle.toBuffer(),
    args.marketProductGroup.toBuffer(),
    int64to8(args.instrumentType),
    int64to8(args.strike.m.toNumber()),
    int64to8(args.strike.exp.toNumber()),
    int64to8(args.initializationTime),
    int64to8(args.fullFundingPeriod),
    int64to8(args.minimumFundingPeriod)
  ]
  const address = anchor.web3.PublicKey.findProgramAddressSync(seeds, new PublicKey(INSTRUMENTS_ID))[0]
  return address
}

export const getPythOracleAndClock = (connection: Connection): [anchor.web3.PublicKey, anchor.web3.PublicKey] => {
  return [new PublicKey(PYTH_MAINNET), new PublicKey('SysvarC1ock11111111111111111111111111111111')]
  if (connection.rpcEndpoint.includes('devnet')) {
    return [new PublicKey(PYTH_DEVNET), new PublicKey('SysvarC1ock11111111111111111111111111111111')]
  } else {
    return [new PublicKey(PYTH_MAINNET), new PublicKey('SysvarC1ock11111111111111111111111111111111')]
  }
}

export const getMarketSigner = (product_publicKey: PublicKey): anchor.web3.PublicKey => {
  const address = anchor.web3.PublicKey.findProgramAddressSync(
    [product_publicKey.toBuffer()],
    new PublicKey(DEX_ID)
  )
  return address[0]
}

export const getTraderFeeAcct = (traderRiskGroup: PublicKey, MPG_ID: string): anchor.web3.PublicKey => {
  const address = findProgramAddressSync(
    [Buffer.from(TRADER_FEE_ACCT_SEED), traderRiskGroup.toBuffer(), new PublicKey(MPG_ID).toBuffer()],
    new PublicKey(FEES_ID)
  )[0]
  return address
}

export const getRiskSigner = (MPG_ID: string): anchor.web3.PublicKey => {
  const address = findProgramAddressSync([new PublicKey(MPG_ID).toBuffer()], new PublicKey(DEX_ID))[0]
  return address
}

export const getFeeModelConfigAcct = (MPG_ID: string): anchor.web3.PublicKey => {
  const address = findProgramAddressSync(
    [Buffer.from(FEES_SEED), new PublicKey(MPG_ID).toBuffer()],
    new PublicKey(FEES_ID)
  )[0]
  return address
}

export const getAllMPG = async (wallet: any, connection: Connection): Promise<any> => {
  const dexProgram = await getDexProgram(connection, wallet)
  const accounts = await dexProgram.account.marketProductGroup.all()
  return accounts
}

export const getAllMP = async (wallet: any, connection: Connection): Promise<any> => {
  const dexProgram = await getDexProgram(connection, wallet)
  const accounts = await dexProgram.account.marketProductGroup.all()
  return accounts
}

export const getTraderRiskGroupAccount = async (
  publicKey: PublicKey,
  connection: Connection,
  MPG_ID_OPT?: string
): Promise<any> => {
  const response = await connection.getParsedProgramAccounts(new PublicKey(DEX_ID), {
    filters: [
      //  {
      //    dataSize: 63632 // number of bytes
      //  },
      {
        memcmp: {
          offset: 48,
          /** data to match, a base-58 encoded string and limited to less than 129 bytes */
          bytes: publicKey.toBase58()
        }
      },
      {
        memcmp: {
          offset: 16,
          /** data to match, a base-58 encoded string and limited to less than 129 bytes */
          bytes: MPG_ID_OPT ? MPG_ID_OPT : MAINNET_MPG_ID
        }
      }
    ],
    commitment: 'processed'
  })
  if (response.length >= 1) return response[0]
  else return null
}

export const getFeeConfigAcct = (marketProductGroup: PublicKey): anchor.web3.PublicKey =>
  anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(FEES_SEED), marketProductGroup.toBuffer()],
    new PublicKey(FEES_ID)
  )[0]

export const getRiskAndFeeSigner = (marketProductGroup: PublicKey): anchor.web3.PublicKey =>
  anchor.web3.PublicKey.findProgramAddressSync(
    [marketProductGroup.toBuffer()],
    new anchor.web3.PublicKey(DEX_ID)
  )[0]

export const getRiskOutputRegister = async (
  wallet: any,
  connection: Connection
): Promise<anchor.web3.AccountInfo<Buffer>> => {
  const res2 = await connection.getAccountInfo(new PublicKey(RISK_OUTPUT_REGISTER))
  console.log(res2)
  return res2
}

export const displayFractional = (val: Fractional): string => {
  const base = val.m.toString()
  if (Number(base) === 0) return '0.00'
  const decimals = Number(val.exp.toString())
  if (decimals === 0) return base
  else if (base[0] === '-' && base.length - 1 === decimals) return '-0.' + base.slice(1, base.length)
  else if (base[0] === '-' && base.length - 1 < decimals)
    return '-0.' + '0'.repeat(decimals - base.length + 1) + base.slice(1, base.length)
  else if (base.length === decimals) return '0.' + base
  else if (base.length < decimals) return '0.' + '0'.repeat(decimals - base.length) + base
  else if (base.length > decimals && base[0] === '-')
    return base.slice(0, base.length - decimals) + '.' + base.slice(-decimals)
  return base.slice(0, -decimals) + '.' + base.slice(-decimals)
}

export const addFractionals = (a: Fractional, b: Fractional): Fractional => {
  let num1 = BigInt(a.m.toString())
  let num2 = BigInt(b.m.toString())
  const diff = BigInt(a.exp.toString()) - BigInt(b.exp.toString())
  const finalExp = a.exp.gt(b.exp) ? a.exp : b.exp
  if (diff < 0) {
    num1 = num1 * BigInt(10 ** Number(-diff))
  } else {
    num2 = num2 * BigInt(10 ** Number(diff))
  }
  const finalM = new anchor.BN((num1 + num2).toString())
  return new Fractional({
    m: finalM,
    exp: finalExp
  })
}

export const subFractionals = (a: Fractional, b: Fractional): Fractional => {
  let num1 = BigInt(a.m.toString())
  let num2 = BigInt(b.m.toString())
  const diff = BigInt(a.exp.toString()) - BigInt(b.exp.toString())
  const finalExp = a.exp.gt(b.exp) ? a.exp : b.exp
  if (diff < 0) {
    num1 = num1 * BigInt(10 ** Number(-diff))
  } else {
    num2 = num2 * BigInt(10 ** Number(diff))
  }
  const finalM = new anchor.BN(Number(num1 - num2))
  return new Fractional({
    m: finalM,
    exp: finalExp
  })
}

export const mulFractionals = (a: Fractional, b: Fractional): Fractional => {
  const num1 = BigInt(a.m.toString())
  const num2 = BigInt(b.m.toString())
  const finalExp = a.exp.add(b.exp)
  const finalM = new anchor.BN(BigInt(num1 * num2).toString())
  return new Fractional({
    m: finalM,
    exp: finalExp
  })
}

export const maxFractional = (a: Fractional, b: Fractional): Fractional => {
  let num1 = BigInt(a.m.toString())
  let num2 = BigInt(b.m.toString())
  const diff = BigInt(a.exp.toString()) - BigInt(b.exp.toString())
  if (diff < 0) {
    num1 = num1 * BigInt(10 ** Number(-diff))
  } else {
    num2 = num2 * BigInt(10 ** Number(diff))
  }
  if (num1 > num2) return a
  else return b
}

export const divFractional = (a: Fractional, b: Fractional): Fractional => {
  const sign = Number(a.m.toString()) < 0 || Number(b.m.toString()) < 0 ? -1 : 1
  let dividend = BigInt(a.m.toString())
  const divisor = BigInt(b.m.toString())
  let exp = Number(a.exp.toString()) - Number(b.exp.toString())
  dividend = dividend * BigInt(10 ** (10 - (exp > 0 ? exp : 0)))
  const quotient = dividend / divisor
  exp = exp - (exp > 0 ? exp : 0) + 10
  if (sign > -1) {
    return new Fractional({ m: new anchor.BN(quotient.toString()), exp: new anchor.BN(exp) })
  } else {
    return new Fractional({ m: new anchor.BN('-1' + quotient.toString()), exp: new anchor.BN(exp) })
  }
}

export const reduceFractional = (a: Fractional): Fractional => {
  const m = a.m.toString()
  const exp = a.exp.toString()
  let trailingZeroes = 0
  for (let i = 0; i < m.length; i++) {
    if (m[i] === '0') {
      trailingZeroes++
    } else {
      trailingZeroes = 0
    }
  }
  if (trailingZeroes > 0 && exp !== '0') {
    const zeroToShift = trailingZeroes > Number(exp) ? Number(exp) : trailingZeroes
    return new Fractional({
      m: new anchor.BN(m.substring(0, m.length - zeroToShift)),
      exp: new anchor.BN(Number(exp) - zeroToShift)
    })
  }
  return a
}

export const roundFractional = (a: Fractional, digits: string): Fractional => {
  if (BigInt(digits) >= BigInt(a.exp.toString())) return a
  else {
    const m = BigInt(a.m.toString()) / BigInt(10 ** (Number(a.exp.toString()) - Number(digits)))
    return new Fractional({ m: new anchor.BN(m.toString()), exp: new anchor.BN(digits) })
  }
}

export const greaterThanFractional = (a: Fractional, b: Fractional): boolean => {
  let num1 = BigInt(a.m.toString())
  let num2 = BigInt(b.m.toString())
  const diff = BigInt(a.exp.toString()) - BigInt(b.exp.toString())
  if (diff < 0) {
    num1 = num1 * BigInt(10 ** Number(-diff))
  } else {
    num2 = num2 * BigInt(10 ** Number(diff))
  }
  if (num1 > num2) return true
  else return false
}

export const fetchPrice = (marketProductGroup: MarketProductGroup, idx: number) => {
  const prevAsk = marketProductGroup.marketProducts.array[idx].value.outright.metadata.prices.prevAsk
  const prevBid = marketProductGroup.marketProducts.array[idx].value.outright.metadata.prices.prevBid
  const bid = marketProductGroup.marketProducts.array[idx].value.outright.metadata.prices.bid
  const ask = marketProductGroup.marketProducts.array[idx].value.outright.metadata.prices.ask

  const prevAskCheck = prevAsk.m.toString().length < 17
  const prevBidCheck = prevBid.m.toString().length < 17

  if (prevAskCheck && prevBidCheck) {
    const sumPrice = addFractionals(prevAsk, prevBid)
    return mulFractionals(sumPrice, new Fractional({ m: new anchor.BN(5), exp: new anchor.BN(1) }))
  } else if (prevAskCheck && !prevBidCheck) {
    return prevAsk
  } else if (!prevAskCheck && prevBidCheck) {
    return prevBid
  } else {
    const bidCheck = bid.m.toString().length < 17
    const askCheck = ask.m.toString().length < 17

    if (askCheck && bidCheck) {
      const sumPrice = addFractionals(ask, bid)
      return mulFractionals(sumPrice, new Fractional({ m: new anchor.BN(5), exp: new anchor.BN(1) }))
    } else if (askCheck && !bidCheck) {
      return ask
    } else if (!askCheck && bidCheck) {
      return bid
    } else {
      return new Fractional({ m: new anchor.BN(0), exp: new anchor.BN(0) })
    }
  }
}

export const computeHealth = (traderRiskGroup: TraderRiskGroup, marketProductGroup: MarketProductGroup) => {
  let traderPortfolioValue = addFractionals(traderRiskGroup.cashBalance, traderRiskGroup.pendingCashBalance)
  let marginReq = ZERO_FRACTIONAL
  const absDollarPosition: Fractional[] = [ZERO_FRACTIONAL]
  let totalAbsDollarPosition: Fractional = ZERO_FRACTIONAL
  const balancesArray: ITraderBalances[] = []
  for (let i = 0; i < traderRiskGroup.traderPositions.length; i++) {
    if (traderRiskGroup.traderPositions[i].productKey.toBase58() === SYSTEM.toBase58()) {
      continue
    } //account is not initiliazed hence skip
    const traderPos = traderRiskGroup.traderPositions[i]
    balancesArray.push({
      productKey: traderPos.productKey,
      balance: (Number(displayFractional(traderPos.position)) / 100000).toFixed(2),
      balanceFractional: new Fractional({
        m: traderPos.position.m,
        exp: new anchor.BN(Number(traderPos.position.exp) + 5)
      })
    })
    const idx = traderPos.productIndex.toJSON().userAccount
    const price = fetchPrice(marketProductGroup, Number(idx))
    const size = addFractionals(traderPos.position, traderPos.pendingPosition)
    const traderPosValue = mulFractionals(price, size)
    absDollarPosition[Number(idx)] = traderPosValue
    totalAbsDollarPosition = addFractionals(totalAbsDollarPosition, absDollarPosition[Number(idx)])
    traderPortfolioValue = addFractionals(traderPortfolioValue, traderPosValue)
    marginReq = addFractionals(marginReq, absDollarPosition[Number(idx)])
    const outrightQty = maxFractional(
      traderRiskGroup.openOrders.products[Number(idx)].askQtyInBook,
      traderRiskGroup.openOrders.products[Number(idx)].bidQtyInBook
    )
    marginReq = addFractionals(marginReq, mulFractionals(outrightQty, price))
  }
  const retObj = {
    marginReq,
    totalAbsDollarPosition,
    absDollarPosition,
    traderPortfolioValue,
    balancesArray
  }
  return retObj
}

const handleDecimalPrice = (price: number) => {
  const decimalPrice = price.toFixed(2)
  return decimalPrice
}

export const tradeHistoryInfo = (
  traderRiskGroup: TraderRiskGroup,
  activeProduct: IActiveProduct,
  marketProductGroup: MarketProductGroup
) => {
  let productIndex = null
  marketProductGroup.marketProducts.array[0].value.outright
  marketProductGroup.marketProducts.array.map((item, index) => {
    if (item.value.outright.metadata.productKey.toBase58() === activeProduct.id) productIndex = index
  })
  if (productIndex === null) return null
  const price = displayFractional(traderRiskGroup.avgPosition[productIndex].price)
  const qty = displayFractional(
    new Fractional({
      m: new anchor.BN(traderRiskGroup.avgPosition[productIndex].qty.m),
      exp: new anchor.BN((Number(traderRiskGroup.avgPosition[productIndex].qty.exp) + 5).toString())
    })
  )
  const avgPrice = Number(price) / activeProduct.tick_size
  const averagePosition: ITraderHistory = {
    price: handleDecimalPrice(avgPrice),
    quantity: qty[0] === '-' ? qty.slice(1, qty.length) : qty,
    side: avgPrice === 0 ? null : qty[0] === '-' ? 'buy' : 'sell'
  }
  let startingIndex = traderRiskGroup.tradeHistory[productIndex].latestIdx.userAccount.toNumber()
  if (startingIndex === 10) startingIndex = 9
  const traderHistory: ITraderHistory[] = []
  let count = 0
  for (let i = startingIndex; !(count > 0 && i === startingIndex); ) {
    const item = traderRiskGroup.tradeHistory[productIndex].price[i]
    const qty = new Fractional({
      m: new anchor.BN(traderRiskGroup.tradeHistory[productIndex].qty[i].m),
      exp: new anchor.BN((Number(traderRiskGroup.tradeHistory[productIndex].qty[i].exp) + 5).toString())
    })

    if (!item || !qty) continue
    const price = Number(displayFractional(item)) / activeProduct.tick_size

    if (item.m.toNumber() !== 0 || qty.m.toNumber() !== 0) {
      const qtyString = displayFractional(qty)
      traderHistory.push({
        price: handleDecimalPrice(price),
        quantity: qtyString[0] === '-' ? qtyString.slice(1, qtyString.length) : qtyString,
        side: qtyString[0] === '-' ? 'buy' : 'sell'
      })
    }
    i--
    count++
    if (i === -1) i = traderRiskGroup.tradeHistory[productIndex].qty.length - 1
  }
  //  traderRiskGroup.tradeHistory[productIndex].price.map((item, index) => {
  //    const qty = traderRiskGroup.tradeHistory[productIndex].qty[index]
  //    const price = Number(displayFractional(item)) / activeProduct.tick_size

  //    if (item.m.toNumber() !== 0 || qty.m.toNumber() !== 0) {
  //      const qtyString = displayFractional(qty)
  //      traderHistory.push({
  //        price: handleDecimalPrice(price),
  //        quantity: qtyString[0] === '-' ? qtyString.slice(1, qtyString.length) : qtyString,
  //        side: qtyString[0] === '-' ? 'buy' : 'sell'
  //      })
  //    }
  //  })
  return {
    averagePosition,
    traderHistory
  }
}

export const getLiquidationPrice = (portfolioValue: Fractional): Fractional => {
  if (portfolioValue.m.gte(new anchor.BN(0))) {
    return mulFractionals(portfolioValue, subFractionals(ALPHA, BETA))
  } else {
    return mulFractionals(
      portfolioValue,
      subFractionals(new Fractional({ m: new anchor.BN(1), exp: new anchor.BN(0) }), BETA)
    )
  }
}

export const getSocialLoss = (liquidationPrice: Fractional): Fractional => {
  if (liquidationPrice.m.gte(new anchor.BN(0))) return mulFractionals(liquidationPrice, GAMMA)
  return liquidationPrice
}

export const convertToFractional = (amount: string): Fractional => {
  const numberOfDecimals = (amount.match(/\./g) || []).length
  if (numberOfDecimals > 1) return null
  else if (numberOfDecimals === 0)
    return new Fractional({ m: new anchor.BN(Number(amount)), exp: new anchor.BN(0) })
  const oldDigitsAfterDecimal = amount.length - amount.indexOf('.') - 1
  //take only max 4 digits after decimal
  const numberAfterDecimal = amount.slice(-oldDigitsAfterDecimal)
  const maxFour = numberAfterDecimal.length > 4 ? numberAfterDecimal.slice(0, 4) : numberAfterDecimal
  const newdigitsAfterDecimal = numberAfterDecimal.length > 4 ? 4 : numberAfterDecimal.length
  const beforeDecimal = amount.slice(0, amount.length - oldDigitsAfterDecimal - 1)
  const newM = Number(beforeDecimal + maxFour)
  return new Fractional({ m: new anchor.BN(newM), exp: new anchor.BN(newdigitsAfterDecimal) })
}
const SLAB_DESERIALIZATION_OFFSET = 40;

export const loadSlab = async (connection: Connection, account: string) => {
  try {
  const accountInfo = await connection.getAccountInfo(new PublicKey(account), 'finalized')
    if (!accountInfo?.data) {
      throw new Error(`No data found for the account ${account}`);
    }
    return Slab.deserialize(accountInfo.data, SLAB_DESERIALIZATION_OFFSET);
  } catch (error) {
    console.error(`Failed to load or parse account ${account}:`, error);
    throw new Error(`Failed to load or parse account ${account}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPythPrice = async (connection: Connection, tokenName: string) => {
  try {
    const res = await pyth.fetchProducts(connection, [tokenName])
    const res2 = await pyth.fetchPriceAccounts(connection, res)
    return res2[0].price
  } catch (e) {
    return null
  }
}

export const getPerpsPrice = (orderbook: OrderBook): number => {
  const bids = orderbook.bids
  const asks = orderbook.asks
  if (bids.length && bids[0] && asks.length && asks[0]) return Math.round((bids[0][0] + asks[0][0]) * 50) / 100
  else if (bids.length) return bids[0][0]
  return 0
}

export const getPerpsMarketOrderPrice = (orderbook: OrderBook, side: 'buy' | 'sell', orderQty: string): number => {
  const bids = orderbook.bids
  const asks = orderbook.asks
  const qty = Number(orderQty)

  const orderbookSide = side === 'buy' ? asks : bids
  if (!orderbookSide || !orderbookSide.length) return 0
  if (!qty) return orderbookSide[0][0]

  if (qty === 0) return orderbookSide[0][0]
  let tempQty = qty,
    i = 0
  while (tempQty > 0) {
    if (orderbookSide.length - 1 < i) return orderbookSide[i - 1][0]
    if (tempQty < orderbookSide[i][1]) return orderbookSide[i][0]
    tempQty = tempQty - orderbookSide[i][1]
    i++
  }
  return 0
}

export const getClosePositionPrice = (qty: string, orderbook: OrderBook) => {
  let qtyNum = Number(qty)
  const orderbookSide = qtyNum < 0 ? orderbook.asks : orderbook.bids
  qtyNum = qtyNum < 0 ? qtyNum * -1 : qtyNum
  for (let i = 0; i < orderbookSide.length; i++) {
    if (qtyNum < orderbookSide[i][1]) return orderbookSide[i][0]
    qtyNum -= orderbookSide[i][1]
  }
  return null
}

export const getExitQuntity = (traderBalances, activeProduct) => {
  let qtyToExit: Fractional | null = null
  traderBalances.map((item) => {
    if (item.productKey.toBase58() === activeProduct.id) {
      qtyToExit = item.balanceFractional
    }
  })
  return qtyToExit
}

export const getExitQuantityInNumber = (traderBalances, activeProduct) => {
  let qtyToExit: number | null = null
  traderBalances.map((item) => {
    if (item.productKey.toBase58() === activeProduct.id) {
      qtyToExit = +item.balance
    }
  })
  return qtyToExit
}

export const truncateBigNumber = (bigNumber: number) => {
  if (!bigNumber || bigNumber === null) return 0

  try {
    if (bigNumber > 1000000) {
      const nArray = (bigNumber / 1000000).toString().split('.')
      const beforeDecimal = nArray[0]
      let afterDecimal = nArray.length > 1 ? nArray[1] : null
      if (!afterDecimal || afterDecimal === '0') afterDecimal = null
      else if (afterDecimal.length > 2) afterDecimal = afterDecimal.slice(0, 2)
      return beforeDecimal + (afterDecimal ? '.' + afterDecimal : '') + 'M'
    }
    if (bigNumber > 1000) {
      const nArray = (bigNumber / 1000).toString().split('.')
      const beforeDecimal = nArray[0]
      let afterDecimal = nArray[1]
      if (!afterDecimal || afterDecimal === '0') afterDecimal = null
      else if (afterDecimal.length > 2) afterDecimal = afterDecimal.slice(0, 2)
      return beforeDecimal + (afterDecimal ? '.' + afterDecimal : '') + 'K'
    }
    return Number(bigNumber.toFixed(2))
  } catch (error) {
    console.log('BIG NUM ERROR', bigNumber)
  }
}

export const getProfitAmount = (side: OrderSide, price: string | number, percentage: number) => {
  const pr = Number(price)
  const profitAmount = pr * percentage
  return side === 'buy' ? pr + profitAmount : pr - profitAmount
}

export const formatNumberInThousands = (number: number, minimumFractionDigits = 2, maximumFractionDigits = 2) =>
  number.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits
  })

export function convertUnixTimestampToFormattedDate(unixTimestamp: number) {
  // Create a new Date object using the Unix timestamp (in milliseconds)
  const date = new Date(unixTimestamp)

  // Format the date as "MM/DD/YYYY hh:mmAM/PM"
  const formattedDate = `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`

  return formattedDate
}
