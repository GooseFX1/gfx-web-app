import React, { useState } from 'react'
import { myCreatedNFTData, detailTabData } from './mockData'
import { MyNFT } from './MyNFT'
import { useNFTDetails } from '../../../context'

export const MyCreatedNFT = () => {
  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)
  const { fetchGeneral, fetchDetailTab } = useNFTDetails()

  fetchGeneral(myCreatedNFTData)
  fetchDetailTab(detailTabData)

  return (
    <MyNFT
      setVisible={setVisible}
      visible={visible}
      handleOk={handleOk}
      handleCancel={handleCancel}
      backUrl="/NFTs/profile"
    />
  )
}
