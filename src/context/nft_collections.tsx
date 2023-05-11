/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import {
  INFTCollectionConfig,
  IOpenBidWithinCollection,
  IFixedPriceWithinCollection,
  NFTCollection,
  CollectionOwner,
  NFTFeaturedCollection,
  NFTUpcomingCollection
} from '../types/nft_collections.d'
import { httpClient } from '../api'
import {
  NFT_API_BASE,
  NFT_API_ENDPOINTS,
  fetchSingleCollectionBySalesType,
  fetchSingleCollectionAction
} from '../api/NFTs'
import { LOADING_ARR } from '../utils'

export const NFTCollectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [singleCollection, setSingleCollection] = useState<NFTCollection>()
  const [collectionOwners, setCollectionOwners] = useState<CollectionOwner[]>([])
  const [fixedPriceWithinCollection, setFixedPriceWithinCollection] = useState<IFixedPriceWithinCollection>()
  const [openBidWithinCollection, setOpenBidWithinCollection] = useState<IOpenBidWithinCollection>()
  const [allCollections, setAllCollections] = useState<NFTCollection[] | number[]>(LOADING_ARR)
  const [allCollectionLoading, setLoading] = useState<boolean>(false)
  const [detailedCollections, setAllDetailedCollections] = useState<NFTCollection[]>([])
  const [featuredCollections, setFeaturedCollections] = useState<NFTFeaturedCollection[]>([])
  const [upcomingCollections, setUpcomingCollections] = useState<NFTUpcomingCollection[]>([])
  const [nftMenuPopup, setNFTMenuPopup] = useState<boolean>(false)

  //eslint-disable-next-line
  const fetchAllCollections = useCallback(async (loadingCallback: (isLoading: boolean) => void) => {
    try {
      const res = await httpClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.ALL_COLLECTIONS)
      setAllCollections(res.data)
      return res.data
    } catch (err) {
      console.error(err)
      return []
    }
  }, [])

  const fetchAllCollectionsByPages = async (
    offset: number,
    limit: number,
    filterColumn?: string,
    sortPref?: string
  ) => {
    try {
      setLoading(true)
      const res = await httpClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.ALL_COLLECTIONS, {
        params: {
          filter: filterColumn ? filterColumn : null,
          sort: sortPref ? sortPref : null,
          offset: offset,
          limit: limit
        }
      })
      if (offset === 0) setAllCollections(res.data)
      else setAllCollections((prev) => [...prev, ...res.data])
      setLoading(false)
      return res.data
    } catch (err) {
      console.error(err)
      return []
    }
  }

  const fetchFeaturedCollections = useCallback(async () => {
    try {
      const res = await httpClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.FEATURED_COLLECTIONS)
      setFeaturedCollections(res.data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  //eslint-disable-next-line
  const fetchUpcomingCollections = useCallback(async (loadingCallback: (isLoading: boolean) => void) => {
    try {
      const res = await httpClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.UPCOMING_COLLECTIONS)
      setUpcomingCollections(res.data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const fetchSingleCollection = useCallback(async (paramValue: string): Promise<any> => {
    try {
      const res = await fetchSingleCollectionAction(NFT_API_ENDPOINTS.SINGLE_COLLECTION, paramValue)
      const collectionData = await res.data
      if (collectionData.collection === null) return null

      setSingleCollection(collectionData)
      // const fpData = await fetchFixedPriceWithinCollection(collectionData.collection[0].uuid)
      // setFixedPriceWithinCollection(fpData)
      // const obData = await fetchOpenBidsWithinCollection(collectionData.collection[0].uuid)
      // setOpenBidWithinCollection(obData)
      const ownersData = await fetchCollectionOwners(collectionData.collection[0].uuid)
      setCollectionOwners(ownersData)

      return res
    } catch (err) {
      return err
    }
  }, [])

  const fetchCollectionOwners = useCallback(async (collectionId: string): Promise<any> => {
    try {
      const res = await httpClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.OWNERS}?collection_id=${collectionId}`)
      const owners = await res.data
      return owners
    } catch (err) {
      return err
    }
  }, [])

  const fetchFixedPriceWithinCollection = useCallback(async (uuid: string): Promise<any> => {
    try {
      const res = await fetchSingleCollectionBySalesType(NFT_API_ENDPOINTS.FIXED_PRICE, uuid)
      const collectionData = await res.data
      return { ...collectionData, nft_data: collectionData.nft_data }
    } catch (err) {
      console.error(err)
      return err
    }
  }, [])

  const fetchOpenBidsWithinCollection = useCallback(async (uuid: string): Promise<any> => {
    try {
      const res = await fetchSingleCollectionBySalesType(NFT_API_ENDPOINTS.OPEN_BID, uuid)
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
        allCollectionLoading,
        allCollections,
        detailedCollections,
        featuredCollections,
        setAllCollections,
        upcomingCollections,
        fetchAllCollections,
        fetchAllCollectionsByPages,
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
    allCollectionLoading: context.allCollectionLoading,
    allCollections: context.allCollections,
    setAllCollections: context.setAllCollections,
    detailedCollections: context.detailedCollections,
    collectionOwners: context.collectionOwners,
    fetchCollectionOwners: context.fetchAllCollections,
    featuredCollections: context.featuredCollections,
    upcomingCollections: context.upcomingCollections,
    fetchAllCollections: context.fetchAllCollections,
    fetchAllCollectionsByPages: context.fetchAllCollectionsByPages,
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
