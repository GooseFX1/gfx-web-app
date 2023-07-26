/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, ReactNode, useContext, useState, FC, useEffect, SetStateAction, Dispatch } from 'react'
import { NFT_COL_FILTER_OPTIONS, NFT_PROFILE_OPTIONS, TIMELINE } from '../api/NFTs'

interface INFTAggConfig {
  sortFilter: NFT_COL_FILTER_OPTIONS
  setSortFilter: Dispatch<SetStateAction<NFT_COL_FILTER_OPTIONS>>
  sortType: 'ASC' | 'DESC' | null
  setSortType: Dispatch<SetStateAction<'ASC' | 'DESC'>>
  pageNumber: number
  setPageNumber: Dispatch<SetStateAction<number>>
  timelineDisplay: TIMELINE
  setTimelineDisplay: Dispatch<SetStateAction<TIMELINE>>
  searchInsideCollection?: string | undefined
  setSearchInsideCollection?: Dispatch<SetStateAction<string | undefined>>
  searchInsideProfile?: string | undefined
  setSearchInsideProfile?: Dispatch<SetStateAction<string | undefined>>
  profileNFTOptions?: NFT_PROFILE_OPTIONS
  setProfileNFTOptions?: Dispatch<SetStateAction<NFT_PROFILE_OPTIONS>>
}

const NFTAggFiltersContext = createContext<INFTAggConfig>(null)
export const NFTAggFiltersProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [sortFilter, setSortFilter] = useState<NFT_COL_FILTER_OPTIONS | null>(NFT_COL_FILTER_OPTIONS.DAILY_VOLUME)
  const [sortType, setSortType] = useState<'ASC' | 'DESC' | null>('DESC')
  const [profileNFTOptions, setProfileNFTOptions] = useState<NFT_PROFILE_OPTIONS>(NFT_PROFILE_OPTIONS.ALL)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [timelineDisplay, setTimelineDisplay] = useState<TIMELINE>(TIMELINE.TWENTY_FOUR_H)
  const [searchInsideCollection, setSearchInsideCollection] = useState<string | undefined>(undefined)
  const [searchInsideProfile, setSearchInsideProfile] = useState<string | undefined>(undefined)

  // this is for advace filters only

  return (
    <NFTAggFiltersContext.Provider
      value={{
        sortFilter: sortFilter,
        setSortFilter: setSortFilter,
        sortType: sortType,
        setSortType: setSortType,
        pageNumber: pageNumber,
        setPageNumber: setPageNumber,
        timelineDisplay: timelineDisplay,
        setTimelineDisplay: setTimelineDisplay,
        searchInsideCollection: searchInsideCollection,
        setSearchInsideCollection: setSearchInsideCollection,
        searchInsideProfile: searchInsideProfile,
        setSearchInsideProfile: setSearchInsideProfile,
        profileNFTOptions: profileNFTOptions,
        setProfileNFTOptions: setProfileNFTOptions
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

  return context
}
