import { createContext, FC, ReactNode, useCallback, useContext, useState, useReducer } from 'react'
import apiClient from '../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../api/NFTs'
import { customFetch } from '../utils'
import { getParsedNftAccountsByOwner } from '../web3'
import { INFTDetailsConfig, ISingleNFT, INFTMetadata, INFTBid, INFTAsk, IMetadataContext } from '../types/nft_details.d'

const NFTDetailsContext = createContext<INFTDetailsConfig | null>(null)

export const NFTDetailsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [general, setGeneral] = useState<ISingleNFT>()
  const [nftMetadata, setNftMetadata] = useState<INFTMetadata | null>()
  const [nftMintingData, setNftMintingData] = useState<IMetadataContext>()
  const [asks, setAsks] = useState<Array<INFTAsk>>([])
  const [bids, setBids] = useState<Array<INFTBid>>([])
  const initialState = {
    type: 'fixed-price',
    expiration: '1',
    bid: '0',
    price: '0',
    royalties: '3'
  }
  const reducer = (state, newState) => ({ ...state, ...newState })
  const [userInput, setUserInput] = useReducer(reducer, initialState)

  const fetchGeneral = useCallback(async (id: string): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.SINGLE_NFT}?nft_id=${id}`)
      const nft = await res.data

      await fetchMetaData(nft.data[0].metadata_url)

      setGeneral(nft.data[0])
      setAsks(nft.bids)
      setBids(nft.asks)
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

  const bidOnSingleNFT = useCallback(async (paramValue: string): Promise<any> => {
    try {
      const res = await apiClient(NFT_API_BASE).post(`${NFT_API_ENDPOINTS.BID}`, {
        bid: paramValue
      })
      return res
    } catch (err) {
      return err
    }
  }, [])

  const fetchExternalNFTs = useCallback(
    async (paramValue: any, connection: any, nftData: INFTMetadata | null): Promise<any> => {
      try {
        const nfts = await getParsedNftAccountsByOwner({
          publicAddress: `${paramValue}`,
          connection: connection
        })
        console.log(nfts, nftData)

        var data = nfts.filter((i: any) => i.data.name === nftData?.name)[0]
        if (data) {
          setGeneral({
            non_fungible_id: data.key,
            nft_name: nftData?.name,
            nft_description: nftData?.description,
            mint_address: data.mint,
            metadata_url: data.data.uri,
            image_url: nftData?.image,
            animation_url: null,
            collection_id: null
          })
        }
        setNftMetadata(nftData)
      } catch (error) {
        console.log(error)
        setNftMetadata(null)
      }
    },
    []
  )

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
      return res
    } catch (error) {
      console.log(error)
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
        nftMetadata,
        setNftMetadata,
        bids,
        bidOnSingleNFT,
        asks,
        fetchGeneral,
        nftMintingData,
        setNftMintingData,
        fetchExternalNFTs,
        updateUserInput,
        fetchUserInput,
        sellNFT,
        likeDislike,
        getLikesUser,
        getLikesNFT
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
    bidOnSingleNFT: context.bidOnSingleNFT,
    asks: context.asks,
    fetchGeneral: context.fetchGeneral,
    nftMintingData: context.nftMintingData,
    setNftMintingData: context.setNftMintingData,
    fetchExternalNFTs: context.fetchExternalNFTs,
    updateUserInput: context.updateUserInput,
    fetchUserInput: context.fetchUserInput,
    sellNFT: context.sellNFT,
    likeDislike: context.likeDislike,
    getLikesUser: context.getLikesUser,
    getLikesNFT: context.getLikesNFT
  }
}
