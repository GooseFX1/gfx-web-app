import React, { useState } from 'react'
import { myCreatedNFTData, myOwnNFTData, detailTabData } from './mockData'
import { MyNFT } from './MyNFT'
import { useNFTDetails } from '../../../context'

type Props = {
  type: string
}
export const MyCreatedNFT = ({ type }: Props) => {
  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)
  const { fetchGeneral, fetchDetailTab } = useNFTDetails()

  fetchGeneral(myCreatedNFTData)
  fetchDetailTab(detailTabData)

  return type === 'created' ? (
    <MyNFT
      setVisible={setVisible}
      visible={visible}
      handleOk={handleOk}
      handleCancel={handleCancel}
      data={myCreatedNFTData}
      type={type}
      backUrl="/NFTs/profile"
    />
  ) : (
    <MyNFT
      setVisible={setVisible}
      visible={visible}
      handleOk={handleOk}
      handleCancel={handleCancel}
      data={myOwnNFTData}
      type={type}
      backUrl="/NFTs/profile"
    />
  )
}
