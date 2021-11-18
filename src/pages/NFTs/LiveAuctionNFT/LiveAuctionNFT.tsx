import { FC } from 'react'
import { NFTDetails } from '../NFTDetails'
import { useNFTDetails } from '../../../context'
import { NFTDetailsGeneralData, detailTabData, tradingHistoryTabData, attributesTabContentData } from './mockData'

export const LiveAuctionNFT: FC = () => {
  const { fetchGeneral, fetchDetailTab, fetchTradingHistoryTab, fetchAttributesTab } = useNFTDetails()

  fetchGeneral(NFTDetailsGeneralData)
  fetchDetailTab(detailTabData)
  fetchTradingHistoryTab(tradingHistoryTabData)
  fetchAttributesTab(attributesTabContentData)

  return <NFTDetails mode="live-auction-NFT" handleClickPrimaryButton={() => {}} />
}
