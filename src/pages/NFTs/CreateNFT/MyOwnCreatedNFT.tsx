import React, { useState } from 'react'
import { myOwnNFTData } from './mockData'
import { MyNFT } from './MyNFT'

export const MyOwnNFT = () => {
  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)

  return (
    <MyNFT
      setVisible={setVisible}
      visible={visible}
      handleOk={handleOk}
      handleCancel={handleCancel}
      data={myOwnNFTData}
      backUrl="/NFTs/profile"
    />
  )
}
