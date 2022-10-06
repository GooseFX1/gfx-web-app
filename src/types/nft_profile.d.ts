import { Dispatch, SetStateAction } from 'react'
import { Connection } from '@solana/web3.js'
import { UserFetchType } from '../context'

export interface INFTProfile {
  uuid: string
  user_id: number
  uuid: string
  pubkey: string
  nickname: string
  email: string
  bio: string
  twitter_link: string
  instagram_link: string
  telegram_link: string
  youtube_link: string
  profile_pic_link: string
  is_verified: boolean
  user_likes: string[]
}

export interface INFTUserActivity {
  activity_id: number
  tx_sig: null | string
  kind: 'bid' | 'ask' | 'like' | 'bid_matched'
  authority: string
  clock: string
  user_id: number
  non_fungible_id: number
  non_fungible_uuid: string
}

export interface INFTProfileConfig {
  sessionUser: INFTProfile
  setSessionUser: Dispatch<SetStateAction<INFTProfile>>
  fetchSessionUser: (type: UserFetchType, parameter: string, connection: Connection) => Promise<any>
  sessionUserParsedAccounts: ParsedAccount[]
  setParsedAccounts: Dispatch<SetStateAction<ParsedAccount[]>>
  userActivity: Array<INFTUserActivity>
  setUserActivity: Dispatch<SetStateAction<INFTUserActivity[]>>
  fetchUserActivity: (id: string) => Promise<any>
  likeDislike: (user_id: string, nft_id: string) => Promise<any>
  nonSessionProfile: INFTProfile
  fetchNonSessionProfile: (type: UserFetchType, parameter: string | number, connection: Connection) => Promise<any>
  nonSessionUserParsedAccounts: ParsedAccount[]
  setNonSessionProfile: Dispatch<SetStateAction<INFTProfile>>
  setNonSessionUserParsedAccounts: Dispatch<SetStateAction<ParsedAccount[]>>
  userCurrency: string
  setUserCurrency: Dispatch<SetStateAction<string>>
}
