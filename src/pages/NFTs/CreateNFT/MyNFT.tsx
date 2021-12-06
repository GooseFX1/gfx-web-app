// import { SellYourNFTView } from '../SellNFT/SellYourNFTView'
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
      {/* To test Sell your NFT View, please uncomment this line below */}
      {/* <SellYourNFTView visible={visible} handleOk={handleOk} handleCancel={handleCancel} /> */}
      <EditMyNFT type={type} visible={visible} handleOk={handleOk} handleCancel={handleCancel} />
    </>
  )
}
