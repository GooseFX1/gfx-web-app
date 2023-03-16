/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import { AccountInfo, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import React, {
  Dispatch,
  SetStateAction,
  ReactNode,
  useContext,
  useEffect,
  useState,
  FC,
  useCallback,
  useMemo
} from 'react'
import {
  CREATE_RISK_STATE_ACCOUNT_DISCRIMINANT,
  DEX_ID,
  FEES_ID,
  FEE_OUTPUT_REGISTER,
  FIND_FEES_DISCRIMINANT,
  FIND_FEES_DISCRIMINANT_LEN,
  MPG_ID,
  MPs,
  ORDERBOOK_P_ID,
  RISK_ID,
  RISK_MODEL_CONFIG_ACCT,
  RISK_OUTPUT_REGISTER,
  VALIDATE_ACCOUNT_HEALTH_DISCRIMINANT,
  VALIDATE_ACCOUNT_HEALTH_DISCRIMINANT_LEN,
  VALIDATE_ACCOUNT_LIQUIDATION_DISCRIMINANT,
  VAULT_MINT,
  VAULT_SEED
} from '../pages/TradeV3/perps/perpsConstants'
import { MarketProductGroup, TraderRiskGroup } from '../pages/TradeV3/perps/dexterity/accounts'
import { Fractional, NewOrderParams, Side } from '../pages/TradeV3/perps/dexterity/types'
import {
  computeHealth,
  convertToFractional,
  displayFractional,
  divFractional,
  getClosePositionPrice,
  getFeeConfigAcct,
  getLiquidationPrice,
  getMarketSigner,
  getPerpsMarketOrderPrice,
  getPythPrice,
  getRiskAndFeeSigner,
  getRiskSigner,
  getTraderRiskGroupAccount,
  int64to8,
  mulFractionals,
  reduceFractional,
  tradeHistoryInfo
} from '../pages/TradeV3/perps/utils'
import {
  INewOrderAccounts,
  IDepositFundsAccounts,
  IWithdrawFundsAccounts,
  ICancelOrderAccounts,
  ITraderBalances
} from '../types/dexterity_instructions'
import { useConnectionConfig } from './settings'
import * as anchor from '@project-serum/anchor'
import { Bid, Ask } from '../pages/TradeV3/perps/dexterity/types/Side'
import { ImmediateOrCancel, Limit, FillOrKill, PostOnly } from '../pages/TradeV3/perps/dexterity/types/OrderType'
import { DecrementTake } from '../pages/TradeV3/perps/dexterity/types/SelfTradeBehavior'
import { findAssociatedTokenAddress } from '../web3'
import {
  cancelOrderIx,
  depositFundsIx,
  initializeTRG,
  initTrgDepositIx,
  newOrderIx,
  withdrawFundsIx
} from '../pages/TradeV3/perps/ixUtils'
import { OrderDisplayType, OrderType, OrderInput, useOrder, IOrder, OrderSide } from './order'
import { notify, removeFloatingPointError } from '../utils'
import { pyth } from '../web3/pyth'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  adminCreateMarket,
  adminInitialiseMPG,
  initializeMarketProductGroup,
  updateFeesIx
} from '../pages/TradeV3/perps/adminUtils'
import { DEFAULT_ORDER_BOOK, OrderBook, useOrderBook } from './orderbook'
import { useCrypto } from './crypto'
import { get_leverage_used } from 'perps-wasm'

export const AVAILABLE_ORDERS_PERPS = [
  {
    display: 'market',
    side: 'bid',
    text: 'Market',
    tooltip: 'Market order is executed immediately at the best price available in the market.'
  },
  {
    display: 'limit',
    side: 'bid',
    text: 'Limit',
    tooltip: 'Limit order is executed only when the market reaches the price you specify.'
  },
  {
    display: 'market',
    side: 'ask',
    text: 'Market',
    tooltip: 'Market order is executed immediately at the best price available in the market.'
  },
  {
    display: 'limit',
    side: 'ask',
    text: 'Limit',
    tooltip: 'Limit order is executed only when the market reaches the price you specify.'
  }
]

interface ITraderRiskGroup {
  traderRiskGroup: TraderRiskGroup
  traderRiskGroupKey: PublicKey
  collateralAvailable: string
  averagePosition: ITraderHistory
  tradeHistory: ITraderHistory[]
  balances?: ITraderBalances[]
  marginAvailable: string
  pnl: string
  liquidationPrice: string
  maxQuantity: string
  currentLeverage: string
  availableLeverage: string
  onChainPrice: string
  openInterests: string
  health: string
}

interface ICollateralInfo {
  price: string
  name: string
}

interface DepositIx {
  txid: string
  slot: number
}

interface IPerpsInfo {
  marketProductGroup: MarketProductGroup
  traderInfo: ITraderRiskGroup
  marketProductGroupKey: PublicKey
  newOrder: () => Promise<DepositIx | void>
  closePosition: (orderbook: OrderBook, qtyToExit: Fractional) => Promise<DepositIx | void>
  cancelOrder: (orderId: string) => Promise<DepositIx | void>
  depositFunds: (amount: Fractional) => Promise<DepositIx | void>
  withdrawFunds: (amount: Fractional) => Promise<DepositIx | void>
  activeProduct: any
  order: IOrder
  setOrder: Dispatch<SetStateAction<IOrder>>
  setFocused: Dispatch<SetStateAction<OrderInput>>
  loading: boolean
  collateralInfo: ICollateralInfo
  setOrderBook: Dispatch<SetStateAction<OrderBook>>
}

export interface IActiveProduct {
  id: string
  orderbook_id: string
  bids: string
  asks: string
  event_queue: string
  tick_size: number
  decimals: number
}
export interface ITraderHistory {
  price: string
  quantity: string
  side: OrderSide | null
}

const TraderContext = React.createContext<IPerpsInfo | null>(null)

export function useTraderConfig() {
  const context = useContext(TraderContext)

  if (!context) throw new Error('Missing Trader Context')
  const {
    traderInfo,
    marketProductGroup,
    marketProductGroupKey,
    newOrder,
    closePosition,
    cancelOrder,
    depositFunds,
    withdrawFunds,
    activeProduct,
    order,
    setOrder,
    setFocused,
    loading,
    collateralInfo,
    setOrderBook
  } = context
  return {
    traderInfo,
    marketProductGroup,
    marketProductGroupKey,
    newOrder,
    closePosition,
    cancelOrder,
    depositFunds,
    withdrawFunds,
    activeProduct,
    order,
    setOrder,
    setFocused,
    loading,
    collateralInfo,
    setOrderBook
  }
}

export const TraderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMPG, setMPG] = useState<PublicKey>(new PublicKey(MPG_ID))
  const [currentTRG, setTRG] = useState<PublicKey | null>(null)
  const [traderRiskGroup, setTraderRiskGroup] = useState<TraderRiskGroup | null>(null)
  const [marketProductGroup, setMarketProductGroup] = useState<MarketProductGroup | null>(null)
  const [rawData, setRawData] = useState<{
    mpg: AccountInfo<Buffer>
    trg: AccountInfo<Buffer>
  }>({ mpg: null, trg: null })
  const [marginAvail, setMarginAvail] = useState<string>('0')
  const [pnl, setPnl] = useState<string>('0')
  const [activeProduct, setActiveProduct] = useState<IActiveProduct>(MPs[0])
  const [focused, setFocused] = useState<OrderInput>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [traderBalances, setTraderBalances] = useState<ITraderBalances[]>([])
  const [collateralInfo, setCollateralInfo] = useState<ICollateralInfo>({
    price: '0',
    name: ''
  })
  const [traderHistory, setTraderHistory] = useState<ITraderHistory[]>([])
  const [averagePosition, setAveragePosition] = useState<ITraderHistory>({
    price: '',
    quantity: '',
    side: null
  })
  const [orderBookCopy, setOrderBook] = useState<OrderBook>(DEFAULT_ORDER_BOOK)
  const [liquidationPrice, setLiquidationPrice] = useState('0')
  const [currentLeverage, setLeverage] = useState<string>('0')
  const [availableLeverage, setAvailLeverage] = useState<string>('0')
  const [maxQty, setMaxQty] = useState<string>('0.1')
  const [onChainPrice, setOnChainPrice] = useState<string>('0')
  const [openInterests, setOpenInterests] = useState<string>('0')
  const [accountHealth, setAccountHealth] = useState<string>('100')

  const [initTesting, setInitTesting] = useState<boolean>(false)

  const { order, setOrder } = useOrder()
  const { isSpot } = useCrypto()

  const wallet = useWallet()
  const { devnetConnection: connection } = useConnectionConfig()

  const refreshTraderRiskGroup = async () => {
    let trgAccount = null,
      trgFetch = null
    if (!currentTRG) {
      trgAccount = await getTraderRiskGroupAccount(wallet, connection)
      if (trgAccount) {
        setTRG(trgAccount.pubkey)
        trgFetch = trgAccount.pubkey
      }
    } else {
      trgFetch = currentTRG
    }

    trgFetch &&
      TraderRiskGroup.fetch(connection, trgFetch).then((trg) => {
        trg ? setTraderRiskGroup(trg[0]) : setTraderRiskGroup(null)
        trg && setRawData((prevState) => ({ ...prevState, trg: trg[1] }))
      })
  }

  const setMPGDetails = async () => {
    if (!isSpot) {
      MarketProductGroup.fetch(connection, new PublicKey(MPG_ID)).then((mpgRes) => {
        mpgRes ? setMarketProductGroup(mpgRes[0]) : setMarketProductGroup(null)
        mpgRes && setRawData((prevState) => ({ ...prevState, mpg: mpgRes[1] }))
      })

      refreshTraderRiskGroup()
    }
  }

  const setCollateralPrice = async () => {
    const collateralPrice = await getPythPrice(connection, 'Crypto.USDC/USD')
    setCollateralInfo({
      price: collateralPrice ? collateralPrice.toString() : '1',
      name: 'Crypto.USDC/USD'
    })
  }

  const perpsWasm = async () => {
    const wasm = await import('perps-wasm')
    const mpg = rawData.mpg
    const trg = rawData.trg
    try {
      const res = wasm.margin_available(mpg.data, trg.data)
      const avail = new Fractional({
        m: new anchor.BN(res.m.toString()),
        exp: new anchor.BN(Number(res.exp.toString()) + 5)
      })
      setMarginAvail(displayFractional(avail))
    } catch (e) {
      console.log('margin available error: ', e)
    }
    const pnl = wasm.unrealised_pnl(mpg.data, trg.data, BigInt(0))
    const pnlFrac = new Fractional({
      m: new anchor.BN(pnl.m.toString()),
      exp: new anchor.BN(Number(pnl.exp.toString()) + 5)
    })
    setPnl(displayFractional(pnlFrac))
    try {
      const res2 = wasm.get_liquidation_price(mpg.data, trg.data, BigInt(0))
      const liq = new Fractional({ m: new anchor.BN(res2.m.toString()), exp: new anchor.BN(res2.exp.toString()) })
      setLiquidationPrice(displayFractional(liq))
    } catch (e) {
      console.log('liquidation price error: ', e)
    }
    try {
      const re = wasm.get_max_quantity(mpg.data, trg.data, BigInt(0))
      const re2 = new Fractional({
        m: new anchor.BN(re.m.toString()),
        exp: new anchor.BN(Number(re.exp.toString()) + 5)
      })
      setMaxQty(displayFractional(re2))
    } catch (e) {
      console.log(e)
    }
    try {
      const re = wasm.get_leverage_used(mpg.data, trg.data)
      const re2 = new Fractional({ m: new anchor.BN(re.m.toString()), exp: new anchor.BN(re.exp.toString()) })
      setLeverage(displayFractional(re2))
    } catch (e) {
      console.log(e)
    }
    try {
      const re = wasm.get_leverage_available(mpg.data, trg.data)
      const re2 = new Fractional({ m: new anchor.BN(re.m.toString()), exp: new anchor.BN(re.exp.toString()) })
      setAvailLeverage(displayFractional(re2))
    } catch (e) {
      console.log(e)
    }
    try {
      const re = wasm.get_on_chain_price(mpg.data, BigInt(0))
      const re2 = new Fractional({ m: new anchor.BN(re.m.toString()), exp: new anchor.BN(re.exp.toString()) })
      setOnChainPrice(displayFractional(re2))
    } catch (e) {
      console.log(e)
    }
    try {
      const re = wasm.get_open_interests(mpg.data, BigInt(0))
      const re2 = new Fractional({
        m: new anchor.BN(re.m.toString()),
        exp: new anchor.BN(Number(re.exp.toString()) + 5)
      })
      setOpenInterests(displayFractional(re2))
    } catch (e) {
      console.log(e)
    }
    try {
      const re = wasm.get_health(mpg.data, trg.data)
      const re2 = new Fractional({
        m: new anchor.BN(re.m.toString()),
        exp: new anchor.BN(re.exp.toString())
      })
      const lessHealth = Number(displayFractional(re2))
      if (lessHealth && lessHealth < 0) {
        setAccountHealth((100 + lessHealth).toFixed(2))
      }
    } catch (e) {
      //console.log('health error:', e)
    }
  }

  const parseTraderInfo = async () => {
    const res = computeHealth(traderRiskGroup, marketProductGroup)
    setTraderBalances(res.balancesArray)
    const res2 = tradeHistoryInfo(traderRiskGroup, activeProduct, marketProductGroup)

    if (res2) {
      setAveragePosition(res2.averagePosition)
      setTraderHistory(res2.traderHistory)
    }

    // const liquidationP = getLiquidationPrice(res.traderPortfolioValue)
  }

  useEffect(() => {
    if (wallet.connected && !isSpot) {
      const refreshData = async () => {
        await setMPGDetails()
      }
      const t2 = setInterval(refreshData, 1000)
      return () => clearInterval(t2)
    } else {
      setTraderRiskGroup(null)
    }
  }, [wallet.connected, marketProductGroup, isSpot])

  const testing = async () => {
    //const res1 = await adminInitialiseMPG(connection, wallet)
    //console.log(res1)
    //const res2 = await adminCreateMarket(connection, wallet)
    //console.log(res2)
    //const res3 = await updateFeesIx(wallet, connection, {
    //  feeModelConfigAcct: marketProductGroup.feeModelConfigurationAcct
    //})
    // console.log(res3)
  }
  useEffect(() => {
    setMPG(new PublicKey(MPG_ID))
    setActiveProduct(MPs[0])
    setCollateralPrice()
  }, [])

  useEffect(() => {
    switch (focused) {
      case 'price':
      case 'size':
        return setOrder((prevState) => ({
          ...prevState,
          total: removeFloatingPointError((+order.price || 1) * +order.size)
        }))
      case 'total':
        return setOrder((prevState) => ({
          ...prevState,
          size: removeFloatingPointError(+order.total / (+order.price || 1))
        }))
    }
  }, [focused, order.price, order.size, order.total, activeProduct])

  const getNewOrderParams = () => {
    let n = '1'
    for (let i = 0; i < activeProduct.decimals; i++) n = n + '0'
    const decimalAdjustedQty = mulFractionals(
      convertToFractional(order.size.toString()),
      new Fractional({ m: new anchor.BN(n), exp: new anchor.BN(0) })
    )

    return {
      maxBaseQty: decimalAdjustedQty,
      side: order.side === 'buy' ? new Bid().toEncodable() : new Ask().toEncodable(),
      selfTradeBehavior: new DecrementTake().toEncodable(),
      matchLimit: new anchor.BN(10),
      orderType:
        order.display === 'market'
          ? { market: {} }
          : order.type === 'limit'
          ? new Limit().toEncodable()
          : order.type === 'ioc'
          ? new ImmediateOrCancel().toEncodable()
          : new PostOnly().toEncodable(),
      limitPrice: convertToFractional(order.price.toString())
    }
  }

  const newOrder = useCallback(async () => {
    const newOrderAccounts: INewOrderAccounts = {
        user: wallet.publicKey,
        traderRiskGroup: currentTRG,
        marketProductGroup: currentMPG,
        product: new PublicKey(activeProduct.id),
        aaobProgram: new PublicKey(ORDERBOOK_P_ID),
        orderbook: new PublicKey(activeProduct.orderbook_id),
        marketSigner: getMarketSigner(new PublicKey(activeProduct.id)),
        eventQueue: new PublicKey(activeProduct.event_queue),
        bids: new PublicKey(activeProduct.bids),
        asks: new PublicKey(activeProduct.asks),
        systemProgram: SystemProgram.programId,
        feeModelProgram: new PublicKey(FEES_ID),
        feeModelConfigurationAcct: getFeeConfigAcct(new PublicKey(MPG_ID)),
        traderFeeStateAcct: traderRiskGroup.feeStateAccount,
        feeOutputRegister: new PublicKey(FEE_OUTPUT_REGISTER),
        riskEngineProgram: new PublicKey(RISK_ID),
        riskModelConfigurationAcct: new PublicKey(RISK_MODEL_CONFIG_ACCT),
        riskOutputRegister: new PublicKey(RISK_OUTPUT_REGISTER),
        traderRiskStateAcct: traderRiskGroup.riskStateAccount,
        riskAndFeeSigner: getRiskAndFeeSigner(new PublicKey(MPG_ID))
      },
      newOrderParams = getNewOrderParams()
    const response = await newOrderIx(newOrderAccounts, newOrderParams, wallet, connection)
    refreshTraderRiskGroup()
    return response
  }, [traderRiskGroup, order, marketProductGroup])

  const closePosition = useCallback(
    async (orderbook: OrderBook, qtyToExit: Fractional) => {
      const priceToExit = getClosePositionPrice(displayFractional(qtyToExit), orderbook)
      let qty = mulFractionals(qtyToExit, new Fractional({ m: new anchor.BN('100000'), exp: new anchor.BN(0) }))
      if (qtyToExit && priceToExit) {
        let orderSide: any = new Ask().toEncodable()
        if (qty.m.toString()[0] === '-') {
          orderSide = new Bid().toEncodable()
          qty = mulFractionals(qty, new Fractional({ m: new anchor.BN(-1), exp: new anchor.BN(0) }))
        }
        const finalQty = displayFractional(qty)
        const qq = convertToFractional(finalQty)
        const newOrderAccounts: INewOrderAccounts = {
            user: wallet.publicKey,
            traderRiskGroup: currentTRG,
            marketProductGroup: currentMPG,
            product: new PublicKey(activeProduct.id),
            aaobProgram: new PublicKey(ORDERBOOK_P_ID),
            orderbook: new PublicKey(activeProduct.orderbook_id),
            marketSigner: getMarketSigner(new PublicKey(activeProduct.id)),
            eventQueue: new PublicKey(activeProduct.event_queue),
            bids: new PublicKey(activeProduct.bids),
            asks: new PublicKey(activeProduct.asks),
            systemProgram: SystemProgram.programId,
            feeModelProgram: new PublicKey(FEES_ID),
            feeModelConfigurationAcct: getFeeConfigAcct(new PublicKey(MPG_ID)),
            traderFeeStateAcct: traderRiskGroup.feeStateAccount,
            feeOutputRegister: new PublicKey(FEE_OUTPUT_REGISTER),
            riskEngineProgram: new PublicKey(RISK_ID),
            riskModelConfigurationAcct: new PublicKey(RISK_MODEL_CONFIG_ACCT),
            riskOutputRegister: new PublicKey(RISK_OUTPUT_REGISTER),
            traderRiskStateAcct: traderRiskGroup.riskStateAccount,
            riskAndFeeSigner: getRiskAndFeeSigner(new PublicKey(MPG_ID))
          },
          newOrderParams = {
            maxBaseQty: qq,
            side: orderSide,
            selfTradeBehavior: new DecrementTake().toEncodable(),
            matchLimit: new anchor.BN(10),
            orderType: { market: {} },
            limitPrice: convertToFractional(priceToExit.toString())
          }
        const response = await newOrderIx(newOrderAccounts, newOrderParams, wallet, connection)
        refreshTraderRiskGroup()
        return response
      } else {
        notify({
          message: 'price changed!',
          description: 'fail'
        })
      }
      return null
    },
    [traderRiskGroup, traderBalances, marketProductGroup]
  )

  const cancelOrder = useCallback(
    async (orderId: string) => {
      const cancelOrderAccounts: ICancelOrderAccounts = {
        user: wallet.publicKey,
        traderRiskGroup: currentTRG,
        marketProductGroup: currentMPG,
        product: new PublicKey(activeProduct.id),
        aaobProgram: new PublicKey(ORDERBOOK_P_ID),
        orderbook: new PublicKey(activeProduct.orderbook_id),
        marketSigner: getMarketSigner(new PublicKey(activeProduct.id)),
        eventQueue: new PublicKey(activeProduct.event_queue),
        bids: new PublicKey(activeProduct.bids),
        asks: new PublicKey(activeProduct.asks),
        systemProgram: SystemProgram.programId,
        riskEngineProgram: new PublicKey(RISK_ID),
        riskModelConfigurationAcct: new PublicKey(RISK_MODEL_CONFIG_ACCT),
        riskOutputRegister: new PublicKey(RISK_OUTPUT_REGISTER),
        traderRiskStateAcct: traderRiskGroup.riskStateAccount,
        riskAndFeeSigner: getRiskAndFeeSigner(new PublicKey(MPG_ID))
      }
      const response = await cancelOrderIx(
        cancelOrderAccounts,
        { orderId: new anchor.BN(orderId) },
        wallet,
        connection
      )
      refreshTraderRiskGroup()
      return response
    },
    [traderRiskGroup, marketProductGroup]
  )

  const depositFunds = useCallback(
    async (amount: Fractional) => {
      const newTrg = anchor.web3.Keypair.generate()
      const depositFundsAccounts: IDepositFundsAccounts = {
        userTokenAccount: await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(VAULT_MINT)),
        traderRiskGroup: currentTRG ?? newTrg.publicKey,
        marketProductGroup: new PublicKey(MPG_ID),
        marketProductGroupVault: anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from(VAULT_SEED), new PublicKey(MPG_ID).toBuffer()],
          new PublicKey(DEX_ID)
        )[0]
      }
      if (traderRiskGroup) {
        if (traderRiskGroup.totalDeposited.m.toString()) {
          const amt = Number(traderRiskGroup.totalDeposited.m.toString())
          if (amt > 0) {
            notify({
              message: 'Failed to deposit',
              description: 'You have already deposited 500$! Cannot deposit more.',
              type: 'error'
            })
            return null
          }
        }
      }
      const response = traderRiskGroup
        ? await depositFundsIx(depositFundsAccounts, { quantity: amount }, wallet, connection)
        : await initTrgDepositIx(depositFundsAccounts, { quantity: amount }, wallet, connection, newTrg)
      refreshTraderRiskGroup()
      return response
    },
    [traderRiskGroup, marketProductGroup, wallet]
  )

  const withdrawFunds = useCallback(
    async (amount: Fractional) => {
      const withdrawFundsAccounts: IWithdrawFundsAccounts = {
        userTokenAccount: await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(VAULT_MINT)),
        traderRiskGroup: await (await getTraderRiskGroupAccount(wallet, connection)).pubkey,
        marketProductGroup: new PublicKey(MPG_ID),
        marketProductGroupVault: anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from(VAULT_SEED), new PublicKey(MPG_ID).toBuffer()],
          new PublicKey(DEX_ID)
        )[0],
        riskEngineProgram: new PublicKey(RISK_ID),
        riskModelConfigurationAcct: new PublicKey(RISK_MODEL_CONFIG_ACCT),
        riskOutputRegister: new PublicKey(RISK_OUTPUT_REGISTER),
        traderRiskStateAcct: traderRiskGroup.riskStateAccount,
        riskSigner: getRiskSigner()
      }
      const response = await withdrawFundsIx(withdrawFundsAccounts, { quantity: amount }, wallet, connection)
      refreshTraderRiskGroup()
      return response
    },
    [traderRiskGroup, marketProductGroup]
  )

  useEffect(() => {
    if (traderRiskGroup && marketProductGroup) {
      parseTraderInfo()
      //testing()
    }
  }, [traderRiskGroup, marketProductGroup])

  useEffect(() => {
    if (marketProductGroup && !initTesting) {
      setInitTesting(true)
      testing()
    }
  }, [marketProductGroup])

  useEffect(() => {
    if (rawData.mpg && rawData.trg) {
      perpsWasm()
    }
  }, [rawData])

  useEffect(() => {
    if (order.display === 'market') {
      const qty = order.size ?? 0
      const priceMarket = getPerpsMarketOrderPrice(orderBookCopy, order.side, qty.toString())
      setOrder((prevState) => ({
        ...prevState,
        price: priceMarket
      }))
    }
  }, [order.display, order.size, order.total, orderBookCopy, order.side])

  const collateralAvailable: string = useMemo(() => {
    if (traderRiskGroup && traderRiskGroup.cashBalance) {
      const balance = Number(displayFractional(traderRiskGroup.cashBalance))
      if (balance) {
        return (balance / 100000).toFixed(2)
      } else return '0'
    } else {
      return '0'
    }
  }, [traderRiskGroup])

  return (
    <TraderContext.Provider
      value={{
        traderInfo: {
          traderRiskGroup,
          traderRiskGroupKey: currentTRG,
          collateralAvailable,
          balances: traderBalances,
          averagePosition: averagePosition,
          tradeHistory: traderHistory,
          marginAvailable: marginAvail,
          pnl: pnl,
          liquidationPrice: liquidationPrice,
          currentLeverage: currentLeverage,
          maxQuantity: maxQty,
          onChainPrice: onChainPrice,
          availableLeverage: availableLeverage,
          openInterests: openInterests,
          health: accountHealth
        },
        marketProductGroup: marketProductGroup,
        marketProductGroupKey: currentMPG,
        setOrderBook,
        newOrder: newOrder,
        closePosition: closePosition,
        cancelOrder: cancelOrder,
        depositFunds: depositFunds,
        withdrawFunds: withdrawFunds,
        activeProduct: activeProduct,
        order: order,
        setOrder: setOrder,
        setFocused: setFocused,
        loading: loading,
        collateralInfo: collateralInfo
      }}
    >
      {children}
    </TraderContext.Provider>
  )
}
