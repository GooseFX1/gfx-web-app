import { EditMyNFT } from './EditMyNFT'
import { NFTDetails } from '../NFTDetails'

interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleOk: () => void
  handleCancel: () => void
  backUrl: string
}

export const MintItemView = ({ visible, setVisible, handleCancel, handleOk, backUrl }: Props) => {
  return (
    <>
      <NFTDetails status="successful" backUrl={backUrl} handleClickPrimaryButton={() => setVisible(true)} />
      <EditMyNFT type={null} visible={visible} handleOk={handleOk} handleCancel={handleCancel} />
    </>
  )
}
