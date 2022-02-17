import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import { INFTProfile, INFTUserActivity, INFTProfileConfig } from '../types/nft_profile.d'
import apiClient from '../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../api/NFTs'
import { Connection } from '@solana/web3.js'
import { StringPublicKey, getParsedNftAccountsByOwner, ParsedAccount } from '../web3'

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
  const [userActivity, setUserActivity] = useState<INFTUserActivity[]>([])
  const [parsedAccounts, setParsedAccounts] = useState<ParsedAccount[]>([])

  const fetchSessionUser = useCallback(
    async (type: UserFetchType, parameter: string | number, connection: Connection): Promise<any> => {
      try {
        const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SESSION_USER}?${type}=${parameter}`)
        if (res.data.length > 0) {
          const tempUser = { ...res.data[0], user_likes: [] }
          const userLikes = await fetchUserLikes(tempUser)
          setSessionUser({ ...tempUser, user_likes: userLikes })
        } else {
          setUnamedUser(type, parameter)
        }
        await getParsedAccounts(parameter as StringPublicKey, connection)
        return res
      } catch (err) {
        return err
      }
    },
    []
  )

  const getParsedAccounts = useCallback(async (publicKey: StringPublicKey, connection: Connection): Promise<any> => {
    try {
      const res = await getParsedNftAccountsByOwner({
        publicAddress: publicKey,
        connection: connection
      })
      const accounts = await res
      setParsedAccounts(accounts)
      return accounts
    } catch (error) {
      console.log(error)
    }
  }, [])

  const fetchUserActivity = useCallback(async (id: number): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.USER_ACTIVITY}?user_id=${id}`)

      setUserActivity(res.data)
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

  const setUnamedUser = (type: UserFetchType, parameter: any) => {
    setSessionUser({
      user_id: type === 'user_id' ? parameter : null,
      pubkey: type === 'address' ? parameter : '',
      nickname: type === 'nickname' ? parameter : 'Unnamed',
      email: '',
      bio: '',
      twitter_link: '',
      instagram_link: '',
      facebook_link: '',
      youtube_link: '',
      profile_pic_link: '',
      is_verified: false,
      user_likes: []
    })
  }

  return (
    <NFTProfileContext.Provider
      value={{
        sessionUser,
        setSessionUser,
        fetchSessionUser,
        parsedAccounts,
        userActivity,
        setUserActivity,
        fetchUserActivity,
        likeDislike
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
    parsedAccounts: context.parsedAccounts,
    userActivity: context.userActivity,
    setUserActivity: context.setUserActivity,
    fetchUserActivity: context.fetchUserActivity,
    likeDislike: context.likeDislike
  }
}
