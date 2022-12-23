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
  MPG_ID,
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
import { MarketProductGroup, TraderRiskGroup } from './dexterity/accounts'
import { pyth, SYSTEM } from '../../../web3'
import { Slab } from './instructions/Agnostic'

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
  console.log(address.toBase58())
  return address
}

export const getPythOracleAndClock = (connection: Connection): [anchor.web3.PublicKey, anchor.web3.PublicKey] => {
  if (connection.rpcEndpoint.includes('devnet')) {
    return [new PublicKey(PYTH_DEVNET), new PublicKey(PYTH_DEVNET)]
  } else {
    return [new PublicKey(PYTH_MAINNET), new PublicKey(PYTH_MAINNET)]
  }
}

export const getMarketSigner = (product_publicKey: PublicKey): anchor.web3.PublicKey => {
  const address = anchor.web3.PublicKey.findProgramAddressSync(
    [product_publicKey.toBuffer()],
    new PublicKey(DEX_ID)
  )
  return address[0]
}

export const getTraderFeeAcct = (traderRiskGroup: PublicKey): anchor.web3.PublicKey => {
  const address = findProgramAddressSync(
    [Buffer.from(TRADER_FEE_ACCT_SEED), traderRiskGroup.toBuffer(), new PublicKey(MPG_ID).toBuffer()],
    new PublicKey(FEES_ID)
  )[0]
  return address
}

export const getRiskSigner = (): anchor.web3.PublicKey => {
  const address = findProgramAddressSync([new PublicKey(MPG_ID).toBuffer()], new PublicKey(DEX_ID))[0]
  return address
}

export const getFeeModelConfigAcct = (): anchor.web3.PublicKey => {
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

export const getTraderRiskGroupAccount = async (wallet: any, connection: Connection): Promise<any> => {
  const response = await connection.getParsedProgramAccounts(new PublicKey(DEX_ID), {
    filters: [
      {
        dataSize: 63632 // number of bytes
      },
      {
        memcmp: {
          offset: 48,
          /** data to match, a base-58 encoded string and limited to less than 129 bytes */
          bytes: wallet.publicKey.toBase58()
        }
      },
      {
        memcmp: {
          offset: 16,
          /** data to match, a base-58 encoded string and limited to less than 129 bytes */
          bytes: MPG_ID
        }
      }
    ]
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
  if (base.length === decimals) return '0.' + base
  if (base.length < decimals) return '0.' + '0'.repeat(decimals - base.length) + base
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
  const finalM = new anchor.BN(Number(num1 + num2))
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
  const finalM = new anchor.BN(Number(num1 * num2))
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
    const askCheck = bid.m.toString().length < 17
    const bidCheck = ask.m.toString().length < 17

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
  for (let i = 0; i < traderRiskGroup.traderPositions.length; i++) {
    if (traderRiskGroup.traderPositions[i].productKey.toBase58() === SYSTEM.toBase58()) {
      continue
    } //account is not initiliazed hence skip
    const traderPos = traderRiskGroup.traderPositions[i]
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
    //console.log(price.toJSON())
    marginReq = addFractionals(marginReq, mulFractionals(outrightQty, price))
  }
  const retObj = {
    marginReq,
    totalAbsDollarPosition,
    //outrightQty,
    traderPortfolioValue
  }
  return retObj
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

export const loadBidsSlab = async (connection: Connection, bidAccount: string) => {
  const bidsInfo = await connection.getAccountInfo(new PublicKey(bidAccount), 'finalized')
  if (!bidsInfo?.data) {
    throw new Error('Invalid asks account')
  }
  return Slab.deserialize(bidsInfo.data, new anchor.BN(40))
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
