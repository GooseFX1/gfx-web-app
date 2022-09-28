import { createContext, FC, ReactNode, useCallback, useContext, useState, useReducer, useMemo } from 'react'
import { Connection } from '@solana/web3.js'
import apiClient from '../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../api/NFTs'
import { StringPublicKey, getParsedAccountByMint } from '../web3'
import { useConnectionConfig } from './settings'
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
  const { network } = useConnectionConfig()
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

  const curHighestBid: INFTBid | undefined = useMemo(() => {
    if (bids.length === 0) return undefined
    let hi = 0
    let res: INFTBid | undefined
    bids.forEach((bid: INFTBid) => {
      const price = parseInt(bid.buyer_price)
      if (price > hi) {
        hi = price
        res = bid
      }
    })
    return res
  }, [bids])

  const fetchGeneral = useCallback(async (address: string, conncetion: Connection): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SINGLE_NFT}?mint_address=${address}`)
      const nft: INFTGeneralData = await res.data

      const parsedAccounts = await getParsedAccountByMint({
        mintAddress: nft.data[0].mint_address as StringPublicKey,
        connection: conncetion
      })

      const accountInfo = {
        token_account: parsedAccounts !== undefined ? parsedAccounts.pubkey : null,
        owner: parsedAccounts !== undefined ? parsedAccounts.owner : null
      }

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
        bid: bidObject,
        network: network === 'devnet' ? network : 'mainnet'
      })

      if (res.data.bid_id) {
        setBids((prevBids) => [...prevBids, { ...bidObject, bid_id: res.data.bid_id, uuid: res.data.bid_uuid }])
      }

      return res
    } catch (err) {
      return err
    }
  }, [])

  const removeBidOnSingleNFT = useCallback(async (bidUUID: string): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).delete(`${NFT_API_ENDPOINTS.BID}`, {
        data: {
          bid_id: bidUUID
        }
      })

      setBids((prev) => prev.filter((bid) => bid.uuid !== bidUUID))
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
        ask: paramValue,
        network: network === 'devnet' ? network : 'mainnet'
      })
      return await res
    } catch (error) {
      return error
    }
  }, [])

  const patchNFTAsk = useCallback(async (ask: INFTAsk): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).patch(`${NFT_API_ENDPOINTS.ASK}`, {
        ask_uuid: ask.uuid,
        new_ask_data: {
          clock: ask.clock,
          tx_sig: ask.tx_sig,
          wallet_key: ask.wallet_key,
          auction_house_key: ask.auction_house_key,
          token_account_key: ask.token_account_key,
          auction_house_treasury_mint_key: ask.auction_house_treasury_mint_key,
          token_account_mint_key: ask.token_account_mint_key,
          buyer_price: ask.buyer_price,
          token_size: ask.token_size,
          non_fungible_id: ask.non_fungible_id,
          collection_id: ask.collection_id,
          user_id: ask.user_id
        }
      })

      if (res.data) setAsk(res.data)
      return res
    } catch (err) {
      return err
    }
  }, [])

  const removeNFTListing = useCallback(async (askUUID: string): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).delete(`${NFT_API_ENDPOINTS.ASK}`, {
        data: {
          ask_id: askUUID
        }
      })

      if (res.data) setAsk(undefined)

      return res
    } catch (error) {
      console.log(error)
      return error
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
        curHighestBid,
        removeBidOnSingleNFT,
        patchNFTAsk,
        ask,
        setAsk,
        nftMintingData,
        setNftMintingData,
        updateUserInput,
        fetchUserInput,
        sellNFT,
        removeNFTListing,
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
    curHighestBid: context.curHighestBid,
    removeBidOnSingleNFT: context.removeBidOnSingleNFT,
    patchNFTAsk: context.patchNFTAsk,
    ask: context.ask,
    setAsk: context.setAsk,
    fetchGeneral: context.fetchGeneral,
    nftMintingData: context.nftMintingData,
    setNftMintingData: context.setNftMintingData,
    updateUserInput: context.updateUserInput,
    fetchUserInput: context.fetchUserInput,
    sellNFT: context.sellNFT,
    removeNFTListing: context.removeNFTListing,
    totalLikes: context.totalLikes,
    setTotalLikes: context.setTotalLikes
  }
}
