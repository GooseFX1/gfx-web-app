import { GFX_NEST_BASE_URL, httpClient } from '../../api'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NFT_API_ENDPOINTS, NFT_API_BASE } from './constants'
import { INFTProfile } from '../../types/nft_profile'
import { IActivityName, IRegisterNFT, ITypeOfActivity } from '../../types/nft_details'
import { validateUUID } from '../../utils'
import jwt from 'jsonwebtoken'
import { ANALYTICS_SUBDOMAIN, localhost } from '../analytics'
import { AH_PROGRAM_IDS, MAGIC_EDEN_AUCTION_HOUSE } from '../../web3'
import { IAdditionalFilters } from '../../context'
import axios from 'axios'
import { LAMPORTS_PER_SOL_NUMBER } from '../../constants'
import { USER_CONFIG_CACHE } from '../../types/app_params'

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

export const updateNFTUser = async (updatedUser: INFTProfile, token: string): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).patch(
      `${NFT_API_ENDPOINTS.SESSION_USER}`,
      {
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
      },

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
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

const handleAdditionalFilters = (receivedUrl: string, additionalFilters: IAdditionalFilters): string => {
  let url = receivedUrl
  if (additionalFilters.attributes && additionalFilters.attributes.length) {
    const attributeCount = []
    const attributes = additionalFilters.attributes.reduce((acc, attr) => {
      if (!attr.isAnnotation) {
        acc.push(`{"trait_type" :"${attr.trait_type}", "value": "${attr.value}"}`)
      } else {
        attributeCount.push(attr.value)
      }
      return acc
    }, [])

    url += attributes.length ? `&attributes=[${attributes.join(',')}]` : ''
    url += attributeCount.length ? `&attributes_count=[${attributeCount.join(',')}]` : ''
  }
  return url
}

export const fetchOpenBidByPages = async (
  paramValue: string,
  offset: number,
  limit: number,
  additionalFilters: IAdditionalFilters
): Promise<any> => {
  const isUUID: boolean = validateUUID(paramValue)

  try {
    let url = `${GFX_NEST_BASE_URL}${NFT_API_ENDPOINTS.OPEN_BID}?${
      isUUID ? `collection_id=${paramValue}` : `collection_name=${encodeURIComponent(paramValue)}`
    }&offset=${offset}&limit=${limit}`
    url = handleAdditionalFilters(url, additionalFilters)

    const res = await axios.get(url)
    return await res
  } catch (err) {
    return err
  }
}

export const fetchFixedPriceByPages = async (
  paramValue: string,
  offset: number,
  limit: number,
  sort: 'ASC' | 'DESC',
  additionalFilters?: IAdditionalFilters,
  currencyView?: string,
  solPrice?: number
): Promise<any> => {
  const isUUID: boolean = validateUUID(paramValue)

  let url = `${GFX_NEST_BASE_URL}${NFT_API_ENDPOINTS.FIXED_PRICE}?${
    isUUID ? `collection_id=${paramValue}` : `collection_name=${encodeURIComponent(paramValue)}`
  }&offset=${offset}&limit=${limit}&sort=${sort}`

  if (additionalFilters.minValueFilter) {
    url += `&min_price=${Math.floor(
      (additionalFilters.minValueFilter * LAMPORTS_PER_SOL_NUMBER) / (currencyView === 'SOL' ? 1 : solPrice)
    )}`
  }

  if (additionalFilters.maxValueFilter) {
    url += `&max_price=${Math.floor(
      (additionalFilters.maxValueFilter * LAMPORTS_PER_SOL_NUMBER) / (currencyView === 'SOL' ? 1 : solPrice)
    )}`
  }
  url = handleAdditionalFilters(url, additionalFilters)
  const noOfMarketPlaces = Object.keys(AH_PROGRAM_IDS).length - 1

  if (
    additionalFilters.marketsFilter &&
    additionalFilters.marketsFilter.length > 0 &&
    additionalFilters.marketsFilter.length !== noOfMarketPlaces
  ) {
    const encodedMarketplaces = additionalFilters.marketsFilter.map(
      (market) => `%22${encodeURIComponent(market)}%22`
    )
    const marketplaces = `[${encodedMarketplaces.join(',')}]`
    url += `&marketplaces=${marketplaces}`
  }

  try {
    // change this back to original
    const res = await axios.get(url)
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

export const fetchUserNftsFromDb = async (mintAddresses: string[], collectionId?: string): Promise<any> => {
  if (!mintAddresses.length) return null
  try {
    const res = await httpClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.NFTS_COLLECTION}`, {
      mint_addresses: mintAddresses,
      collection_id: collectionId
    })
    return await res
  } catch (err) {
    return err
  }
}

export const fetchBidsPlacedByUser = async (wallet: string): Promise<any> => {
  if (!wallet?.length) return
  try {
    const res = await httpClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.USER_BIDS}?user_wallet=${wallet}`)
    return res.data
  } catch (err) {
    console.log(err)
    throw err // Throw the error, let the calling function handle it
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
  isListed = false
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

export const getTensorBuyInstruction = async (
  buyerPrice: number,
  buyerKey: string,
  ownerKey: string,
  mintAddress: string
): Promise<any> => {
  try {
    const userCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
    const token = userCache?.jwtToken

    const res = await httpClient(NFT_API_BASE).post(
      `${NFT_API_ENDPOINTS.TENSOR_BUY}`,
      {
        price: buyerPrice,
        buyer: buyerKey,
        owner: ownerKey,
        mint: mintAddress
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return res
  } catch (error) {
    if (error.response) throw new Error(error.response.status)
    throw new Error(error)
  }
}

// add jwt token
export const getMagicEdenBuyInstruction = async (
  buyerPrice: number,
  buyerKey: string,
  ownerKey: string,
  mintAddress: string,
  tokenAta: string,
  sellerExpiry: string
): Promise<any> => {
  try {
    const userCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
    const token = userCache?.jwtToken
    const res = await httpClient(NFT_API_BASE).post(
      `${NFT_API_ENDPOINTS.MAGIC_EDEN_BUY}`,
      {
        buyer: buyerKey,
        auction_house: MAGIC_EDEN_AUCTION_HOUSE,
        token_ata: tokenAta,
        owner: ownerKey,
        mint: mintAddress,
        price: buyerPrice.toString(), // recently changed
        seller_expiry: sellerExpiry
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res
  } catch (error) {
    if (error.response) throw new Error(error.response.status)
    throw new Error(error)
  }
}

export const getSignedTxPNFTGooseFX = async (
  buyerPrice: number,
  buyerPubkey: string,
  sellerPubkey: string,
  mintAddress: string
): Promise<any> => {
  try {
    const userCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
    const token = userCache?.jwtToken
    const res = await httpClient(NFT_API_BASE).post(
      `${NFT_API_ENDPOINTS.SIGNED_PNFT}`,
      {
        buyer_pubkey: buyerPubkey,
        seller_pubkey: sellerPubkey,
        mint_address: mintAddress,
        buyer_price: buyerPrice // recently changed
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res
  } catch (error) {
    if (error.response) throw new Error(error.response.status)
    throw new Error(error)
  }
}

// add jwt token

export const getMagicEdenListing = async (mintAddress: string): Promise<any> => {
  try {
    const userCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
    const token = userCache?.jwtToken

    const res = await httpClient(NFT_API_BASE).post(
      `${NFT_API_ENDPOINTS.MAGIC_EDEN_LISTING}`,
      {
        mint: mintAddress
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res
  } catch (error) {
    if (error.response) throw new Error(error.response.status)
    throw new Error(error)
  }
}

export const createPoolOrder = async (
  initial_price: string, // multiplied by lamports
  slug: string, // slug of the collection, will be there in collection api response
  delta: string, // delta is increase of lamports when there in a sell refer tensor docs
  token: string
): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(
      `${NFT_API_ENDPOINTS.CREATE_ORDER}`,
      {
        initial_price: initial_price,
        slug: slug,
        delta: delta,
        curve_type: 'LINEAR' // change this
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res.data
  } catch (error) {
    return error
  }
}

export const getCloseOrderPoolTx = async (
  pool: string, // pool
  token: string
): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(
      `${NFT_API_ENDPOINTS.CLOSE_ORDER}`,
      {
        pool: pool
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res.data
  } catch (error) {
    return error
  }
}

// tensor
export const fetchAllActiveOrdersAMM = async (slug: string): Promise<any[]> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.ACTIVE_ORDERS_AMM}`, {
      slug: slug
    })
    return res.data
  } catch (error) {
    return error
  }
}

// Magic Eden
export const fetchMEActiveOrdersAMM = async (mint_address: string): Promise<any[]> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.ACTIVE_ORDERS_AMM_ME}`, {
      mint_address: mint_address
    })
    return res.data.results
  } catch (error) {
    return error
  }
}

export const sellNFTOrderAMM = async (
  mint: string,
  slug: string,
  pool: string,
  min_price_lamports: string,
  token: string
): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(
      `${NFT_API_ENDPOINTS.SELL_NFT_ORDER_AMM}`,
      {
        pool: pool,
        slug: slug,
        mint: mint,
        min_price_lamports: min_price_lamports
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res.data
  } catch (error) {
    return error
  }
}

// magic eden sell amm
export const sellMENFTOrderAMM = async (
  pool: string,
  min_payment_amount: string, // this should be in SOL not lamports
  seller: string,
  asset_mint: string,
  asset_token_account: string,
  token: string
): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(
      `${NFT_API_ENDPOINTS.SELL_NFT_ORDER_AMM_ME}`, // magic eden
      {
        asset_mint,
        asset_amount: '1',
        min_payment_amount: min_payment_amount,
        pool,
        seller,
        asset_token_account
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res.data
  } catch (error) {
    return error
  }
}

// same API is user for deposit and withdraw of SOL
export const orderDepositSol = async (
  pool: string,
  lamports: string,
  is_withdrawal: boolean,
  token: string
): Promise<any> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(
      `${NFT_API_ENDPOINTS.DEPOSIT_SOL}`,
      {
        pool: pool,
        lamports: lamports,
        is_withdrawal: is_withdrawal
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res.data
  } catch (error) {
    throw new Error(error)
  }
}

export const fetchUpdatedJwtToken = async (
  wallet: string,
  signature: string,
  message: string
): Promise<string> => {
  try {
    const res = await httpClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.TOKEN}`, {
      wallet: wallet,
      signature: signature,
      message: message
    })
    return res.data.token
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const dailyVisitData = async (walletAddress: string): Promise<any> => {
  try {
    const res = await httpClient(ANALYTICS_SUBDOMAIN).get(
      `${NFT_API_ENDPOINTS.DAILY_VISIT}?walletAddress=${walletAddress}`
    )
    return res.data
  } catch (err) {
    console.log(err)
  }
}

// fix this one jwt issue monday
export const saveNftTx = async (
  marketPlace: string,
  price: number,
  mintAddress: string,
  collectionName: string,
  txType: IActivityName,
  signature: string,
  collectionUuid: string,
  walletAddress: string
): Promise<any> => {
  try {
    const typeOfActivity: ITypeOfActivity = {
      walletAddress: walletAddress,
      mintAddress: mintAddress,
      collectionName: collectionName,
      price: price,
      typeOfActivity: txType,
      marketPlace: marketPlace,
      signature: signature,
      collectionUuid: collectionUuid
    }
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 10,
        iat: Math.floor(Date.now() / 1000),
        ...typeOfActivity
      },
      process.env.REACT_APP_JWT_SECRET_KEY
    )
    const res = await httpClient(ANALYTICS_SUBDOMAIN).post(
      `${NFT_API_ENDPOINTS.SAVE_TX}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return res
  } catch (error) {
    return error
  }
}
