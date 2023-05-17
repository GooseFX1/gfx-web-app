/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  FC,
  useEffect,
  SetStateAction,
  Dispatch,
  useCallback
} from 'react'
import { ICreatorData } from '../types/nft_launchpad'

interface INFTAggConfig {
  setBuyNow: Dispatch<SetStateAction<any>>
  setBidNow: Dispatch<SetStateAction<any>>
  setOpenJustModal: Dispatch<SetStateAction<any>>
  openJustModal: boolean
  nftInBag: any
  setNftInBag: any
  buyNowClicked: any
  bidNowClicked: any
  setCurrency?: any
  currencyView: string
  sellNFTClicked?: any
  setSellNFT?: any
  refreshClass?: string
  setRefreshClass?: any
  refreshClicked?: number
  setRefreshClicked?: any
  lastRefreshedClass?: string
  setLastRefreshedClass?: any
  cancelBidClicked?: any
  setCancelBidClicked?: Dispatch<SetStateAction<any>>
}

const NFTAggContext = createContext<INFTAggConfig>(null)
export const NFTAggregatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [nftInBag, setNftInBag] = useState<any[]>([])
  const [buyNowClicked, setBuyNow] = useState<boolean | any>(undefined)
  const [bidNowClicked, setBidNow] = useState<boolean | any>(undefined)
  const [cancelBidClicked, setCancelBidClicked] = useState<boolean | any>(undefined)
  const [sellNFTClicked, setSellNFT] = useState<any>(undefined)
  const [currencyView, setCurrencyView] = useState<'SOL' | 'USDC'>('SOL')
  const [refreshClass, setRefreshClass] = useState<string>('')
  const [refreshClicked, setRefreshClicked] = useState<number>(0)
  const [lastRefreshedClass, setLastRefreshClass] = useState<string>()
  const [openJustModal, setOpenJustModal] = useState<boolean>(false)

  const setCurrency = useCallback(() => {
    setCurrencyView((prev) => (prev === 'USDC' ? 'SOL' : 'USDC'))
  }, [])

  return (
    <NFTAggContext.Provider
      value={{
        buyNowClicked: buyNowClicked,
        bidNowClicked: bidNowClicked,
        setBidNow: setBidNow,
        setBuyNow: setBuyNow,
        nftInBag: nftInBag,
        setNftInBag: setNftInBag,
        currencyView: currencyView,
        setCurrency: setCurrency,
        sellNFTClicked: sellNFTClicked,
        setSellNFT: setSellNFT,
        refreshClass: refreshClass,
        setRefreshClicked: setRefreshClicked,
        refreshClicked: refreshClicked,
        setRefreshClass: setRefreshClass,
        lastRefreshedClass: lastRefreshedClass,
        setLastRefreshedClass: setLastRefreshClass,
        openJustModal: openJustModal,
        setOpenJustModal: setOpenJustModal,
        setCancelBidClicked: setCancelBidClicked,
        cancelBidClicked: cancelBidClicked
      }}
    >
      {children}
    </NFTAggContext.Provider>
  )
}

export const useNFTAggregator = (): INFTAggConfig => {
  const context = useContext(NFTAggContext)

  if (!context) {
    throw new Error('Missing NFT Aggregator context')
  }

  return {
    buyNowClicked: context.buyNowClicked,
    setBidNow: context.setBidNow,
    bidNowClicked: context.bidNowClicked,
    setBuyNow: context.setBuyNow,
    nftInBag: context.nftInBag,
    setNftInBag: context.setNftInBag,
    currencyView: context.currencyView,
    setCurrency: context.setCurrency,
    setSellNFT: context.setSellNFT,
    sellNFTClicked: context.sellNFTClicked,
    refreshClass: context.refreshClass,
    refreshClicked: context.refreshClicked,
    setRefreshClicked: context.setRefreshClicked,
    setRefreshClass: context.setRefreshClass,
    lastRefreshedClass: context.lastRefreshedClass,
    setLastRefreshedClass: context.setLastRefreshedClass,
    openJustModal: context.openJustModal,
    setOpenJustModal: context.setOpenJustModal,
    setCancelBidClicked: context.setCancelBidClicked,
    cancelBidClicked: context.cancelBidClicked
  }
}
