import { FC, useState } from 'react'
import { NFTDetails } from '../NFTDetails'
import { useNFTDetails } from '../../../context'
import { NFTDetailsGeneralData, detailTabData, tradingHistoryTabData, attributesTabContentData } from './mockData'
import { BidModal } from './BidModal'

export const LiveAuctionNFT: FC = () => {
  const [visible, setVisible] = useState(false)
  const { fetchGeneral, fetchDetailTab, fetchTradingHistoryTab, fetchAttributesTab } = useNFTDetails()

  fetchGeneral(NFTDetailsGeneralData)
  fetchDetailTab(detailTabData)
  fetchTradingHistoryTab(tradingHistoryTabData)
  fetchAttributesTab(attributesTabContentData)

  return (
    <>
      <NFTDetails mode="live-auction-NFT" handleClickPrimaryButton={() => setVisible(true)} />
      <BidModal visible={visible} setVisible={setVisible} />
    </>
  )
}
