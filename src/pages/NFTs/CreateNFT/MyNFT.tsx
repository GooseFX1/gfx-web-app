import React from 'react'
import { NFTDetails } from '../NFTDetails'
import { EditMyNFT } from './EditMyNFT'

interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleOk: () => void
  handleCancel: () => void
  type: string
  backUrl?: string
}

export const MyNFT = ({ visible, setVisible, handleCancel, handleOk, backUrl, type }: Props) => {
  return (
    <>
      <NFTDetails mode="my-created-NFT" backUrl={backUrl} handleClickPrimaryButton={() => setVisible(true)} />
      <EditMyNFT type={type} visible={visible} handleOk={handleOk} handleCancel={handleCancel} />
    </>
  )
}
