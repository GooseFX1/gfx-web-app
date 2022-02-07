import { Dispatch, SetStateAction } from 'react'
import { UserFetchType } from '../context'
import { INFTMetadata } from './nft_details.d'

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
