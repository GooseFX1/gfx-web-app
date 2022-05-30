import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import { INFTProfile, INFTUserActivity, INFTProfileConfig } from '../types/nft_profile.d'
import apiClient from '../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../api/NFTs'
import { Connection } from '@solana/web3.js'
import { StringPublicKey, getParsedNftAccountsByOwner, ParsedAccount } from '../web3'
import { completeNFTUserProfile } from '../api/NFTs'

export type UserFetchType = 'address' | 'user_id' | 'nickname'

export const unnamedUser = {
  user_id: null,
  pubkey: '',
  nickname: 'Unnamed',
  email: '',
  bio: '',
  twitter_link: '',
  instagram_link: '',
  facebook_link: '',
  youtube_link: '',
  profile_pic_link: '',
  is_verified: false,
  user_likes: []
}

export const NFTProfileProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionUser, setSessionUser] = useState<INFTProfile>()
  const [nonSessionProfile, setNonSessionProfile] = useState<INFTProfile>()
  const [userActivity, setUserActivity] = useState<INFTUserActivity[]>([])
  const [sessionUserParsedAccounts, setParsedAccounts] = useState<ParsedAccount[]>([])
  const [nonSessionUserParsedAccounts, setNonSessionUserParsedAccounts] = useState<ParsedAccount[]>([])

  const fetchSessionUser = useCallback(
    async (type: UserFetchType, parameter: string, connection: Connection): Promise<any> => {
      try {
        const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SESSION_USER}?${type}=${parameter}`)
        if (res.data.length > 0) {
          const user = { ...res.data[0], user_likes: [] }
          const userLikes = await fetchUserLikes(user)
          _setUser({ ...user, user_likes: userLikes }, setSessionUser)
        } else {
          // auto-creates a basic user in db to establish a user id for session user
          try {
            const registerUser = await completeNFTUserProfile(parameter)
            _setUser({ ...registerUser, user_likes: [] }, setSessionUser)
          } catch (error) {
            // TODO: create analytics logging event
            console.error(error)
            _setUser(undefined, setSessionUser)
          }
        }
        // fetches user nfts in wallet and sets them to state
        const parsedAccounts = await getParsedAccounts(parameter as StringPublicKey, connection)
        setParsedAccounts(parsedAccounts)
        return res
      } catch (err) {
        return err
      }
    },
    []
  )

  const getParsedAccounts = useCallback(
    async (publicKey: StringPublicKey, connection: Connection): Promise<ParsedAccount[]> => {
      const start = new Date().getTime()
      try {
        const res = await getParsedNftAccountsByOwner({
          publicAddress: publicKey,
          connection: connection,
          sanitize: true,
          stringifyPubKeys: true,
          sort: false
        })
        const accounts = await res
        const elapsed = new Date().getTime() - start
        console.log(`GET PARSED ACCOUNTS: ${elapsed}ms elapsed`)
        return accounts
      } catch (error) {
        console.log(error)
      }
    },
    []
  )

  const fetchUserActivity = useCallback(async (id: number): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.USER_ACTIVITY}?user_id=${id}`)

      setUserActivity(res.data.slice(res.data.length - 11, res.data.length - 1))
      return res
    } catch (err) {
      return err
    }
  }, [])

  const fetchUserLikes = useCallback(async (user: INFTProfile): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.ALL_USER_LIKES}?user_id=${user.user_id}`)
      if (res.data.length > 0 && Array.isArray(res.data)) {
        return res.data.map((nft) => nft.non_fungible_id)
      } else {
        return []
      }
    } catch (err) {
      console.error(err)
      return []
    }
  }, [])

  const likeDislike = useCallback(async (user_id: number, nft_id: any): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.LIKE}`, {
        nft_id,
        user_id
      })

      setSessionUser((prev) => ({
        ...prev,
        user_likes:
          res.data.action === 'liked'
            ? [...prev.user_likes, res.data.nft_id]
            : prev.user_likes.filter((n) => n !== res.data.nft_id)
      }))
      return res
    } catch (error) {
      console.log(error)
    }
  }, [])

  const fetchNonSessionProfile = useCallback(
    async (type: UserFetchType, parameter: string, connection: Connection): Promise<any> => {
      try {
        const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.NON_SESSION_USER}?${type}=${parameter}`)
        if (res.data.length > 0) {
          const user = { ...res.data[0], user_likes: [] }
          _setUser(user, setNonSessionProfile)
        } else {
          _setUser(undefined, setNonSessionProfile)
        }
        // fetches user nfts in wallet and sets them to state
        const parsedAccounts = await getParsedAccounts(parameter as StringPublicKey, connection)
        setNonSessionUserParsedAccounts(parsedAccounts)
        return res
      } catch (err) {
        return err
      }
    },
    []
  )

  const _setUser = (userObj: any, setter: any) => {
    if (userObj === undefined) {
      setter(unnamedUser)
    } else {
      setter({
        ...userObj,
        user_id: userObj.user_id ? userObj.user_id : null,
        pubkey: userObj.pubkey ? userObj.pubkey : '',
        nickname: userObj.nickname ? userObj.nickname : 'Unnamed',
        email: userObj.email ? userObj.email : '',
        bio: userObj.bio ? userObj.bio : '',
        twitter_link: userObj.twitter_link ? userObj.twitter_link : '',
        instagram_link: userObj.instagram_link ? userObj.instagram_link : '',
        facebook_link: userObj.facebook_link ? userObj.facebook_link : '',
        youtube_link: userObj.youtube_link ? userObj.youtube_link : '',
        profile_pic_link: userObj.profile_pic_link ? userObj.profile_pic_link : '',
        is_verified: false
      })
    }
  }

  return (
    <NFTProfileContext.Provider
      value={{
        sessionUser,
        setSessionUser,
        fetchSessionUser,
        sessionUserParsedAccounts,
        setParsedAccounts,
        userActivity,
        setUserActivity,
        fetchUserActivity,
        likeDislike,
        nonSessionProfile,
        fetchNonSessionProfile,
        nonSessionUserParsedAccounts,
        setNonSessionProfile,
        setNonSessionUserParsedAccounts
      }}
    >
      {children}
    </NFTProfileContext.Provider>
  )
}

const NFTProfileContext = createContext<INFTProfileConfig | null>(null)

export const useNFTProfile = (): INFTProfileConfig => {
  const context = useContext(NFTProfileContext)
  if (!context) {
    throw new Error('Missing NFT collection context')
  }

  return {
    sessionUser: context.sessionUser,
    setSessionUser: context.setSessionUser,
    fetchSessionUser: context.fetchSessionUser,
    sessionUserParsedAccounts: context.sessionUserParsedAccounts,
    setParsedAccounts: context.setParsedAccounts,
    userActivity: context.userActivity,
    setUserActivity: context.setUserActivity,
    fetchUserActivity: context.fetchUserActivity,
    likeDislike: context.likeDislike,
    nonSessionProfile: context.nonSessionProfile,
    fetchNonSessionProfile: context.fetchNonSessionProfile,
    nonSessionUserParsedAccounts: context.nonSessionUserParsedAccounts,
    setNonSessionProfile: context.setNonSessionProfile,
    setNonSessionUserParsedAccounts: context.setNonSessionUserParsedAccounts
  }
}
