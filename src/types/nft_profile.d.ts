import { Dispatch, SetStateAction } from 'react'
import { Connection } from '@solana/web3.js'
import { UserFetchType } from '../context'

export interface INFTProfile {
  user_id: number
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
  user_likes: number[]
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
  fetchSessionUser: (type: UserFetchType, parameter: string | number, connection: Connection) => Promise<any>
  sessionUserParsedAccounts: ParsedAccount[]
  setParsedAccounts: Dispatch<SetStateAction<ParsedAccount[]>>
  userActivity: Array<INFTUserActivity>
  setUserActivity: Dispatch<SetStateAction<INFTUserActivity[]>>
  fetchUserActivity: (id: number) => Promise<any>
  likeDislike: (user_id: number, nft_id: any) => Promise<any>
  nonSessionProfile: INFTProfile
  fetchNonSessionProfile: (type: UserFetchType, parameter: string | number, connection: Connection) => Promise<any>
  nonSessionUserParsedAccounts: ParsedAccount[]
  setNonSessionProfile: Dispatch<SetStateAction<INFTProfile>>
  setNonSessionUserParsedAccounts: Dispatch<SetStateAction<ParsedAccount[]>>
  userCurrency: string
  setUserCurrency: Dispatch<SetStateAction<string>>
}
