import React, { useState } from 'react'
import { myCreatedNFTData } from './mockData'
import { MyNFT } from './MyNFT'

export const MyCreatedNFT = () => {
  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)

  return (
    <MyNFT
      setVisible={setVisible}
      visible={visible}
      handleOk={handleOk}
      handleCancel={handleCancel}
      data={myCreatedNFTData}
      backUrl="/NFTs/profile"
    />
  )
}
