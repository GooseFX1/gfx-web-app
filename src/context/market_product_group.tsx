import { WalletContextState, useWallet } from '@solana/wallet-adapter-react'
import { AccountInfo, PublicKey } from '@solana/web3.js'
import React, { ReactNode, useContext, useEffect, useState, FC, useMemo } from 'react'
import { MPG_ID as MAINNET_MPG_ID, MPs as MAINNET_MPs } from '../pages/TradeV3/perps/perpsConstants'
import { MPG_ID as DEVNET_MPG_ID, MPs as DEVNET_MPs } from '../pages/TradeV3/perps/perpsConstantsDevnet'
import { MarketProductGroup } from '../pages/TradeV3/perps/dexterity/accounts'
import { useConnectionConfig } from './settings'
import { useCrypto } from './crypto'
import { Perp, Product } from 'gfx-perp-sdk'
import useActivityTracker from '@/hooks/useActivityTracker'
import useSolSub, { SubType } from '@/hooks/useSolSub'

const ONE_MINUTE = 1000 * 60
interface IPerpsInfoMpg {
  marketProductGroup: MarketProductGroup
  marketProductGroupKey: PublicKey
  activeProduct: IActiveProduct
  mpgRawData: AccountInfo<Buffer>
  perpInstanceSdk: Perp
  perpProductInstanceSdk: Product
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

const MarketProductGroupContext = React.createContext<IPerpsInfoMpg | null>(null)

export const useMpgConfig = (): IPerpsInfoMpg => {
  const context = useContext(MarketProductGroupContext)

  if (!context) throw new Error('Missing Market Product Group Context')
  return context
}

export const MarketProductGroupProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMPG, setMPG] = useState<PublicKey>(new PublicKey(DEVNET_MPG_ID))
  const [marketProductGroup, setMarketProductGroup] = useState<MarketProductGroup | null>(null)
  const [rawData, setRawData] = useState<AccountInfo<Buffer>>(null)
  const [activeProduct, setActiveProduct] = useState<IActiveProduct>(MAINNET_MPs[0])
  const { isDevnet } = useCrypto()
  const [initTesting, setInitTesting] = useState<boolean>(false)
  const [perpInstanceSdk, setPerpInstanceSdk] = useState<Perp>(null)
  const [perpProductInstanceSdk, setPerpProductInstanceSdk] = useState<Product>(null)

  const wallet: WalletContextState = useWallet()

  const { perpsConnection: mainnetConnection } = useConnectionConfig()
  const MPG_ID = useMemo(() => (isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID), [isDevnet])

  const MPs = useMemo(() => (isDevnet ? DEVNET_MPs : MAINNET_MPs), [isDevnet])

  const { on, off } = useSolSub()
  const connection = useMemo(() => mainnetConnection, [])

  useActivityTracker({
    callbackOff: () => setIsCurrentTabActive(false),
    callbackOn: () => setIsCurrentTabActive(true)
  })
  const [isCurrentTabActive, setIsCurrentTabActive] = useState(true)

  const updateMPGDetails = async (mpgData, mpgRawData) => {
    mpgData ? setMarketProductGroup(mpgData) : setMarketProductGroup(null)
    mpgRawData && setRawData(mpgRawData)
  }

  const parseMPG = async () => {
    //const res = marketProductGroup.marketProducts.array[0].value.outright.cumFundingPerShare
    //const price = onChainPrice
    //if (!price || Number.isNaN(+price) || Number.isNaN(+displayFractional(res))) return null
    //const percent = (+displayFractional(res) / +price) * 100
    //setFundingRate(percent.toFixed(4))
  }

  useEffect(() => {
    ;(async () => {
      if (!currentMPG) return
      const mpgData = await MarketProductGroup.fetch(connection, currentMPG)
      updateMPGDetails(mpgData ? mpgData[0] : null, mpgData ? mpgData[1] : null)
    })()
  }, [currentMPG, connection])

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
  }, [isDevnet])

  useEffect(() => {
    const initSdk = async () => {
      if (!wallet.connected) return
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const perp = new Perp(connection, 'mainnet', wallet)
      await perp.init()
      const product = new Product(perp)
      product.initByIndex(0)
      setPerpInstanceSdk(perp)
      setPerpProductInstanceSdk(product)
    }
    initSdk()
  }, [wallet, connection])

  useEffect(() => {
    if (!currentMPG || !wallet.connected || !isCurrentTabActive) return
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
      setIsCurrentTabActive(false)
      off(id)
    }, 15 * ONE_MINUTE)
    return () => {
      off(id)
      return undefined
    }
  }, [currentMPG, wallet.connected, isCurrentTabActive])

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

  return (
    <MarketProductGroupContext.Provider
      value={{
        marketProductGroup: marketProductGroup,
        marketProductGroupKey: currentMPG,
        activeProduct: activeProduct,
        mpgRawData: rawData,
        perpInstanceSdk: perpInstanceSdk,
        perpProductInstanceSdk: perpProductInstanceSdk
      }}
    >
      {children}
    </MarketProductGroupContext.Provider>
  )
}
