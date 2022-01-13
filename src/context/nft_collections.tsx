import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import { INFTCollectionConfig } from '../types/nft_collections.d'
import apiClient from '../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../api/NFTs'

export const NFTCollectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [singleCollection, setSingleCollection] = useState<Array<any>>([])
  const [allCollections, setAllCollections] = useState<Array<any>>([])
  const [featuredCollections, setFeaturedCollections] = useState<Array<any>>([])
  const [upcomingCollections, setUpcomingCollections] = useState<Array<any>>([])

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

  const fetchSingleCollection = useCallback(async (id: string) => {
    try {
      const res = await apiClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.SINGLE_COLLECTION, {
        params: {
          collection_id: id
        }
      })
      setSingleCollection(res.data)
    } catch (err) {
      console.error(err)
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

export const useNFTCollection = (): INFTCollectionConfig => {
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
