import apiClient from '../../api'
import { NFT_API_ENDPOINTS, NFT_API_BASE } from '../NFTs/constants'
import { INFTProfile } from '../../types/nft_profile.d'

export const completeNFTUserProfile = async (address: string): Promise<any> => {
  try {
    const res = await apiClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.SESSION_USER}`, {
      address: address
    })
    const user = await res.data[0]

    const formattedUser = {
      user_id: user.user_id,
      pubkey: user.pubkey,
      nickname: 'Unnamed',
      email: '',
      bio: '',
      twitter_link: '',
      instagram_link: '',
      facebook_link: '',
      youtube_link: '',
      profile_pic_link: user.profile_pic_link,
      is_verified: user.is_verified
    }

    return await formattedUser
  } catch (err) {
    return err
  }
}

export const updateNFTUser = async (updatedUser: INFTProfile): Promise<any> => {
  try {
    const res = await apiClient(NFT_API_BASE).patch(`${NFT_API_ENDPOINTS.SESSION_USER}`, {
      user_id: updatedUser.user_id,
      new_user_data: {
        nickname: updatedUser.nickname,
        email: updatedUser.email,
        bio: updatedUser.bio,
        instagram_link: updatedUser.instagram_link,
        twitter_link: updatedUser.twitter_link,
        youtube_link: updatedUser.youtube_link,
        facebook_link: updatedUser.facebook_link,
        profile_pic_link: updatedUser.profile_pic_link
      }
    })
    return await res
  } catch (err) {
    return err
  }
}

export const fetchSingleCollectionBySalesType = async (endpoint: string, id: string): Promise<any> => {
  try {
    const res = await apiClient(NFT_API_BASE).get(`${endpoint}?collection_id=${id}`)
    return await res
  } catch (err) {
    return err
  }
}

export const fetchSingleNFT = async (address: string): Promise<any> => {
  try {
    const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SINGLE_NFT}?mint_address=${address}`)
    return await res
  } catch (err) {
    return err
  }
}

export const fetchNFTById = async (id: number, connection: any): Promise<any> => {
  try {
    const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SINGLE_NFT}?nft_id=${id}&network=mainnet`)
    return res.data
  } catch (err) {
    return err
  }
}

export const fetchRewardsByAddress = async (address: string): Promise<any> => {
  try {
    const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.REWARDS}?address=${address}&network=mainnet`)
    return await res
  } catch (err) {
    return err
  }
}
