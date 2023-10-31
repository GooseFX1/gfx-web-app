/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  INFTCollectionConfig,
  IOpenBidWithinCollection,
  IFixedPriceWithinCollection,
  NFTCollection,
  CollectionOwner,
  NFTFeaturedCollection,
  NFTUpcomingCollection,
  CollectionSort
} from '../types/nft_collections'
import { httpClient } from '../api'
import {
  NFT_API_BASE,
  NFT_API_ENDPOINTS,
  fetchSingleCollectionBySalesType,
  fetchSingleCollectionAction,
  fetchUserNftsFromDb
} from '../api/NFTs'
import { LOADING_ARR } from '../utils'
import { BaseNFT } from '../types/nft_details'
import { useNFTProfile } from './nft_profile'
import { useWallet } from '@solana/wallet-adapter-react'

export const NFTCollectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [singleCollection, setSingleCollection] = useState<NFTCollection>()
  const [availableAttributes, setAvailableAttributes] = useState<any>()
  const [collectionOwners, setCollectionOwners] = useState<CollectionOwner[]>([])
  const [fixedPriceWithinCollection, setFixedPriceWithinCollection] = useState<IFixedPriceWithinCollection>()
  const [openBidWithinCollection, setOpenBidWithinCollection] = useState<IOpenBidWithinCollection>()
  const [allCollections, setAllCollections] = useState<NFTCollection[] | number[]>(LOADING_ARR)
  const [allCollectionLoading, setLoading] = useState<boolean>(false)
  const [detailedCollections, setAllDetailedCollections] = useState<NFTCollection[]>([])
  const [featuredCollections, setFeaturedCollections] = useState<NFTFeaturedCollection[]>([])
  const [upcomingCollections, setUpcomingCollections] = useState<NFTUpcomingCollection[]>([])
  const [nftMenuPopup, setNFTMenuPopup] = useState<boolean>(false)
  const [collectionSort, setCollectionSort] = useState<CollectionSort>('ASC')
  const [myNFTsByCollection, setMyNFTsCollection] = useState<BaseNFT[] | null>(null)
  const { sessionUserParsedAccounts } = useNFTProfile()
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])

  useEffect(() => {
    if (!publicKey) setMyNFTsCollection([])
    if (sessionUserParsedAccounts && sessionUserParsedAccounts.length && singleCollection && publicKey) {
      ;(async () => {
        const mintAddresses: string[] = sessionUserParsedAccounts.map((acc) => acc.mint)
        const myNFTs = await fetchUserNftsFromDb(mintAddresses, singleCollection[0].uuid)
        setMyNFTsCollection(myNFTs.data)
      })()
    }
  }, [sessionUserParsedAccounts, singleCollection, publicKey])

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

  const fetchAllCollectionsByPages = useCallback(
    async (offset: number, limit: number, filterColumn?: string, sortPref?: string) => {
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
    },
    []
  )

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
      setAvailableAttributes(undefined)
      const res = await fetchSingleCollectionAction(NFT_API_ENDPOINTS.SINGLE_COLLECTION, paramValue)
      const collectionData = await res.data
      if (collectionData.collection === null) return null
      setSingleCollection(collectionData)

      const attributeMap = collectionData[0]?.attributes_filters_enabled
        ? collectionData[0]?.available_attributes?.reduce((map, attribute) => {
            const traitType = attribute.attribute.trait_type
            const traitValue = attribute.attribute.value
            const count = attribute?.listed_count ?? attribute?.count
            const totalCount = attribute?.count
            const isAnnotation = attribute.is_annotation
            if (map[traitType]) {
              map[traitType].push({
                traitValue: traitValue,
                count: count,
                isAnnotation,
                trait: traitType,
                totalCount: totalCount
              })
            } else {
              map[traitType] = [
                { traitValue: traitValue, count: count, isAnnotation, trait: traitType, totalCount: totalCount }
              ]
            }
            return map
          }, {})
        : null

      setAvailableAttributes(attributeMap)
      // const fpData = await fetchFixedPriceWithinCollection(collectionData.collection[0].uuid)
      // setFixedPriceWithinCollection(fpData)
      // const obData = await fetchOpenBidsWithinCollection(collectionData.collection[0].uuid)
      // setOpenBidWithinCollection(obData)
      // const ownersData = await fetchCollectionOwners(collectionData.collection[0].uuid)
      // setCollectionOwners(ownersData)

      return res
    } catch (err) {
      return { status: 400 }
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
        availableAttributes,
        myNFTsByCollection,
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
        setNFTMenuPopup,
        collectionSort,
        setCollectionSort
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

  return context
}
