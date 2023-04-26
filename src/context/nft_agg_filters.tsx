/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, ReactNode, useContext, useState, FC, useEffect, SetStateAction, Dispatch } from 'react'
import { NFT_COL_FILTER_OPTIONS, NFT_PROFILE_OPTIONS } from '../api/NFTs'

interface INFTAggConfig {
  sortFilter: string
  setSortFilter: any
  sortType: string
  setSortType: any
  pageNumber: number
  setPageNumber: any
  timelineDisplay: string
  setTimelineDisplay: any
  searchInsideCollection?: string | undefined
  setSearchInsideCollection?: Dispatch<SetStateAction<string | undefined>>
  searchInsideProfile?: string | undefined
  setSearchInsideProfile?: Dispatch<SetStateAction<string | undefined>>
  profileNFTOptions?: string
  setProfileNFTOptions?: Dispatch<SetStateAction<string>>
}

const NFTAggFiltersContext = createContext<INFTAggConfig>(null)
export const NFTAggFiltersProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [sortFilter, setSortFilter] = useState<string | null>(NFT_COL_FILTER_OPTIONS.DAILY_VOLUME)
  const [sortType, setSortType] = useState<'ASC' | 'DESC' | null>('DESC')
  const [profileNFTOptions, setProfileNFTOptions] = useState<string>(NFT_PROFILE_OPTIONS.ALL)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [timelineDisplay, setTimelineDisplay] = useState('24h')
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
  const {
    sortFilter,
    setSortFilter,
    sortType,
    setSortType,
    pageNumber,
    setPageNumber,
    timelineDisplay,
    setTimelineDisplay,
    searchInsideCollection,
    setSearchInsideCollection,
    searchInsideProfile,
    setSearchInsideProfile,
    profileNFTOptions,
    setProfileNFTOptions
  } = context
  return {
    sortFilter,
    setSortFilter,
    sortType,
    setSortType,
    pageNumber,
    setPageNumber,
    timelineDisplay,
    setTimelineDisplay,
    searchInsideCollection,
    setSearchInsideCollection,
    searchInsideProfile,
    setSearchInsideProfile,
    profileNFTOptions,
    setProfileNFTOptions
  }
}
