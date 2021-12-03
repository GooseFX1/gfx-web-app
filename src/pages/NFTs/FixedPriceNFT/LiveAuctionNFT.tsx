import { FC, useState } from 'react'
import { NFTDetails } from '../NFTDetails'
import { useNFTDetails } from '../../../context'
import { NFTDetailsGeneralData, detailTabData, tradingHistoryTabData, attributesTabContentData } from './mockData'
import { PurchaseModal } from './PurchaseModal'

export const FixedPriceNFT: FC = () => {
  const [visible, setVisible] = useState(false)
  const { fetchGeneral, fetchDetailTab, fetchTradingHistoryTab, fetchAttributesTab } = useNFTDetails()

  fetchGeneral(NFTDetailsGeneralData)
  fetchDetailTab(detailTabData)
  fetchTradingHistoryTab(tradingHistoryTabData)
  fetchAttributesTab(attributesTabContentData)

  return (
    <>
      <NFTDetails mode="fixed-price-NFT" handleClickPrimaryButton={() => setVisible(true)} />
      <PurchaseModal visible={visible} setVisible={setVisible} />
    </>
  )
}
