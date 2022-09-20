import { ISingleNFT, IFixedPriceWithinCollection, IOpenBidWithinCollection } from './nft_details.d'

export enum COLLECTION_TYPES {
  NFT_COLLECTION = 'NFTCollection',
  NFT_FEATURED_COLLECTION = 'NFTFeaturedCollection',
  NFT_UPCOMING_COLLECTION = 'NFTUpcomingCollection'
}

export type NFTBaseCollection = {
  uuid: string
  collection_id: number
  collection_name: string
  collection_description: string
  profile_pic_link: string
  banner_link: string | null
  banner_2_link: string | null
  banner_3_link: string | null
  title: string
  tagline: string
  size: number
  category_tags: string
  is_verified: boolean
}

export type NFTCollection = {
  collection_id: number
  collection_floor: null | number
  collection_vol: {
    daily: number
    monthly: number
    weekly: number
    yearly: number
  }
  collection: NFTBaseCollection
}

export type CollectionOwner = {
  uuid: string
  id: number
  clock: string
  pubkey: string
  user_id: number
  non_fungible_id: number
  collection_id: number
  profile_pic_link: string
  nickname: string
}

export interface IFixedPriceWithinCollection {
  collection_floor: null | number
  collection_id: number
  nft_data: any[]
  nft_prices: any[]
}

export interface IOpenBidWithinCollection {
  collection_floor: null
  collection_id: number
  open_bid: ISingleNFT[]
}

export type NFTFeaturedCollection = {
  collection_id: number
  featured_collection_name: string
  featured_collection_banner_url: string
  featured_collection_description: string
}

export type NFTUpcomingCollection = {
  upcoming_id: number | null
  upcoming_collection_droptime: string
  upcoming_collection_name: string
  upcoming_collection_banner_url: string
  upcoming_collection_description: string
}

export interface INFTCollectionConfig {
  allCollections: NFTBaseCollection[]
  detailedCollections: NFTCollection[]
  collectionOwners: CollectionOwner[]
  fetchCollectionOwners: (collectionId: string) => Promise<any>
  featuredCollections: NFTFeaturedCollection[]
  upcomingCollections: NFTUpcomingCollection[]
  fetchAllCollections: any
  fetchAllCollectionDetails: (collections: NFTBaseCollection[]) => Promise<void>
  fetchFeaturedCollections: any
  fetchUpcomingCollections: any
  singleCollection: NFTCollection
  setSingleCollection: Dispatch<SetStateAction<NFTCollection>>
  setCollectionOwners: Dispatch<SetStateAction<CollectionOwner>>
  setFixedPriceWithinCollection: Dispatch<SetStateAction<IFixedPriceWithinCollection>>
  setOpenBidWithinCollection: Dispatch<SetStateAction<IOpenBidWithinCollection>>
  fetchSingleCollection: (id: string) => Promise<any>
  fixedPriceWithinCollection: IFixedPriceWithinCollection
  openBidWithinCollection: IOpenBidWithinCollection
  setNFTMenuPopup: Dispatch<SetStateAction<boolean>>
  nftMenuPopup: boolean
}
