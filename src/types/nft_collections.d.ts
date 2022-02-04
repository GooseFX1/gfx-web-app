import { ISingleNFT } from './nft_details.d'

export enum COLLECTION_TYPES {
  NFT_COLLECTION = 'NFTCollection',
  NFT_FEATURED_COLLECTION = 'NFTFeaturedCollection',
  NFT_UPCOMING_COLLECTION = 'NFTUpcomingCollection'
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
  collection: {
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
  allCollections: Array<NFTCollection>
  featuredCollections: Array<NFTFeaturedCollection>
  upcomingCollections: Array<NFTUpcomingCollection>
  fetchAllCollections: any
  fetchFeaturedCollections: any
  fetchUpcomingCollections: any
  singleCollection: NFTCollection
  fetchSingleCollection: (id: string) => Promise<any>
  fixedPriceWithinCollection: IFixedPriceWithinCollection
  openBidWithinCollection: IOpenBidWithinCollection
}
