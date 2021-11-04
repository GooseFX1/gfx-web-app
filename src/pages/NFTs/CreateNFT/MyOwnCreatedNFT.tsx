import React, { useState } from 'react'
import { MyNFT } from './MyNFT'
import { myOwnNFTData, detailTabData } from './mockData'
import { useNFTDetails } from '../../../context'

export const MyOwnNFT = () => {
  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)

  const { fetchGeneral, fetchDetailTab } = useNFTDetails()

  fetchGeneral(myOwnNFTData)
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
