/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect, SetStateAction } from 'react'
import { NFT_COL_FILTER_OPTIONS } from '../api/NFTs'
import { ICreatorData } from '../types/nft_launchpad'

interface INFTAggConfig {
  sortFilter: string
  setSortFilter: any
  sortType: string
  setSortType: any
  pageNumber: number
  setPageNumber: any
}

const NFTAggFiltersContext = createContext<INFTAggConfig>(null)
export const NFTAggFiltersProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [sortFilter, setSortFilter] = useState<string | null>(NFT_COL_FILTER_OPTIONS.COLLECTION_NAME)
  const [sortType, setSortType] = useState<'ASC' | 'DESC' | null>('ASC')
  const [pageNumber, setPageNumber] = useState<number>(0)

  // this is for advace filters only

  return (
    <NFTAggFiltersContext.Provider
      value={{
        sortFilter: sortFilter,
        setSortFilter: setSortFilter,
        sortType: sortType,
        setSortType: setSortType,
        pageNumber: pageNumber,
        setPageNumber: setPageNumber
      }}
    >
      {children}
    </NFTAggFiltersContext.Provider>
  )
}

export const useNFTAggregatorFilters = (): INFTAggConfig => {
  const context = useContext(NFTAggFiltersContext)

  if (!context) {
    throw new Error('Missing NFT Aggregator context')
  }
  const { sortFilter, setSortFilter, sortType, setSortType, pageNumber, setPageNumber } = context
  return { sortFilter, setSortFilter, sortType, setSortType, pageNumber, setPageNumber }
}
