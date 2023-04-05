/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect, SetStateAction, Dispatch } from 'react'
import { ICreatorData } from '../types/nft_launchpad'

interface INFTAggConfig {
  sortingAsc: boolean
  nftCollections: any[]
  setSortAsc: any
  setBuyNow: Dispatch<SetStateAction<any>>
  setBidNow: Dispatch<SetStateAction<any>>
  nftInBag: any
  setNftInBag: any
  buyNowClicked: any
  bidNowClicked: any
  setCurrency?: any
  currencyView: string
  sellNFTClicked?: any
  setSellNFT?: any
}

const NFTAggContext = createContext<INFTAggConfig>(null)
export const NFTAggregatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [sortingAsc, setSortAsc] = useState<boolean>(true)
  const [nftCollections, setCollections] = useState<any[]>([])
  const [nftInBag, setNftInBag] = useState<any[]>([])
  const [buyNowClicked, setBuyNow] = useState<boolean | any>(undefined)
  const [bidNowClicked, setBidNow] = useState<boolean | any>(undefined)
  const [sellNFTClicked, setSellNFT] = useState<any>(undefined)
  const [currencyView, setCurrencyView] = useState<'SOL' | 'USDC'>('SOL')

  const setCurrency = () => {
    setCurrencyView((prev) => (prev === 'USDC' ? 'SOL' : 'USDC'))
  }

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
        buyNowClicked: buyNowClicked,
        bidNowClicked: bidNowClicked,
        setBidNow: setBidNow,
        setBuyNow: setBuyNow,
        nftInBag: nftInBag,
        setNftInBag: setNftInBag,
        currencyView: currencyView,
        setCurrency: setCurrency,
        sellNFTClicked: sellNFTClicked,
        setSellNFT: setSellNFT
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
    sortingAsc: context.sortingAsc,
    setSortAsc: context.setSortAsc,
    nftCollections: context.nftCollections,
    buyNowClicked: context.buyNowClicked,
    setBidNow: context.setBidNow,
    bidNowClicked: context.bidNowClicked,
    setBuyNow: context.setBuyNow,
    nftInBag: context.nftInBag,
    setNftInBag: context.setNftInBag,
    currencyView: context.currencyView,
    setCurrency: context.setCurrency,
    setSellNFT: context.setSellNFT,
    sellNFTClicked: context.sellNFTClicked
  }
}
