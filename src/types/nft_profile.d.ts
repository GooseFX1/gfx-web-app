import { Dispatch, SetStateAction } from 'react'
import { UserFetchType } from '../context'

export interface INFTProfile {
  user_id: number
  pubkey: string
  nickname: string
  email: null | string
  bio: null | string
  twitter_link: null | string
  instagram_link: null | string
  facebook_link: null | string
  youtube_link: null | string
  profile_pic_link: string
  is_verified: boolean
}

export interface INFTUserActivity {
  activity_id: number
  tx_sig: null | string
  kind: string
  authority: string
  clock: string
  user_id: number
  non_fungible_id: number
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

export interface INFTProfileConfig {
  sessionUser: INFTProfile
  setSessionUser: Dispatch<SetStateAction<INFTProfile>>
  fetchSessionUser: (type: UserFetchType, parameter: string | number) => Promise<any>
  userActivity: Array<INFTUserActivity>
  setUserActivity: Dispatch<SetStateAction<INFTUserActivity[]>>
  fetchUserActivity: (id: number) => Promise<any>
  nftMetadata: Array<INFTMetadata>
  fetchExternalNFTs: (address: string) => Promise<any>
}
