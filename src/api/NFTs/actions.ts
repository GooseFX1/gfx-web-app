import apiClient from '../../api'
import { NFT_API_ENDPOINTS, NFT_API_BASE } from '../NFTs/constants'
import { INFTProfile } from '../../types/nft_profile.d'
import { StringPublicKey, getParsedAccountByMint } from '../../web3'

export const completeNFTUserProfile = async (address: string): Promise<any> => {
  try {
    const res = await apiClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.SESSION_USER}`, {
      address: address
    })
    return await res
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

export const fetchSingleNFT = async (id: number): Promise<any> => {
  try {
    const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SINGLE_NFT}?nft_id=${id}`)
    return await res
  } catch (err) {
    return err
  }
}

export const fetchNFTById = async (id: number, connection: any): Promise<any> => {
  try {
    const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SINGLE_NFT}?nft_id=${id}`)
    const nft = await res.data

    const parsedAccounts = await getParsedAccountByMint({
      mintAddress: nft.data[0].mint_address as StringPublicKey,
      connection: connection
    })

    const accountInfo =
      parsedAccounts !== undefined
        ? { token_account: parsedAccounts.pubkey, owner: parsedAccounts.account?.data?.parsed?.info.owner }
        : { token_account: null, owner: null }

    return { ...nft.data[0], ...accountInfo }
  } catch (err) {
    return err
  }
}
