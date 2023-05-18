import { httpClient } from '../../api'
import { NFT_API_ENDPOINTS, NFT_API_BASE } from './constants'
import { INFTProfile } from '../../types/nft_profile.d'
import { IRegisterNFT } from '../../types/nft_details.d'
import { validateUUID } from '../../utils'

export const completeNFTUserProfile = async (address: string): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.SESSION_USER}`, {
      address: address
    })
    const user = await res.data[0]

    const formattedUser = {
      uuid: user.uuid,
      user_id: user.user_id,
      pubkey: user.pubkey,
      nickname: 'Unnamed',
      email: '',
      bio: '',
      twitter_link: '',
      instagram_link: '',
      telegram_link: '',
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
    const res = await httpClient(NFT_API_BASE).patch(`${NFT_API_ENDPOINTS.SESSION_USER}`, {
      user_id: updatedUser.uuid,
      new_user_data: {
        nickname: updatedUser.nickname,
        bio: updatedUser.bio,
        instagram_link: updatedUser.instagram_link,
        twitter_link: updatedUser.twitter_link,
        youtube_link: updatedUser.youtube_link,
        telegram_link: updatedUser.telegram_link,
        profile_pic_link: updatedUser.profile_pic_link,
        website_link: updatedUser.website_link,
        discord_profile: updatedUser.discord_profile
      }
    })
    return await res
  } catch (err) {
    return err
  }
}

export const fetchSingleCollectionAction = async (endpoint: string, paramValue: string): Promise<any> => {
  const isUUID: boolean = validateUUID(paramValue)

  try {
    const res = await httpClient(NFT_API_BASE).get(
      `${endpoint}?${isUUID ? `collection_id=${paramValue}` : `collection_name=${encodeURIComponent(paramValue)}`}`
    )
    return await res
  } catch (err) {
    return err
  }
}

export const fetchSingleCollectionBySalesType = async (endpoint: string, paramValue: string): Promise<any> => {
  const isUUID: boolean = validateUUID(paramValue)

  try {
    const res = await httpClient(NFT_API_BASE).get(
      `${endpoint}?${isUUID ? `collection_id=${paramValue}` : `collection_name=${encodeURIComponent(paramValue)}`}`
    )
    return await res
  } catch (err) {
    return err
  }
}

export const fetchOpenBidByPages = async (paramValue: string, offset: number, limit: number): Promise<any> => {
  const isUUID: boolean = validateUUID(paramValue)

  try {
    const res = await httpClient(NFT_API_BASE).get(
      `${NFT_API_ENDPOINTS.OPEN_BID}?${
        isUUID ? `collection_id=${paramValue}` : `collection_name=${encodeURIComponent(paramValue)}`
      }&offset=${offset}&limit=${limit}`
    )
    return await res
  } catch (err) {
    return err
  }
}

export const fetchFixedPriceByPages = async (
  paramValue: string,
  offset: number,
  limit: number,
  sort: 'ASC' | 'DESC'
): Promise<any> => {
  const isUUID: boolean = validateUUID(paramValue)
  try {
    const res = await httpClient(NFT_API_BASE).get(
      `${NFT_API_ENDPOINTS.FIXED_PRICE}?${
        isUUID ? `collection_id=${paramValue}` : `collection_name=${encodeURIComponent(paramValue)}`
      }&offset=${offset}&limit=${limit}&filter=ListingPrice&sort=${sort}`
    )
    return await res
  } catch (err) {
    return err
  }
}
export const fetchSingleNFT = async (address: string): Promise<any> => {
  if (!address) return
  try {
    const res = await httpClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SINGLE_NFT}?mint_address=${address}`)
    return await res
  } catch (err) {
    return err
  }
}
export const fetchMyNFTByCollection = async (collectionId: string, mintAddresses: string[]): Promise<any> => {
  if (!mintAddresses.length) return
  try {
    const res = await httpClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.NFTS_COLLECTION}`, {
      collection_id: collectionId,
      mint_addresses: mintAddresses
    })
    return await res
  } catch (err) {
    return err
  }
}

export const fetchGlobalSearchNFT = async (collectionName: string): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SEARCH}?collection_name=${collectionName}`)
    return await res.data
  } catch (err) {
    return err
  }
}
export const fetchSearchNFTbyCollection = async (
  collectionId: number,
  nftName: string,
  isListed: boolean = false
): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).get(
      `${NFT_API_ENDPOINTS.SEARCH}?collection_id=${collectionId}&nft_name=${nftName}&is_listing=${isListed}`
    )
    return await res.data
  } catch (err) {
    return err
  }
}
//eslint-disable-next-line
export const fetchNFTById = async (nftUUID: string): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).get(
      `${NFT_API_ENDPOINTS.SINGLE_NFT}?nft_id=${nftUUID}&network=mainnet`
    )
    return res.data
  } catch (err) {
    return err
  }
}

export const fetchRewardsByAddress = async (address: string): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).get(
      `${NFT_API_ENDPOINTS.REWARDS}?address=${address}&network=mainnet`
    )
    return await res
  } catch (err) {
    return err
  }
}

export const registerSingleNFT = async (nft: IRegisterNFT): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.SINGLE_ITEM}`, {
      nft_data: nft
    })
    return res
  } catch (error) {
    return error
  }
}

export const removeNonCollectionListing = async (address: string): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).delete(`${NFT_API_ENDPOINTS.SINGLE_ITEM}`, {
      data: {
        mint_address: address
      }
    })
    return res.data
  } catch (error) {
    return false
  }
}

export const fetchAllSingleNFTs = async (): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.ALL_SINGLE_ITEM}`)
    return res.data.single_items
  } catch (error) {
    return error
  }
}

export const fetchActivityOfAddress = async (address: string, typeOfAddress: string): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.ACTIVITY}?${typeOfAddress}=${address}`)
    return res.data
  } catch (error) {
    return error
  }
}

export type StatsResponse = {
  total_collections: number
  total_marketcap: number
  total_daily_volume: number
}

export const fetchNestAggStats = async (): Promise<StatsResponse> => {
  try {
    const res = await httpClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.STATS}`)
    return res.data
  } catch (error) {
    return error
  }
}
