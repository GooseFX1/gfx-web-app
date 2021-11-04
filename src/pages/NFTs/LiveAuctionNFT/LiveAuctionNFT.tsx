import { FC } from 'react'
import { NFTDetails } from '../NFTDetails'
import { useNFTDetails } from '../../../context'
import { NFTDetailsGeneralData, detailTabData } from './mockData'

export const LiveAuctionNFT: FC = () => {
  const { fetchGeneral, fetchDetailTab } = useNFTDetails()

  fetchGeneral(NFTDetailsGeneralData)
  fetchDetailTab(detailTabData)

  return <NFTDetails mode="live-auction-NFT" handleClickPrimaryButton={() => {}} />
}
