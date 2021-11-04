import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'
import { INFTDetailsConfig, INFTDetailsGeneralData, IDetailTabItemData } from '../types/nft_details.d'

const NFTDetailsContext = createContext<INFTDetailsConfig | null>(null)

export const NFTDetailsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [general, setGeneral] = useState<INFTDetailsGeneralData>({})
  const [detailTab, setDetailTab] = useState<IDetailTabItemData[]>([])

  // TODO: Handler API here
  const fetchGeneral = useCallback((generalData) => {
    setGeneral(generalData)
  }, [])

  const fetchDetailTab = useCallback((detailTabData) => {
    setDetailTab(detailTabData)
  }, [])

  return (
    <NFTDetailsContext.Provider value={{ general, detailTab, fetchGeneral, fetchDetailTab }}>
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
    fetchGeneral: context.fetchGeneral,
    fetchDetailTab: context.fetchDetailTab
  }
}
