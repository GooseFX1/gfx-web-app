import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  FC,
  SetStateAction,
  Dispatch,
  useCallback
} from 'react'
import { INFTInBag } from '../types/nft_details'
import { GFX_APPRAISAL_ENABLED } from '../constants'

interface INFTAggConfig {
  appraisalIsEnabled: boolean
  setBuyNow: Dispatch<SetStateAction<any>>
  setBidNow: Dispatch<SetStateAction<any>>
  setOpenJustModal: Dispatch<SetStateAction<any>>
  openJustModal: boolean
  nftInBag: INFTInBag
  nftInSweeper: INFTInBag
  setNftInBag: Dispatch<SetStateAction<INFTInBag>>
  setNftInSweeper: Dispatch<SetStateAction<INFTInBag>>
  buyNowClicked: boolean
  bidNowClicked: boolean
  setCurrency?: () => void
  currencyView: string
  sellNFTClicked?: any
  setSellNFT?: Dispatch<SetStateAction<any>>
  cancelBidClicked?: boolean
  setCancelBidClicked?: Dispatch<SetStateAction<boolean>>
  delistNFT?: boolean
  setDelistNFT?: Dispatch<SetStateAction<boolean>>
  showAcceptBid?: boolean
  setShowAcceptBidModal?: Dispatch<SetStateAction<boolean>>
  operatingNFT?: Set<string>
  setOperatingNFT: (value: Set<string> | ((prevSet: Set<string>) => Set<string>)) => void
  sweeperCount: number
  setSweeperCount: Dispatch<SetStateAction<number>>
  showSweeperModal: boolean
  setShowSweeperModal: Dispatch<SetStateAction<boolean>>
}

const NFTAggContext = createContext<INFTAggConfig>(null)
export const NFTAggregatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [nftInBag, setNftInBag] = useState<any>({})
  const [nftInSweeper, setNftInSweeper] = useState<any>({})
  const [sweeperCount, setSweeperCount] = useState<number>(0)
  const [showSweeperModal, setShowSweeperModal] = useState<boolean>(false)
  const [buyNowClicked, setBuyNow] = useState<boolean>(false)
  const [bidNowClicked, setBidNow] = useState<boolean>(false)
  const [delistNFT, setDelistNFT] = useState<boolean>(false)
  const [cancelBidClicked, setCancelBidClicked] = useState<boolean>(false)
  const [sellNFTClicked, setSellNFT] = useState<any>(undefined)
  const [currencyView, setCurrencyView] = useState<'SOL' | 'USDC'>('SOL')
  const [openJustModal, setOpenJustModal] = useState<boolean>(false)
  const [showAcceptBid, setShowAcceptBidModal] = useState<boolean>(false)
  const [operatingNFT, setOperatingNFT] = useState<Set<string>>(new Set())

  const setCurrency = useCallback(() => {
    setCurrencyView((prev) => (prev === 'USDC' ? 'SOL' : 'USDC'))
  }, [])

  return (
    <NFTAggContext.Provider
      value={{
        appraisalIsEnabled: GFX_APPRAISAL_ENABLED,
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
        openJustModal: openJustModal,
        setOpenJustModal: setOpenJustModal,
        setCancelBidClicked: setCancelBidClicked,
        cancelBidClicked: cancelBidClicked,
        delistNFT: delistNFT,
        setDelistNFT: setDelistNFT,
        showAcceptBid: showAcceptBid,
        setShowAcceptBidModal: setShowAcceptBidModal,
        operatingNFT: operatingNFT,
        setOperatingNFT: setOperatingNFT,
        nftInSweeper: nftInSweeper,
        setNftInSweeper: setNftInSweeper,
        sweeperCount: sweeperCount,
        setSweeperCount: setSweeperCount,
        showSweeperModal: showSweeperModal,
        setShowSweeperModal: setShowSweeperModal
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

  return context
}
