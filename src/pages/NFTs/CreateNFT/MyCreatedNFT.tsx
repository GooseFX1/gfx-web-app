import React, { useState } from 'react'
// import { myCreatedNFTData, myOwnNFTData, detailTabData, tradingHistoryTabData } from './mockData'
import { MyNFT } from './MyNFT'
import { MintItemView } from './MintItemView'

type Props = {
  type: string
}
export const MyCreatedNFT = ({ type }: Props) => {
  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)

  // fetchGeneral(type === 'created' ? myCreatedNFTData : myOwnNFTData)

  return type === 'mint' ? (
    <MintItemView
      setVisible={setVisible}
      visible={visible}
      handleOk={handleOk}
      handleCancel={handleCancel}
      backUrl="/NFTs/profile"
    />
  ) : (
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
