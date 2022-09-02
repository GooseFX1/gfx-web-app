import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import {
  INFTCollectionConfig,
  IOpenBidWithinCollection,
  IFixedPriceWithinCollection,
  NFTCollection,
  CollectionOwner,
  NFTFeaturedCollection,
  NFTUpcomingCollection,
  NFTBaseCollection
} from '../types/nft_collections.d'
import apiClient from '../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS, fetchSingleCollectionBySalesType } from '../api/NFTs'

export const NFTCollectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [singleCollection, setSingleCollection] = useState<NFTCollection>()
  const [collectionOwners, setCollectionOwners] = useState<Array<CollectionOwner>>([])
  const [fixedPriceWithinCollection, setFixedPriceWithinCollection] = useState<IFixedPriceWithinCollection>()
  const [openBidWithinCollection, setOpenBidWithinCollection] = useState<IOpenBidWithinCollection>()
  const [allCollections, setAllCollections] = useState<Array<NFTBaseCollection>>([])
  const [featuredCollections, setFeaturedCollections] = useState<Array<NFTFeaturedCollection>>([])
  const [upcomingCollections, setUpcomingCollections] = useState<Array<NFTUpcomingCollection>>([])
  const [nftMenuPopup, setNFTMenuPopup] = useState<boolean>(false)

  //eslint-disable-next-line
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

  //eslint-disable-next-line
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
      const collectionData = await res.data
      if (!collectionData.collection_id) {
        return null
      }
      setSingleCollection(collectionData)
      const fpData = await fetchFixedPriceWithinCollection(collectionData.collection_id)
      setFixedPriceWithinCollection(fpData)
      const obData = await fetchOpenBidsWithinCollection(collectionData.collection_id)
      setOpenBidWithinCollection(obData)
      const ownersData = await fetchCollectionOwners(collectionData.collection_id)
      setCollectionOwners(ownersData)
      return res
    } catch (err) {
      return err
    }
  }, [])

  const fetchCollectionOwners = useCallback(async (collectionId: number): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.OWNERS}?collection_id=${collectionId}`)
      const owners = await res.data
      return owners
    } catch (err) {
      return err
    }
  }, [])

  const fetchFixedPriceWithinCollection = useCallback(async (id: number): Promise<any> => {
    try {
      const res = await fetchSingleCollectionBySalesType(NFT_API_ENDPOINTS.FIXED_PRICE, `${id}`)
      const collectionData = await res.data
      return { ...collectionData, nft_data: collectionData.nft_data }
    } catch (err) {
      console.error(err)
      return err
    }
  }, [])

  const fetchOpenBidsWithinCollection = useCallback(async (id: number): Promise<any> => {
    try {
      const res = await fetchSingleCollectionBySalesType(NFT_API_ENDPOINTS.OPEN_BID, `${id}`)
      const collectionData = await res.data
      return { ...collectionData, open_bid: collectionData.open_bid }
    } catch (err) {
      console.error(err)
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
        collectionOwners,
        fetchCollectionOwners,
        setCollectionOwners,
        setSingleCollection,
        setFixedPriceWithinCollection,
        setOpenBidWithinCollection,
        fetchSingleCollection,
        fixedPriceWithinCollection,
        openBidWithinCollection,
        nftMenuPopup,
        setNFTMenuPopup
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
    collectionOwners: context.collectionOwners,
    fetchCollectionOwners: context.fetchAllCollections,
    featuredCollections: context.featuredCollections,
    upcomingCollections: context.upcomingCollections,
    fetchAllCollections: context.fetchAllCollections,
    fetchFeaturedCollections: context.fetchFeaturedCollections,
    fetchUpcomingCollections: context.fetchUpcomingCollections,
    singleCollection: context.singleCollection,
    setSingleCollection: context.setSingleCollection,
    setCollectionOwners: context.setCollectionOwners,
    setFixedPriceWithinCollection: context.setFixedPriceWithinCollection,
    setOpenBidWithinCollection: context.setOpenBidWithinCollection,
    fetchSingleCollection: context.fetchSingleCollection,
    fixedPriceWithinCollection: context.fixedPriceWithinCollection,
    openBidWithinCollection: context.openBidWithinCollection,
    nftMenuPopup: context.nftMenuPopup,
    setNFTMenuPopup: context.setNFTMenuPopup
  }
}
