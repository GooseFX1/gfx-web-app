import { createContext, ReactNode, useContext, useState, FC, SetStateAction, Dispatch, useCallback } from 'react'

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
  setSellNFT?: Dispatch<SetStateAction<any>>
  refreshClass?: string
  setRefreshClass?: Dispatch<SetStateAction<string>>
  refreshClicked?: number
  setRefreshClicked?: any
  lastRefreshedClass?: string
  setLastRefreshedClass?: any
  cancelBidClicked?: any
  setCancelBidClicked?: Dispatch<SetStateAction<any>>
  delistNFT?: boolean
  setDelistNFT?: Dispatch<SetStateAction<boolean>>
  showAcceptBid?: boolean
  setShowAcceptBidModal?: Dispatch<SetStateAction<boolean>>
  operatingNFT?: Set<string>
  setOperatingNFT: (value: Set<string> | ((prevSet: Set<string>) => Set<string>)) => void
}

const NFTAggContext = createContext<INFTAggConfig>(null)
export const NFTAggregatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [nftInBag, setNftInBag] = useState<any[]>([])
  const [buyNowClicked, setBuyNow] = useState<boolean | any>(undefined)
  const [bidNowClicked, setBidNow] = useState<boolean | any>(undefined)
  const [delistNFT, setDelistNFT] = useState<boolean>(false)
  const [cancelBidClicked, setCancelBidClicked] = useState<boolean | any>(undefined)
  const [sellNFTClicked, setSellNFT] = useState<any>(undefined)
  const [currencyView, setCurrencyView] = useState<'SOL' | 'USDC'>('SOL')
  const [refreshClass, setRefreshClass] = useState<string>('')
  const [refreshClicked, setRefreshClicked] = useState<number>(0)
  const [lastRefreshedClass, setLastRefreshClass] = useState<string>()
  const [openJustModal, setOpenJustModal] = useState<boolean>(false)
  const [showAcceptBid, setShowAcceptBidModal] = useState<boolean>(false)
  const [operatingNFT, setOperatingNFT] = useState<Set<string>>(new Set())

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
        cancelBidClicked: cancelBidClicked,
        delistNFT: delistNFT,
        setDelistNFT: setDelistNFT,
        showAcceptBid: showAcceptBid,
        setShowAcceptBidModal: setShowAcceptBidModal,
        operatingNFT: operatingNFT,
        setOperatingNFT: setOperatingNFT
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
  const {
    buyNowClicked,
    setBidNow,
    bidNowClicked,
    setBuyNow,
    nftInBag,
    setNftInBag,
    currencyView,
    setCurrency,
    setSellNFT,
    sellNFTClicked,
    refreshClass,
    refreshClicked,
    setRefreshClicked,
    setRefreshClass,
    lastRefreshedClass,
    setLastRefreshedClass,
    openJustModal,
    setOpenJustModal,
    setCancelBidClicked,
    cancelBidClicked,
    delistNFT,
    setDelistNFT,
    showAcceptBid,
    setShowAcceptBidModal,
    operatingNFT,
    setOperatingNFT
  } = useContext(NFTAggContext)

  return {
    buyNowClicked,
    setBidNow,
    bidNowClicked,
    setBuyNow,
    nftInBag,
    setNftInBag,
    currencyView,
    setCurrency,
    setSellNFT,
    sellNFTClicked,
    refreshClass,
    refreshClicked,
    setRefreshClicked,
    setRefreshClass,
    lastRefreshedClass,
    setLastRefreshedClass,
    openJustModal,
    setOpenJustModal,
    setCancelBidClicked,
    cancelBidClicked,
    delistNFT,
    setDelistNFT,
    showAcceptBid,
    setShowAcceptBidModal,
    operatingNFT,
    setOperatingNFT
  }
}
