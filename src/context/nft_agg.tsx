/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect, SetStateAction, Dispatch } from 'react'
import { ICreatorData } from '../types/nft_launchpad'

interface INFTAggConfig {
  sortingAsc: boolean
  nftCollections: any[]
  setSortAsc: any
  setSelectedNFT: Dispatch<SetStateAction<any>>
  setBuyNow: Dispatch<SetStateAction<any>>
  setBidNow: Dispatch<SetStateAction<any>>
  selectedNFT: any
  nftInBag: any
  setNftInBag: any
  buyNowClicked: any
  bidNowClicked: any
  currentStep?: number
  previousStep?: () => void
  nextStep?: () => void
  saveDataForStep?: (d: any) => void
  creatorData?: ICreatorData
  submit?: () => Promise<boolean>
}

interface NFTAgg {
  sortingAsc: boolean
  nftCollections: any[]
  setSortAsc: any
  currentStep?: number
  setSelectedNFT: Dispatch<SetStateAction<any>>
  setBuyNow: Dispatch<SetStateAction<any>>
  setBidNow: Dispatch<SetStateAction<any>>
  selectedNFT: any
  buyNowClicked: any
  nftInBag: any
  setNftInBag: any
  bidNowClicked: any
  saveDataForStep?: (d: any) => void
  creatorData?: ICreatorData
  previousStep?: () => void
  nextStep?: () => void
  submit?: () => Promise<boolean>
}

const NFTAggContext = createContext<INFTAggConfig>(null)
export const NFTAggregatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [sortingAsc, setSortAsc] = useState<boolean>(true)
  const [nftCollections, setCollections] = useState<any[]>([])
  const [nftInBag, setNftInBag] = useState<any[]>([])
  const [selectedNFT, setSelectedNFT] = useState<number | undefined>()
  const [buyNowClicked, setBuyNow] = useState<boolean | any>(undefined)
  const [bidNowClicked, setBidNow] = useState<boolean | any>(undefined)

  useEffect(() => {
    const sortedData = [...nftCollections]
    sortedData.sort((a, b) => (sortingAsc ? a.nftPrice - b.nftPrice : b.nftPrice - a.nftPrice))
    sortedData.length && setCollections(sortedData)
  }, [sortingAsc])

  return (
    <NFTAggContext.Provider
      value={{
        sortingAsc: sortingAsc,
        setSortAsc: setSortAsc,
        nftCollections: nftCollections,
        selectedNFT: selectedNFT,
        setSelectedNFT: setSelectedNFT,
        buyNowClicked: buyNowClicked,
        bidNowClicked: bidNowClicked,
        setBidNow: setBidNow,
        setBuyNow: setBuyNow,
        nftInBag: nftInBag,
        setNftInBag: setNftInBag
      }}
    >
      {children}
    </NFTAggContext.Provider>
  )
}

export const useNFTAggregator = (): NFTAgg => {
  const context = useContext(NFTAggContext)

  if (!context) {
    throw new Error('Missing NFT Aggregator context')
  }
  const {
    sortingAsc,
    setSortAsc,
    nftCollections,
    selectedNFT,
    setSelectedNFT,
    buyNowClicked,
    setBuyNow,
    bidNowClicked,
    setBidNow,
    nftInBag,
    setNftInBag
  } = context
  return {
    sortingAsc,
    setSortAsc,
    nftCollections,
    selectedNFT,
    setSelectedNFT,
    buyNowClicked,
    setBidNow,
    bidNowClicked,
    setBuyNow,
    nftInBag,
    setNftInBag
  }
}
