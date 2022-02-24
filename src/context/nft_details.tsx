import { createContext, FC, ReactNode, useCallback, useContext, useState, useReducer } from 'react'
import { Connection } from '@solana/web3.js'
import apiClient from '../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../api/NFTs'
import { StringPublicKey, getParsedNftAccountsByOwner, getParsedAccountByMint } from '../web3'
import { useConnectionConfig, ENDPOINTS } from './settings'
import { customFetch } from '../utils'
import {
  INFTDetailsConfig,
  ISingleNFT,
  INFTMetadata,
  INFTBid,
  INFTAsk,
  IMetadataContext,
  INFTGeneralData
} from '../types/nft_details.d'

const NFTDetailsContext = createContext<INFTDetailsConfig | null>(null)

export const NFTDetailsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection, endpoint } = useConnectionConfig()
  const [general, setGeneral] = useState<ISingleNFT>()
  const [nftMetadata, setNftMetadata] = useState<INFTMetadata | null>()
  const [nftMintingData, setNftMintingData] = useState<IMetadataContext>()
  const [bids, setBids] = useState<INFTBid[]>([])
  const [ask, setAsk] = useState<INFTAsk>()
  const [totalLikes, setTotalLikes] = useState<number>()
  const initialState = {
    type: 'fixed-price',
    expiration: '1',
    bid: '0',
    price: '0',
    royalties: '3'
  }
  const reducer = (state, newState) => ({ ...state, ...newState })
  const [userInput, setUserInput] = useReducer(reducer, initialState)

  const fetchGeneral = useCallback(async (id: string, conncetion: Connection): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SINGLE_NFT}?nft_id=${id}`)
      const nft: INFTGeneralData = await res.data

      const parsedAccounts = await getParsedAccountByMint({
        mintAddress: nft.data[0].mint_address as StringPublicKey,
        connection: conncetion
      })

      const accountInfo =
        parsedAccounts !== undefined
          ? { token_account: parsedAccounts.pubkey, owner: parsedAccounts.account?.data?.parsed?.info.owner }
          : { token_account: null, owner: null }

      await fetchMetaData(nft.data[0].metadata_url)

      setGeneral({ ...nft.data[0], ...accountInfo })
      setBids(nft.bids)
      setAsk(nft.asks.length > 0 ? nft.asks[0] : undefined)
      setTotalLikes(nft.total_likes)
      return res
    } catch (err) {
      return err
    }
  }, [])

  const fetchMetaData = useCallback(async (url: string): Promise<any> => {
    try {
      const res = await customFetch(url)
      const nftMetadata = await res
      setNftMetadata(nftMetadata)
    } catch (err) {
      console.error(err)
      setNftMetadata(null)
    }
  }, [])

  const bidOnSingleNFT = useCallback(async (bidObject: any): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.BID}`, {
        bid: bidObject
      })
      return res
    } catch (err) {
      return err
    }
  }, [])

  const updateUserInput = useCallback(async (paramValue: any): Promise<void> => {
    try {
      setUserInput({ ...paramValue })
    } catch (error) {
      console.log(error)
    }
  }, [])

  const fetchUserInput = useCallback(async (): Promise<any> => {
    try {
      return userInput
    } catch (error) {
      console.log(error)
    }
  }, [])

  const sellNFT = useCallback(async (paramValue: any): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.ASK}`, {
        ask: paramValue
      })
      return await res
    } catch (error) {
      return error
    }
  }, [])

  const removeNFTListing = useCallback(async (id: number): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).patch(`${NFT_API_ENDPOINTS.ASK}`, {
        ask_id: id
      })
      return res
    } catch (error) {
      console.log(error)
      return error
    }
  }, [])

  const likeDislike = useCallback(async (user_id: number, nft_id: any): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.LIKE}`, {
        nft_id,
        user_id
      })
      return res
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getLikesUser = useCallback(async (user_id: number): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.ALL_LIKES}?user_id=${user_id}`)
      return res?.data || []
    } catch (error) {
      console.log(error)
      return []
    }
  }, [])

  const getLikesNFT = useCallback(async (user_id: number, nft_id: any): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.ALL_LIKES}?user_id=${user_id}`)
      return res?.data?.filter((i) => i.non_fungible_id == nft_id) || []
    } catch (error) {
      console.log(error)
      return []
    }
  }, [])

  return (
    <NFTDetailsContext.Provider
      value={{
        general,
        setGeneral,
        fetchGeneral,
        nftMetadata,
        setNftMetadata,
        bids,
        setBids,
        bidOnSingleNFT,
        ask,
        setAsk,
        nftMintingData,
        setNftMintingData,
        updateUserInput,
        fetchUserInput,
        sellNFT,
        removeNFTListing,
        likeDislike,
        getLikesUser,
        getLikesNFT,
        totalLikes,
        setTotalLikes
      }}
    >
      {children}
    </NFTDetailsContext.Provider>
  )
}

export const useNFTDetails = (): INFTDetailsConfig => {
  const context = useContext(NFTDetailsContext)
  if (!context) {
    throw new Error('Missing NFT details context')
  }

  return {
    general: context.general,
    setGeneral: context.setGeneral,
    nftMetadata: context.nftMetadata,
    setNftMetadata: context.setNftMetadata,
    bids: context.bids,
    setBids: context.setBids,
    bidOnSingleNFT: context.bidOnSingleNFT,
    ask: context.ask,
    setAsk: context.setAsk,
    fetchGeneral: context.fetchGeneral,
    nftMintingData: context.nftMintingData,
    setNftMintingData: context.setNftMintingData,
    updateUserInput: context.updateUserInput,
    fetchUserInput: context.fetchUserInput,
    sellNFT: context.sellNFT,
    removeNFTListing: context.removeNFTListing,
    likeDislike: context.likeDislike,
    getLikesUser: context.getLikesUser,
    getLikesNFT: context.getLikesNFT,
    totalLikes: context.totalLikes,
    setTotalLikes: context.setTotalLikes
  }
}
