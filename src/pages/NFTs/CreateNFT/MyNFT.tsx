import { PopupEditMyCreatedNFT } from './PopupEditMyCreatedNFT'
import { NFTDetails } from '../NFTDetails'

interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleOk: () => void
  handleCancel: () => void
  backUrl: string
}

export const MyNFT = ({ visible, setVisible, handleCancel, handleOk, backUrl }: Props) => {
  return (
    <>
      <NFTDetails mode="my-created-NFT" handleClickPrimaryButton={() => setVisible(true)} />
      <PopupEditMyCreatedNFT visible={visible} handleOk={handleOk} handleCancel={handleCancel} />
    </>
  )
}
