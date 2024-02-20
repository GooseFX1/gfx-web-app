import { WalletContextState, useWallet } from '@solana/wallet-adapter-react'
import { AccountInfo, PublicKey, SystemProgram } from '@solana/web3.js'
import React, {
  Dispatch,
  SetStateAction,
  ReactNode,
  useContext,
  useEffect,
  useState,
  FC,
  useCallback,
  useMemo,
  useRef
} from 'react'
import {
  DEX_ID,
  FEES_ID,
  FEE_OUTPUT_REGISTER as MAINNET_FEE_OUTPUT_REGISTER,
  GET_FUNDING_RATE,
  MPG_ID as MAINNET_MPG_ID,
  MPs as MAINNET_MPs,
  ORDERBOOK_P_ID,
  RISK_ID,
  RISK_MODEL_CONFIG_ACCT as MAINNET_RISK_MODEL_CONFIG_ACCT,
  RISK_OUTPUT_REGISTER as MAINNET_RISK_OUTPUT_REGISTER,
  VAULT_MINT as MAINNET_VAULT_MINT,
  VAULT_SEED
} from '../pages/TradeV3/perps/perpsConstants'
import {
  MPG_ID as DEVNET_MPG_ID,
  FEE_OUTPUT_REGISTER as DEVNET_FEE_OUTPUT_REGISTER,
  RISK_OUTPUT_REGISTER as DEVNET_RISK_OUTPUT_REGISTER,
  RISK_MODEL_CONFIG_ACCT as DEVNET_RISK_MODEL_CONFIG_ACCT,
  VAULT_MINT as DEVNET_VAULT_MINT,
  MPs as DEVNET_MPs
} from '../pages/TradeV3/perps/perpsConstantsDevnet'
import { MarketProductGroup, TraderRiskGroup } from '../pages/TradeV3/perps/dexterity/accounts'
import { Fractional } from '../pages/TradeV3/perps/dexterity/types'
import {
  computeHealth,
  convertToFractional,
  displayFractional,
  getClosePositionPrice,
  getFeeConfigAcct,
  getMarketSigner,
  getPerpsMarketOrderPrice,
  getPythPrice,
  getRiskAndFeeSigner,
  getTraderRiskGroupAccount,
  mulFractionals,
  tradeHistoryInfo
} from '../pages/TradeV3/perps/utils'
import { INewOrderAccounts, IDepositFundsAccounts, ITraderBalances } from '../types/dexterity_instructions'
import { useConnectionConfig } from './settings'
import * as anchor from '@project-serum/anchor'
import { Bid, Ask } from '../pages/TradeV3/perps/dexterity/types/Side'
import { Limit } from '../pages/TradeV3/perps/dexterity/types/OrderType'
import { DecrementTake } from '../pages/TradeV3/perps/dexterity/types/SelfTradeBehavior'
import { findAssociatedTokenAddress } from '../web3'
import {
  cancelOrderIx,
  depositFundsIx,
  initTrgDepositIx,
  newOrderIx,
  newTakeProfitOrderIx,
  withdrawFundsIx
} from '../pages/TradeV3/perps/ixUtils'
import { OrderInput, useOrder, IOrder, OrderSide } from './order'
import { notify, removeFloatingPointError } from '../utils'
import { DEFAULT_ORDER_BOOK, OrderBook } from './orderbook'
import { useCrypto } from './crypto'
import { httpClient } from '../api'
import useSolSub, { SubType } from '../hooks/useSolSub'
const ONE_MINUTE = 1000 * 60
import { Perp, Product, Trader } from 'gfx-perp-sdk'

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
  fundingRate: string
  maxWithdrawable: string
  traderVolume: string
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
  newOrderTakeProfit: (price: string) => Promise<DepositIx | void>
  closePosition: (orderbook: OrderBook, qtyToExit: Fractional) => Promise<DepositIx | void>
  cancelOrder: (orderId: string) => Promise<DepositIx | void>
  depositFunds: (amount: Fractional) => Promise<DepositIx | void>
  withdrawFunds: (amount: Fractional) => Promise<DepositIx | void>
  activeProduct: IActiveProduct
  order: IOrder
  setOrder: Dispatch<SetStateAction<IOrder>>
  setFocused: Dispatch<SetStateAction<OrderInput>>
  loading: boolean
  collateralInfo: ICollateralInfo
  setOrderBook: Dispatch<SetStateAction<OrderBook>>
  portfolioValue: number
  perpInstanceSdk: Perp
  perpProductInstanceSdk: Product
  traderInstanceSdk: Trader
}

export interface IActiveProduct {
  id: string
  orderbook_id: string
  bids: string
  asks: string
  event_queue: string
  tick_size: number
  decimals: number
  pairName: string
}
export interface ITraderHistory {
  price: string
  quantity: string
  side: OrderSide | null
}

const TraderContext = React.createContext<IPerpsInfo | null>(null)

export const useTraderConfig = (): IPerpsInfo => {
  const context = useContext(TraderContext)

  if (!context) throw new Error('Missing Trader Context')
  return context
}

export const TraderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMPG, setMPG] = useState<PublicKey>(new PublicKey(DEVNET_MPG_ID))
  const [currentTRG, setTRG] = useState<PublicKey | null>(null)
  const [traderRiskGroup, setTraderRiskGroup] = useState<TraderRiskGroup | null>(null)
  const [marketProductGroup, setMarketProductGroup] = useState<MarketProductGroup | null>(null)
  const [rawData, setRawData] = useState<{
    mpg: AccountInfo<Buffer>
    trg: AccountInfo<Buffer>
  }>({ mpg: null, trg: null })
  const [marginAvail, setMarginAvail] = useState<string>('0')
  const [pnl, setPnl] = useState<string>('0')
  const [activeProduct, setActiveProduct] = useState<IActiveProduct>(MAINNET_MPs[0])
  const [focused, setFocused] = useState<OrderInput>(undefined)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const [portfolioValue, setPortfolioValue] = useState<number>(0)
  const [fundingRate, setFundingRate] = useState<string>('0')
  const [maxWithdrawable, setMaxWithdrawable] = useState<string>('0')
  const [traderVolume, setTraderVolume] = useState<string>('0')
  const [perpInstanceSdk, setPerpInstanceSdk] = useState<Perp>(null)
  const [perpProductInstanceSdk, setPerpProductInstanceSdk] = useState<Product>(null)
  const [traderInstanceSdk, setTraderInstanceSdk] = useState<Trader>(null)
  const [initTesting, setInitTesting] = useState<boolean>(false)
  const [devnetToggle, setDevnetToggle] = useState<number>(0)

  const { order, setOrder } = useOrder()
  const { isDevnet } = useCrypto()
  const prevCountRef = useRef<boolean>()
  const { on, off } = useSolSub()

  const wallet: WalletContextState = useWallet()

  const { perpsConnection: mainnetConnection } = useConnectionConfig()
  const MPG_ID = useMemo(() => (isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID), [isDevnet])
  const FEE_OUTPUT_REGISTER = useMemo(
    () => (isDevnet ? DEVNET_FEE_OUTPUT_REGISTER : MAINNET_FEE_OUTPUT_REGISTER),
    [isDevnet]
  )
  const RISK_OUTPUT_REGISTER = useMemo(
    () => (isDevnet ? DEVNET_RISK_OUTPUT_REGISTER : MAINNET_RISK_OUTPUT_REGISTER),
    [isDevnet]
  )
  const RISK_MODEL_CONFIG_ACCT = useMemo(
    () => (isDevnet ? DEVNET_RISK_MODEL_CONFIG_ACCT : MAINNET_RISK_MODEL_CONFIG_ACCT),
    [isDevnet]
  )

  const MPs = useMemo(() => (isDevnet ? DEVNET_MPs : MAINNET_MPs), [isDevnet])

  const VAULT_MINT = useMemo(() => (isDevnet ? DEVNET_VAULT_MINT : MAINNET_VAULT_MINT), [isDevnet])
  const connection = useMemo(() => mainnetConnection, [])

  const updateMPGDetails = async (mpgData, mpgRawData) => {
    mpgData ? setMarketProductGroup(mpgData) : setMarketProductGroup(null)
    mpgRawData && setRawData((prevState) => ({ ...prevState, mpg: mpgRawData }))
  }

  const setCollateralPrice = async () => {
    const collateralPrice = await getPythPrice(connection, 'Crypto.USDC/USD')
    setCollateralInfo({
      price: collateralPrice ? collateralPrice.toString() : '1',
      name: 'Crypto.USDC/USD'
    })
  }

  const perpsWasm = useCallback(async () => {
    const wasm = await import('perps-wasm')
    const mpg = rawData.mpg
    const trg = rawData.trg
    if (mpg) {
      //try {
      //  const res = wasm.get_funding_rate(mpg.data, BigInt(0))
      //  setFundingRate(
      //    displayFractional(
      //      new Fractional({
      //        m: new anchor.BN(res.m.toString()),
      //        exp: new anchor.BN(res.exp.toString())
      //      })
      //    )
      //  )
      //} catch (e) {
      //  console.log('error in funding rate: ', e)
      //}
      try {
        const re = wasm.get_on_chain_price(mpg.data, BigInt(0))
        const re2 = new Fractional({ m: new anchor.BN(re.m.toString()), exp: new anchor.BN(re.exp.toString()) })
        //console.log('on chain price is: ', displayFractional(re2))
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
      if (trg) {
        try {
          const maxAmount = wasm.max_withdrawable(mpg.data, trg.data)
          const avail = new Fractional({
            m: new anchor.BN(maxAmount.m.toString()),
            exp: new anchor.BN(Number(maxAmount.exp.toString()) + 5)
          })
          setMaxWithdrawable(displayFractional(avail))
        } catch (e) {
          console.log('Error in calculating max withdrawable amount: ', e)
        }
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
        try {
          const pnl = wasm.unrealised_pnl(mpg.data, trg.data, BigInt(0))
          const pnlFrac = new Fractional({
            m: new anchor.BN(pnl.m.toString()),
            exp: new anchor.BN(Number(pnl.exp.toString()) + 5)
          })
          setPnl(displayFractional(pnlFrac))
        } catch (e) {
          console.log('error in pnl: ', e)
        }
        try {
          const res2 = wasm.get_liquidation_price(mpg.data, trg.data, BigInt(0))
          const liq = new Fractional({
            m: new anchor.BN(res2.m.toString()),
            exp: new anchor.BN(res2.exp.toString())
          })
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
          //  const re = wasm.get_leverage_available(mpg.data, trg.data)
          //  const re2 = new Fractional({ m: new anchor.BN(re.m.toString()), exp: new anchor.BN(re.exp.toString()) })
          //  //setAvailLeverage(displayFractional(re2))
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

        try {
          const re = wasm.get_portfolio_value(mpg.data, trg.data)
          const re2 = new Fractional({
            m: new anchor.BN(re.m.toString()),
            exp: new anchor.BN(Number(re.exp.toString()) + 5)
          })
          const portValue = Number(displayFractional(re2))
          setPortfolioValue(portValue)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }, [rawData.mpg, rawData.trg])

  useEffect(() => {
    const initSdk = async () => {
      if (!wallet.connected) return
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const perp = new Perp(connection, 'devnet', wallet)
      await perp.init()
      const product = new Product(perp)
      product.initByIndex(0)
      setPerpInstanceSdk(perp)
      setPerpProductInstanceSdk(product)
    }
    initSdk()
  }, [wallet, connection])

  useEffect(() => {
    const fetchPerpsInstanceFromSdk = async () => {
      if (wallet.connected && perpInstanceSdk) {
        try {
          const trader = new Trader(perpInstanceSdk)
          await trader.init()
          setTraderInstanceSdk(trader)
        } catch (e) {
          //
        }
      }
    }
    fetchPerpsInstanceFromSdk()
  }, [wallet, connection, perpInstanceSdk])

  useEffect(() => {
    const current = Number(currentLeverage)
    if (Number.isNaN(current)) setAvailLeverage('0')
    return setAvailLeverage((10 - current).toString())
  }, [currentLeverage])

  useEffect(() => {
    setDevnetToggle(devnetToggle + 1)
  }, [isDevnet])

  const parseTraderInfo = async () => {
    const res = computeHealth(traderRiskGroup, marketProductGroup)
    setTraderBalances(res.balancesArray)
    const res2 = tradeHistoryInfo(traderRiskGroup, activeProduct, marketProductGroup)

    if (res2) {
      setAveragePosition(res2.averagePosition)
      setTraderHistory(res2.traderHistory)
    }
    const traderVolume = traderRiskGroup.totalTradedVolume
    setTraderVolume(displayFractional(traderVolume))

    // const liquidationP = getLiquidationPrice(res.traderPortfolioValue)
  }

  const parseMPG = async () => {
    //const res = marketProductGroup.marketProducts.array[0].value.outright.cumFundingPerShare
    //const price = onChainPrice
    //if (!price || Number.isNaN(+price) || Number.isNaN(+displayFractional(res))) return null
    //const percent = (+displayFractional(res) / +price) * 100
    //setFundingRate(percent.toFixed(4))
  }

  const setDefaults = async () => {
    console.log('setting default...')
    setTRG(null)
    setTraderRiskGroup(null)
    setRawData((prevState) => ({
      ...prevState,
      trg: null
    }))
    setMarginAvail('0')
    setPnl('0')
    setTraderBalances([])

    setTraderHistory([])
    setAveragePosition({
      price: '',
      quantity: '',
      side: null
    })
    setLiquidationPrice('0')
    setLeverage('0')
    setAvailLeverage('0')
    setMaxQty('0.1')
    setOnChainPrice('0')
    setOpenInterests('0')
    setAccountHealth('100')
    //setFundingRate('0')
    setMaxWithdrawable('0')
    setTraderVolume('0')
  }

  const updateTRGDetails = (traderRiskGroup, rawData) => {
    setTraderRiskGroup(traderRiskGroup)
    if (traderRiskGroup) {
      setRawData((prevState) => ({ ...prevState, trg: rawData }))
    }
  }

  useEffect(() => {
    perpsWasm()
  }, [rawData.mpg, rawData.trg])

  useEffect(() => {
    ;(async () => {
      if (!currentMPG) return
      const mpgData = await MarketProductGroup.fetch(connection, currentMPG)
      updateMPGDetails(mpgData ? mpgData[0] : null, mpgData ? mpgData[1] : null)
    })()
  }, [currentMPG, connection])

  useEffect(() => {
    if (!currentMPG || !wallet.connected) return
    const id = 'market-product-group'
    on({
      SubType: SubType.AccountChange,
      id,
      callback: async (info) => {
        const trg = await MarketProductGroup.decode(info.data)
        updateMPGDetails(trg, trg ? info : null)
      },
      publicKey: currentMPG
    })
    setTimeout(() => {
      off(id)
    }, 15 * ONE_MINUTE)
    return () => {
      off(id)
      return undefined
    }
  }, [currentMPG, wallet.connected])

  useEffect(() => {
    ;(async () => {
      if (!currentTRG) return
      const trgData = await TraderRiskGroup.fetch(connection, currentTRG)
      updateTRGDetails(trgData ? trgData[0] : null, trgData ? trgData[1] : null)
    })()
  }, [currentTRG])

  useEffect(() => {
    if (!currentTRG || !wallet.connected) return
    const id = 'user-trader-wallet-balance'
    on({
      SubType: SubType.AccountChange,
      id,
      callback: async (info) => {
        const trg = await TraderRiskGroup.decode(info.data)
        updateTRGDetails(trg ?? null, trg ? info : null)
      },
      publicKey: currentTRG
    })
    setTimeout(() => {
      off(id)
    }, 15 * ONE_MINUTE)

    return () => {
      off(id)
      return undefined
    }
  }, [currentTRG, wallet.connected])

  const fetchTrgAcc = async () => {
    const trgAccount = await getTraderRiskGroupAccount(wallet.publicKey, connection, MPG_ID)
    if (trgAccount) {
      setTRG(trgAccount.pubkey)
    }
  }

  useEffect(() => {
    if (prevCountRef.current === undefined) prevCountRef.current = isDevnet
    if (wallet.connected && wallet.publicKey) {
      setDefaults()
      fetchTrgAcc()
    }
  }, [MPG_ID, wallet.connected, wallet.publicKey])

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

  const getFundingRate = async () => {
    const res = await httpClient('api-services').post(`${GET_FUNDING_RATE}`, {
      API_KEY: 'zxMTJr3MHk7GbFUCmcFyFV4WjiDAufDp',
      pairName: 'SOL-PERP'
    })
    setFundingRate(res.data.fundingRate)
  }

  useEffect(() => {
    setMPG(new PublicKey(MPG_ID))
    setActiveProduct(MPs[0])
    setCollateralPrice()
    getFundingRate()
  }, [isDevnet])

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
      side: order.side === 'buy' ? 'buy' : 'sell',
      selfTradeBehavior: new DecrementTake().toEncodable(),
      matchLimit: new anchor.BN(10),
      orderType:
        order.display === 'market'
          ? 'market'
          : order.type === 'limit'
          ? 'limit'
          : order.type === 'ioc'
          ? 'immediateOrCancel'
          : 'postOnly',
      limitPrice: convertToFractional(order.price.toString())
    }
  }

  const getNewTakeProfitOrderParams = (profitPrice: string) => {
    let n = '1'
    for (let i = 0; i < activeProduct.decimals; i++) n = n + '0'
    const decimalAdjustedQty = mulFractionals(
      convertToFractional(order.size.toString()),
      new Fractional({ m: new anchor.BN(n), exp: new anchor.BN(0) })
    )

    return {
      maxBaseQty: decimalAdjustedQty,
      side: order.side !== 'buy' ? new Bid().toEncodable() : new Ask().toEncodable(),
      selfTradeBehavior: new DecrementTake().toEncodable(),
      matchLimit: new anchor.BN(10),
      orderType: new Limit().toEncodable(),
      limitPrice: convertToFractional(profitPrice),
      callbackId: 101
    }
  }

  const newOrder = useCallback(async () => {
    const newOrderParams = getNewOrderParams()
    const response = await newOrderIx(
      newOrderParams,
      wallet,
      connection,
      traderInstanceSdk,
      perpProductInstanceSdk
    )
    return response
  }, [traderRiskGroup, order, marketProductGroup])

  const newOrderTakeProfit = useCallback(
    async (price: string) => {
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
        newOrderParams = getNewOrderParams(),
        takeProfitParams = getNewTakeProfitOrderParams(price)
      const response = await newTakeProfitOrderIx(
        newOrderAccounts,
        newOrderParams,
        takeProfitParams,
        wallet,
        connection
      )
      return response
    },
    [traderRiskGroup, order, marketProductGroup]
  )

  const closePosition = useCallback(
    async (orderbook: OrderBook, qtyToExit: Fractional) => {
      const priceToExit = getClosePositionPrice(displayFractional(qtyToExit), orderbook)
      let qty = mulFractionals(qtyToExit, new Fractional({ m: new anchor.BN('100000'), exp: new anchor.BN(0) }))
      if (qtyToExit && priceToExit) {
        let orderSide: 'sell' | 'buy' = 'sell'
        if (qty.m.toString()[0] === '-') {
          orderSide = 'buy'
          qty = mulFractionals(qty, new Fractional({ m: new anchor.BN(-1), exp: new anchor.BN(0) }))
        }
        const finalQty = displayFractional(qty)
        const qq = convertToFractional(finalQty)
        const newOrderParams = {
          maxBaseQty: qq,
          side: orderSide,
          selfTradeBehavior: new DecrementTake().toEncodable(),
          matchLimit: new anchor.BN(10),
          orderType: 'market',
          limitPrice: convertToFractional(priceToExit.toString())
        }
        const response = await newOrderIx(
          newOrderParams,
          wallet,
          connection,
          traderInstanceSdk,
          perpProductInstanceSdk
        )
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
      const response = await cancelOrderIx(
        { orderId: orderId },
        wallet,
        connection,
        traderInstanceSdk,
        perpProductInstanceSdk
      )
      return response
    },
    [traderRiskGroup, marketProductGroup]
  )

  const depositFunds = useCallback(
    async (amount: Fractional) => {
      // not removed this because we need it for initTrgDepositIx
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
      //  if (traderRiskGroup) {
      //    if (traderRiskGroup.totalDeposited.m.toString()) {
      //      const amt = Number(traderRiskGroup.totalDeposited.m.toString())
      //      if (amt < 0) {
      //        notify({
      //          message: 'Failed to deposit',
      //          description: 'You have already deposited 500$! Cannot deposit more.',
      //          type: 'error'
      //        })
      //        return null
      //      }
      //    }
      //  }
      try {
        const response = traderRiskGroup
          ? await depositFundsIx({ quantity: amount }, wallet, connection, traderInstanceSdk)
          : await initTrgDepositIx(
              depositFundsAccounts,
              { quantity: amount },
              wallet,
              connection,
              perpInstanceSdk,
              newTrg,
              isDevnet
            )
        !traderRiskGroup && fetchTrgAcc()
        return response
      } catch (err) {
        return null
      }
    },
    [traderRiskGroup, marketProductGroup, wallet, traderInstanceSdk]
  )

  const withdrawFunds = useCallback(
    async (amount: Fractional) => {
      const response = await withdrawFundsIx({ quantity: amount }, wallet, connection, traderInstanceSdk)
      return response
    },
    [traderRiskGroup, marketProductGroup, currentTRG, traderInstanceSdk]
  )

  useEffect(() => {
    if (traderRiskGroup && marketProductGroup) {
      parseTraderInfo()
      //testing()
    }
  }, [traderRiskGroup, marketProductGroup])

  useEffect(() => {
    if (marketProductGroup) {
      parseMPG()
    }
  }, [marketProductGroup])

  useEffect(() => {
    if (marketProductGroup && wallet.connected && !initTesting) {
      setInitTesting(true)
      testing()
    }
  }, [marketProductGroup, wallet])

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
          health: accountHealth,
          fundingRate: fundingRate,
          maxWithdrawable: maxWithdrawable,
          traderVolume
        },
        marketProductGroup: marketProductGroup,
        marketProductGroupKey: currentMPG,
        setOrderBook,
        newOrder: newOrder,
        newOrderTakeProfit: newOrderTakeProfit,
        closePosition: closePosition,
        cancelOrder: cancelOrder,
        depositFunds: depositFunds,
        withdrawFunds: withdrawFunds,
        activeProduct: activeProduct,
        order: order,
        setOrder: setOrder,
        setFocused: setFocused,
        loading: loading,
        collateralInfo: collateralInfo,
        portfolioValue,
        perpInstanceSdk: perpInstanceSdk,
        perpProductInstanceSdk: perpProductInstanceSdk,
        traderInstanceSdk: traderInstanceSdk
      }}
    >
      {children}
    </TraderContext.Provider>
  )
}
