import { FC } from 'react'
import { NFTDetails } from '../NFTDetails'
import { useNFTDetails } from '../../../context'
import { NFTDetailsGeneralData, detailTabData, tradingHistoryTabData } from './mockData'

export const LiveAuctionNFT: FC = () => {
  const { fetchGeneral, fetchDetailTab, fetchTradingHistoryTab } = useNFTDetails()

  fetchGeneral(NFTDetailsGeneralData)
  fetchDetailTab(detailTabData)
  fetchTradingHistoryTab(tradingHistoryTabData)

  return <NFTDetails mode="live-auction-NFT" handleClickPrimaryButton={() => {}} />
}
