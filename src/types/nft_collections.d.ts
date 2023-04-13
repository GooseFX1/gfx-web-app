import { ISingleNFT, IFixedPriceWithinCollection, IOpenBidWithinCollection } from './nft_details.d'

export enum COLLECTION_TYPES {
  NFT_COLLECTION = 'NFTCollection',
  NFT_FEATURED_COLLECTION = 'NFTFeaturedCollection',
  NFT_UPCOMING_COLLECTION = 'NFTUpcomingCollection'
}

export type NFTCollection = {
  uuid: string
  collection_id: number
  collection_name: string
  collection_address: string
  collection_description: string
  profile_pic_link: string
  banner_link: string | null
  banner_2_link: string | null
  banner_3_link: string | null
  title: string | null
  tagline: string | null
  size: number | null
  category_tags: string | null
  is_verified: boolean
  collection_address_type: string
  gfx_appraisal_supported: boolean
  floor_price: number
  daily_volume: number
  weekly_volume: number
  monthly_volume: number
  yearly_volume: number
  total_volume: number
  marketcap: number | null
  daily_change: number | null
  nfts_count: number
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
  nft_data: BaseNFT[]
  nft_prices: string[]
  total_count: number
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
  allCollections: NFTCollection[] | number[]
  setAllCollections: any
  allCollectionLoading: boolean
  detailedCollections: NFTCollection[]
  collectionOwners: CollectionOwner[]
  fetchAllCollectionsByPages: any
  fetchCollectionOwners: (collectionId: string) => Promise<any>
  featuredCollections: NFTFeaturedCollection[]
  upcomingCollections: NFTUpcomingCollection[]
  fetchAllCollections: any
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
