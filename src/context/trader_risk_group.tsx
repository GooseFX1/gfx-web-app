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
  getFeeConfigAcct,
  getLiquidationPrice,
  getMarketSigner,
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
import { removeFloatingPointError } from '../utils'
import { pyth } from '../web3/pyth'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  adminCreateMarket,
  adminInitialiseMPG,
  initializeMarketProductGroup,
  updateFeesIx
} from '../pages/TradeV3/perps/adminUtils'
import { OrderBook } from './orderbook'

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
  newOrder: () => Promise<void>
  closePosition: (orderbook: OrderBook) => Promise<void>
  cancelOrder: (orderId: string) => Promise<void>
  depositFunds: (amount: Fractional) => Promise<DepositIx | void>
  withdrawFunds: (amount: Fractional) => Promise<void>
  activeProduct: any
  order: IOrder
  setOrder: Dispatch<SetStateAction<IOrder>>
  setFocused: Dispatch<SetStateAction<OrderInput>>
  loading: boolean
  collateralInfo: ICollateralInfo
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
    collateralInfo
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
    collateralInfo
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
  const { order, setOrder } = useOrder()

  const wallet = useWallet()
  const { connection } = useConnectionConfig()

  const refreshTraderRiskGroup = async () => {
    const traderRiskGroupAccount = await getTraderRiskGroupAccount(wallet, connection)
    if (traderRiskGroupAccount && traderRiskGroupAccount.pubkey) {
      setTRG(traderRiskGroupAccount.pubkey)
      TraderRiskGroup.fetch(connection, traderRiskGroupAccount.pubkey).then((trg) => {
        trg ? setTraderRiskGroup(trg[0]) : setTraderRiskGroup(null)
        trg && setRawData((prevState) => ({ ...prevState, trg: trg[1] }))
      })
    }
  }

  const setMPGDetails = async () => {
    MarketProductGroup.fetch(connection, new PublicKey(MPG_ID)).then((mpgRes) => {
      mpgRes ? setMarketProductGroup(mpgRes[0]) : setMarketProductGroup(null)
      mpgRes && setRawData((prevState) => ({ ...prevState, mpg: mpgRes[1] }))
    })

    refreshTraderRiskGroup()

    //if (traderRiskGroupAccount) {
    //  setTraderRiskGroup(traderRiskGroupAccount.pubkey)
    //  const riskStateAcct = new PublicKey([].slice.call(traderRiskGroupAccount.account.data).slice(2096, 2128))
    //  const feeState = new PublicKey([].slice.call(traderRiskGroupAccount.account.data).slice(2128, 2160))
    //  setTraderFeeStateAcct(feeState)
    //  console.log(feeState.toBase58())
    //  setTraderRiskStateAcct(riskStateAcct)
    //}
  }

  const setCollateralPrice = async () => {
    const collateralPrice = await getPythPrice(connection, 'Crypto.USDC/USD')
    setCollateralInfo({
      price: collateralPrice ? collateralPrice.toString() : '1',
      name: 'Crypto.USDC/USD'
    })
  }

  const perpsWasm = async () => {
    const ww = await import('perps-wasm')
    const mpg = rawData.mpg

    const trg = rawData.trg

    const res = ww.max_withrawable(mpg.data, trg.data)
    console.log('wasm result: ', res)
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
    if (wallet.connected) {
      if (!marketProductGroup) setMPGDetails()
      if (marketProductGroup) testing()
    } else {
      setTraderRiskGroup(null)
    }
  }, [wallet.connected, marketProductGroup])

  const testing = async () => {
    // const res1 = await adminInitialiseMPG(connection, wallet)
    // console.log(res1)
    // const res2 = await adminCreateMarket(connection, wallet)
    // console.log(res2)
    // const res3 = await updateFeesIx(wallet, connection, {
    //   feeModelConfigAcct: marketProductGroup.feeModelConfigurationAcct
    // })
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

  const getNewOrderParams = () => ({
    maxBaseQty: convertToFractional(order.size.toString()),
    side: order.side === 'buy' ? new Bid().toEncodable() : new Ask().toEncodable(),
    selfTradeBehavior: new DecrementTake().toEncodable(),
    matchLimit: new anchor.BN(10),
    orderType:
      order.type === 'limit'
        ? new Limit().toEncodable()
        : order.type === 'ioc'
        ? new ImmediateOrCancel().toEncodable()
        : new PostOnly().toEncodable(),
    limitPrice: convertToFractional(order.price.toString())
  })

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
  }, [traderRiskGroup, order, marketProductGroup])

  const closePosition = useCallback(
    async (orderbook: OrderBook) => {
      function getClosePositionPrice(qty: string) {
        let qtyNum = Number(qty)
        const orderbookSide = qtyNum < 0 ? orderbook.asks : orderbook.bids
        qtyNum = qtyNum < 0 ? qtyNum * -1 : qtyNum
        for (let i = 0; i < orderbookSide.length; i++) {
          if (qtyNum < orderbookSide[i][1]) return orderbookSide[i][0]
          qtyNum -= orderbookSide[i][1]
        }
        return null
      }
      let qtyToExit: Fractional | null = null,
        priceToExit = null
      traderBalances.map((item) => {
        if (item.productKey.toBase58() === activeProduct.id) {
          qtyToExit = item.balanceFractional
          priceToExit = getClosePositionPrice(displayFractional(qtyToExit))
        }
      })
      if (qtyToExit && priceToExit) {
        let orderSide: any = new Ask().toEncodable()
        console.log(qtyToExit.toJSON())
        if (qtyToExit.m.toString()[0] === '-') {
          orderSide = new Bid().toEncodable()
          qtyToExit = mulFractionals(qtyToExit, new Fractional({ m: new anchor.BN(-1), exp: new anchor.BN(0) }))
        }
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
            maxBaseQty: qtyToExit,
            side: orderSide,
            selfTradeBehavior: new DecrementTake().toEncodable(),
            matchLimit: new anchor.BN(10),
            orderType: new Limit().toEncodable(),
            limitPrice: convertToFractional(priceToExit.toString())
          }
        const response = await newOrderIx(newOrderAccounts, newOrderParams, wallet, connection)
      }
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
      const response = traderRiskGroup
        ? await depositFundsIx(depositFundsAccounts, { quantity: amount }, wallet, connection)
        : await initTrgDepositIx(depositFundsAccounts, { quantity: amount }, wallet, connection, newTrg)
      refreshTraderRiskGroup()
      return response
    },
    [traderRiskGroup, marketProductGroup]
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
    },
    [traderRiskGroup, marketProductGroup]
  )

  useEffect(() => {
    if (traderRiskGroup && marketProductGroup) {
      parseTraderInfo()
    }
  }, [traderRiskGroup, marketProductGroup])

  useEffect(() => {
    if (rawData.mpg && rawData.trg) {
      perpsWasm()
    }
  }, [rawData])

  const collateralAvailable: string = useMemo(
    () => (traderRiskGroup && traderRiskGroup.cashBalance ? displayFractional(traderRiskGroup.cashBalance) : '0'),
    [traderRiskGroup]
  )

  return (
    <TraderContext.Provider
      value={{
        traderInfo: {
          traderRiskGroup,
          traderRiskGroupKey: currentTRG,
          collateralAvailable,
          balances: traderBalances,
          averagePosition: averagePosition,
          tradeHistory: traderHistory
        },
        marketProductGroup: marketProductGroup,
        marketProductGroupKey: currentMPG,
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
