import { INFTAsk } from './nft_details.d'
export interface IInfoItemData {
  thumbnail: string
  title: string
}

export interface IDetailTabItemData {
  title?: string
  value?: string
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

export type NFTCreator = { address: string; share: number; verified?: boolean }

export type NFTTopLevelNFTData = {
  data: {
    creators: Array<NFTCreator>
    name: string
    sellerFeeBasisPoints: number
    symbol: string
    uri: string
  }
  edition: any
  editionNonce: null | any
  isMutable: number
  key: number
  masterEdition: any
  mint: string
  primarySaleHappened: number
  updateAuthority: string
}

export type ISingleNFT = {
  non_fungible_id: number
  nft_name: string
  nft_description: string
  mint_address: string
  metadata_url: string
  image_url: string | null
  animation_url: string | null
  collection_id: number
}

export type INFTMetadata = {
  name: string
  symbol: string
  description: string
  seller_fee_basis_points: number
  external_url: string
  image: string
  attributes: Array<IAttributesTabItemData>
  properties: {
    files: Array<{ uri: string; type: string }>
    category: string
    maxSupply?: number
    creators: Array<NFTCreator>
  }
  collection?: { name: string; family: string }
  update_authority?: string
}

export type INFTBid = {
  bid_id: number
  clock: string
  tx_sig: string
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
}

export type INFTAsk = {
  ask_id: number
  clock: string
  tx_sig: string
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
}

export interface INFTDetailsGeneralData {
  data: Array<ISingleNFT>
  bids: Array<INFTBid>
  asks: Array<INFTAsk>
}

export type NFTDetailsProviderMode =
  | 'live-auction-NFT'
  | 'my-created-NFT'
  | 'fixed-price-NFT'
  | 'open-bid-NFT'
  | 'mint-item-view'

export type MintItemViewStatus = '' | 'placed' | 'successful' | 'unsuccessful'

export interface INFTDetailsConfig {
  general: ISingleNFT
  nftMetadata: INFTMetadata
  bids: Array<INFTBid>
  asks: Array<INFTAsk>
  fetchGeneral: (id: string) => Promise<any>
  uploadNFTData: any
  setUploadNFTData: any
}
