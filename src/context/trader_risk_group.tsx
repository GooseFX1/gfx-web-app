/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import React, {
  Dispatch,
  SetStateAction,
  ReactNode,
  useContext,
  useEffect,
  useState,
  FC,
  useCallback
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
  reduceFractional
} from '../pages/TradeV3/perps/utils'
import { INewOrderAccounts, IDepositFundsAccounts, IWithdrawFundsAccounts } from '../types/dexterity_instructions'
import { useConnectionConfig } from './settings'
import * as anchor from '@project-serum/anchor'
import { Bid, Ask } from '../pages/TradeV3/perps/dexterity/types/Side'
import { ImmediateOrCancel, Limit, FillOrKill, PostOnly } from '../pages/TradeV3/perps/dexterity/types/OrderType'
import { DecrementTake } from '../pages/TradeV3/perps/dexterity/types/SelfTradeBehavior'
import { findAssociatedTokenAddress } from '../web3'
import {
  depositFundsIx,
  initializeTRG,
  initTrgDepositIx,
  newOrderIx,
  withdrawFundsIx
} from '../pages/TradeV3/perps/ixUtils'
import { OrderDisplayType, OrderType, OrderInput } from './order'
import { removeFloatingPointError } from '../utils'
import { pyth } from '../web3/pyth'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  adminCreateMarket,
  adminInitialiseMPG,
  initializeMarketProductGroup,
  updateFeesIx
} from '../pages/TradeV3/perps/adminUtils'

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
  traderFeeStateAcct: PublicKey
  traderRiskStateAcct: PublicKey
}

interface IOrder {
  side: 'bid' | 'ask'
  display: OrderDisplayType
  price: number
  total: number
  size: number
  type: OrderType
}

interface ICollateralInfo {
  balance: string
  price: string
  name: string
}

interface IPerpsInfo {
  marketProductGroup: MarketProductGroup
  traderInfo: ITraderRiskGroup
  marketProductGroupKey: PublicKey
  newOrder: () => Promise<void>
  depositFunds: (amount: Fractional) => Promise<void>
  withdrawFunds: (amount: Fractional) => Promise<void>
  activeProduct: any
  order: IOrder
  setOrder: Dispatch<SetStateAction<IOrder>>
  setFocused: Dispatch<SetStateAction<OrderInput>>
  loading: boolean
  collateralInfo: ICollateralInfo
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
  const [activeProduct, setActiveProduct] = useState(MPs[0])
  const [traderFeeStateAcct, setTraderFeeStateAcct] = useState<PublicKey>(null)
  const [traderRiskStateAcct, setTraderRiskStateAcct] = useState<PublicKey>(null)
  const [focused, setFocused] = useState<OrderInput>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [collateralInfo, setCollateralInfo] = useState<ICollateralInfo>({
    price: '0',
    name: '',
    balance: '0'
  })

  const [order, setOrder] = useState<IOrder>({
    side: 'bid',
    display: 'limit',
    price: 0,
    total: 0,
    size: 0,
    type: 'limit'
  })
  const [currentSide, setSide] = useState<'bid' | 'ask'>('bid')

  const wallet = useWallet()
  const { connection } = useConnectionConfig()

  const refreshTraderRiskGroup = async () => {
    const traderRiskGroupAccount = await getTraderRiskGroupAccount(wallet, connection)
    if (traderRiskGroupAccount && traderRiskGroupAccount.pubkey) {
      setTRG(traderRiskGroupAccount.pubkey)
      TraderRiskGroup.fetch(connection, traderRiskGroupAccount.pubkey).then((trg) => {
        trg ? setTraderRiskGroup(trg) : setTraderRiskGroup(null)
      })
    }
  }

  const setTraderDetails = async () => {
    MarketProductGroup.fetch(connection, new PublicKey(MPG_ID)).then((mpgRes) => {
      mpgRes ? setMarketProductGroup(mpgRes) : setMarketProductGroup(null)
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

  const setCollateralInfoFn = async () => {
    const collateralPrice = await getPythPrice(connection, 'Crypto.USDC/USD')
    setCollateralInfo({
      balance: traderRiskGroup.cashBalance ? displayFractional(traderRiskGroup.cashBalance) : '',
      price: collateralPrice ? collateralPrice.toString() : '',
      name: 'Crypto.USDC/USD'
    })
  }

  const setAccountHealthFn = async () => {
    const res = computeHealth(traderRiskGroup, marketProductGroup)
    console.log(res)
    const liquidationP = getLiquidationPrice(res.traderPortfolioValue)
  }

  useEffect(() => {
    if (wallet.connected) {
      testing()
      setTraderDetails()
    } else {
      setTraderRiskGroup(null)
      setTraderFeeStateAcct(null)
      setTraderRiskStateAcct(null)
    }
  }, [wallet.connected])

  const testing = async () => {
    //const res = await adminInitialiseMPG(connection, wallet)
    //console.log(res)
    //const res = await adminCreateMarket(connection, wallet)
    //console.log(res)
    //const res = await updateFeesIx(wallet, connection, {
    //  feeModelConfigAcct: marketProductGroup.feeModelConfigurationAcct
    //})
    //console.log(res)
  }
  useEffect(() => {
    setMPG(new PublicKey(MPG_ID))
    setActiveProduct(MPs[0])
  }, [])

  useEffect(() => {
    switch (focused) {
      case 'price':
      case 'size':
        return setOrder((prevState) => ({
          ...prevState,
          total: removeFloatingPointError((order.price || 1) * order.size)
        }))
      case 'total':
        return setOrder((prevState) => ({
          ...prevState,
          size: removeFloatingPointError(order.total / (order.price || 1))
        }))
    }
  }, [focused, order.price, order.size, order.total, activeProduct])

  const getNewOrderParams = () => ({
    maxBaseQty: convertToFractional(order.size.toString()),
    side: order.side === 'bid' ? new Bid().toEncodable() : new Ask().toEncodable(),
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
      setCollateralInfoFn()
      setAccountHealthFn()
    }
  }, [traderRiskGroup, marketProductGroup])

  return (
    <TraderContext.Provider
      value={{
        traderInfo: { traderRiskGroup, traderFeeStateAcct, traderRiskStateAcct, traderRiskGroupKey: currentTRG },
        marketProductGroup: marketProductGroup,
        marketProductGroupKey: currentMPG,
        newOrder: newOrder,
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
