import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import apiClient from '../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../api/NFTs'
import { customFetch } from '../utils'
import { INFTDetailsConfig, ISingleNFT, INFTMetadata, INFTBid, INFTAsk, IMetadataContext } from '../types/nft_details.d'

const NFTDetailsContext = createContext<INFTDetailsConfig | null>(null)

export const NFTDetailsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [general, setGeneral] = useState<ISingleNFT>()
  const [nftMintingData, setNftMintingData] = useState<IMetadataContext>()
  const [nftMetadata, setNftMetadata] = useState<INFTMetadata | null>()
  const [asks, setAsks] = useState<Array<INFTAsk>>([])
  const [bids, setBids] = useState<Array<INFTBid>>([])

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
      return await res
    } catch (err) {
      return err
    }
  }, [])

  return (
    <NFTDetailsContext.Provider
      value={{
        general,
        nftMetadata,
        bids,
        bidOnSingleNFT,
        asks,
        fetchGeneral,
        nftMintingData,
        setNftMintingData
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
    nftMetadata: context.nftMetadata,
    bids: context.bids,
    bidOnSingleNFT: context.bidOnSingleNFT,
    asks: context.asks,
    fetchGeneral: context.fetchGeneral,
    nftMintingData: context.nftMintingData,
    setNftMintingData: context.setNftMintingData
  }
}
