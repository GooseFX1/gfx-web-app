import { Connection } from '@solana/web3.js'
import { Attribute, Creator } from '../web3'
import { Dispatch, SetStateAction } from 'react'
// import { type } from 'os'

export interface IInfoItemData {
  thumbnail: string
  title: string
}

export interface IDetailTabItemData {
  title?: string
  value?: string
}
export interface ICreator {
  address?: string
  verified?: number
  share?: number
}

export interface IData {
  name?: string
  symbol?: string
  uri?: string
  sellerFeeBasisPoints?: number
  creators?: ICreator[]
}

export interface ITradingHistoryTabItemData {
  id?: string
  price?: number
  event?: string
  from?: string
  to?: string
  date?: string
}

export interface IAttributesTabItemData {
  title?: string
  value?: string
  display_type?: string
  trait_type?: string
}

export interface IRemainingPanelData {
  days: string
  hours: string
  minutes: string
}

export interface IMetadataContext {
  name: string
  symbol: string
  description: string
  image: string | undefined
  animation_url: string | undefined
  attributes: Attribute[] | undefined
  external_url: string
  properties: any
  creators: Creator[] | null
  sellerFeeBasisPoints: number
  draftLoaded: boolean
}

export type IActivityName = 'BUY' | 'BID' | 'LIST' | 'ACCEPT_BID' | 'CANCEL_BID' | 'CANCEL_LIST'

export interface ITypeOfActivity {
  _id?: string
  walletAddress: string
  mintAddress: string
  price: number
  typeOfActivity: IActivityName
  marketPlace: string
  collectionName: string
  signature: string
  collectionUuid?: string
}
export type INFTMetadata = {
  name: string
  symbol: string
  description: string
  seller_fee_basis_points: number
  external_url: string
  image: string
  attributes: IAttributesTabItemData[]
  properties: {
    files: { uri: string; type: string }[]
    category: string
    maxSupply?: number
    creators: Creator[]
  }
  collection?: { name: string; family: string } | { name: string; family: string }[]
  update_authority?: string
}

export interface IOnChainMetadata {
  key?: number
  updateAuthority?: string
  mint?: string
  data?: IData
  primarySaleHappened?: number
  isMutable?: number
  editionNonce?: number
}

export type BaseNFT = {
  uuid: string
  non_fungible_id: number | null
  nft_name: string
  nft_description: string
  mint_address: string
  metadata_url: string
  image_url: string | null
  animation_url: string | null
  collection_id: number | null
  collection_name: string | null
  collection_address: string
  gfx_appraisal_value?: string
  is_verified: boolean
  attributes: IAttributesTabItemData[]
  first_verified_creator_address: string | null
  verified_collection_address: string | null
  is_agg: boolean
  properties: {
    files: { uri: string; type: string }[]
    category: string
    maxSupply?: number
    creators: Creator[]
  }
  creators?: ICreator[]
  seller_fee_basis_points: number | null
  nft_price?: number
}

export type ISingleNFT = BaseNFT & {
  token_account: string | null
  owner: string | null
}

export type IRegisterNFT = {
  nft_name: string
  nft_description: string
  mint_address: string
  metadata_url: string
  image_url: string
  animation_url: string | null
}

export type INFTBid = {
  uuid: string
  bid_id: number
  clock: string
  tx_sig: string
  auction_house_authority?: string
  auction_house_fee_account?: string
  wallet_key: string
  auction_house_key: string
  token_account_key: string
  auction_house_treasury_mint_key: string
  token_account_mint_key: string
  buyer_price: string
  token_size: string
  non_fungible_id: number
  collection_id: number
  user_id: number
  event?: string
}

export type INFTInBag = {
  [mintAddress: string]: INFTAsk &
    ISingleNFT & {
      index?: number
    }
}

export type INFTAsk = {
  ask_id: number
  uuid: string
  clock: string
  tx_sig: string
  wallet_key: string
  auction_house_key: string | null
  token_account_key: string | null
  auction_house_treasury_mint_key: string | null
  token_account_mint_key: string
  buyer_price: string
  token_size: string
  non_fungible_id: number
  collection_id: number
  user_id: string | null
  seller_trade_state: string | null
  auction_house_authority: string | null
  auction_house_fee_account: string | null
  marketplace_name: string | null
}

export interface INFTGeneralData {
  data: ISingleNFT[]
  bids?: INFTBid[]
  asks: INFTAsk[]
  bids_user_placed?: INFTBid[]
  total_likes?: number
}

export type MintItemViewStatus = '' | 'placed' | 'successful' | 'unsuccessful'

export interface INFTDetailsConfig {
  general: ISingleNFT
  setGeneral: Dispatch<SetStateAction<ISingleNFT>>
  fetchGeneral: (id: string, connection: Connection) => Promise<any>
  nftMetadata: INFTMetadata
  setNftMetadata: Dispatch<SetStateAction<INFTMetadata>>
  bids: INFTBid[]
  myBidToNFT?: INFTBid[]
  setMyBidToNFT?: (b: INFTBid[]) => void
  setBids: (b: INFTBid[]) => void
  bidOnSingleNFT: any
  curHighestBid: INFTBid | undefined
  removeBidOnSingleNFT: any
  patchNFTAsk: (ask: INFTAsk) => Promise<any>
  ask: INFTAsk
  setAsk: (a: INFTAsk) => void
  nftMintingData: IMetadataContext | undefined
  setNftMintingData: Dispatch<SetStateAction<IMetadataContext>>
  updateUserInput: (params: any) => Promise<any>
  fetchUserInput: () => Promise<any>
  sellNFT: (params: any) => Promise<any>
  removeNFTListing: (id: string) => Promise<any>
  totalLikes: number
  setTotalLikes: Dispatch<SetStateAction<number>>
  onChainMetadata: IOnChainMetadata
  setOnChainMetadata: Dispatch<SetStateAction<IOnChainMetadata>>
}
