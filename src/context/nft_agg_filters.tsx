/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect, SetStateAction } from 'react'
import { ICreatorData } from '../types/nft_launchpad'

interface INFTAggConfig {
  sortingAsc?: boolean
  nftCollections?: any[]
  setSortAsc?: any
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
  saveDataForStep?: (d: any) => void
  creatorData?: ICreatorData
  previousStep?: () => void
  nextStep?: () => void
  submit?: () => Promise<boolean>
}

const NFTAggFiltersContext = createContext<INFTAggConfig>(null)
export const NFTAggFiltersProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [nftCollections, setCollections] = useState<any[]>([])
  // this is for advace filters only
  useEffect(() => {
    const collections = []
    for (let i = 0; i < 45; i++) {
      collections.push({
        key: i,
        name: 'Some random collection',
        nft_url: 'https://ca.slack-edge.com/T021XPFKRQV-U02R0LLQ8KX-1cd23a0ef132-512',
        collectionId: i * 5 + 1000,
        collectionName: 'DeGods',
        nftPrice: i * 5,
        currency: 'SOL'
      })
    }
    setCollections(collections)
  }, [])

  return (
    <NFTAggFiltersContext.Provider
      value={{
        nftCollections: nftCollections
      }}
    >
      {children}
    </NFTAggFiltersContext.Provider>
  )
}

export const useNFTAggregatorFilters = (): NFTAgg => {
  const context = useContext(NFTAggFiltersContext)

  if (!context) {
    throw new Error('Missing NFT Aggregator context')
  }
  const { sortingAsc, setSortAsc, nftCollections } = context
  return { sortingAsc, setSortAsc, nftCollections }
}
