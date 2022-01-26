import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import {
  INFTCollectionConfig,
  NFTCollection,
  NFTFeaturedCollection,
  NFTUpcomingCollection
} from '../types/nft_collections.d'
import apiClient from '../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../api/NFTs'

export const NFTCollectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [singleCollection, setSingleCollection] = useState<NFTCollection>()
  const [allCollections, setAllCollections] = useState<Array<NFTCollection>>([])
  const [featuredCollections, setFeaturedCollections] = useState<Array<NFTFeaturedCollection>>([])
  const [upcomingCollections, setUpcomingCollections] = useState<Array<NFTUpcomingCollection>>([])

  const fetchAllCollections = useCallback(async (loadingCallback: (isLoading: boolean) => void) => {
    try {
      const res = await apiClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.ALL_COLLECTIONS)
      setAllCollections(res.data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const fetchFeaturedCollections = useCallback(async () => {
    try {
      const res = await apiClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.FEATURED_COLLECTIONS)
      setFeaturedCollections(res.data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const fetchUpcomingCollections = useCallback(async (loadingCallback: (isLoading: boolean) => void) => {
    try {
      const res = await apiClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.UPCOMING_COLLECTIONS)
      setUpcomingCollections(res.data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const fetchSingleCollection = useCallback(async (paramValue: string): Promise<any> => {
    const isName = isNaN(parseInt(paramValue))
    try {
      const res = await apiClient(NFT_API_BASE).get(
        `${NFT_API_ENDPOINTS.SINGLE_COLLECTION}?${isName ? 'collection_name' : 'collection_id'}=${paramValue}`
      )
      const collectionData = await res.data[0]
      setSingleCollection(collectionData)
      return await res
    } catch (err) {
      return err
    }
  }, [])

  return (
    <NFTCollectionContext.Provider
      value={{
        allCollections,
        featuredCollections,
        upcomingCollections,
        fetchAllCollections,
        fetchFeaturedCollections,
        fetchUpcomingCollections,
        singleCollection,
        fetchSingleCollection
      }}
    >
      {children}
    </NFTCollectionContext.Provider>
  )
}

const NFTCollectionContext = createContext<INFTCollectionConfig | null>(null)

export const useNFTCollections = (): INFTCollectionConfig => {
  const context = useContext(NFTCollectionContext)
  if (!context) {
    throw new Error('Missing NFT collection context')
  }

  return {
    allCollections: context.allCollections,
    featuredCollections: context.featuredCollections,
    upcomingCollections: context.upcomingCollections,
    fetchAllCollections: context.fetchAllCollections,
    fetchFeaturedCollections: context.fetchFeaturedCollections,
    fetchUpcomingCollections: context.fetchUpcomingCollections,
    singleCollection: context.singleCollection,
    fetchSingleCollection: context.fetchSingleCollection
  }
}
