import React, { useState } from 'react'
import { myCreatedNFTData, myOwnNFTData, detailTabData, tradingHistoryTabData } from './mockData'
import { MyNFT } from './MyNFT'
import { useNFTDetails } from '../../../context'

type Props = {
  type: string
}
export const MyCreatedNFT = ({ type }: Props) => {
  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)
  const { fetchGeneral, fetchDetailTab, fetchTradingHistoryTab } = useNFTDetails()

  fetchGeneral(type === 'created' ? myCreatedNFTData : myOwnNFTData)
  fetchDetailTab(detailTabData)
  fetchTradingHistoryTab(tradingHistoryTabData)

  return (
    <MyNFT
      setVisible={setVisible}
      visible={visible}
      handleOk={handleOk}
      handleCancel={handleCancel}
      type={type}
      backUrl="/NFTs/profile"
    />
  )
}
