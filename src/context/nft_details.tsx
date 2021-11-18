import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import {
  INFTDetailsConfig,
  INFTDetailsGeneralData,
  IDetailTabItemData,
  ITradingHistoryTabItemData
} from '../types/nft_details.d'

const NFTDetailsContext = createContext<INFTDetailsConfig | null>(null)

export const NFTDetailsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [general, setGeneral] = useState<INFTDetailsGeneralData>({})
  const [detailTab, setDetailTab] = useState<IDetailTabItemData[]>([])
  const [tradingHistoryTab, setTradingHistoryTab] = useState<ITradingHistoryTabItemData[]>([])

  // TODO: Handler API here
  const fetchGeneral = useCallback((generalData) => {
    setGeneral(generalData)
  }, [])

  const fetchDetailTab = useCallback((detailTabData) => {
    setDetailTab(detailTabData)
  }, [])

  const fetchTradingHistoryTab = useCallback((tradingHistoryData) => {
    setTradingHistoryTab(tradingHistoryData)
  }, [])

  return (
    <NFTDetailsContext.Provider
      value={{ general, detailTab, tradingHistoryTab, fetchGeneral, fetchDetailTab, fetchTradingHistoryTab }}
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
    detailTab: context.detailTab,
    tradingHistoryTab: context.tradingHistoryTab,
    fetchGeneral: context.fetchGeneral,
    fetchDetailTab: context.fetchDetailTab,
    fetchTradingHistoryTab: context.fetchTradingHistoryTab
  }
}
