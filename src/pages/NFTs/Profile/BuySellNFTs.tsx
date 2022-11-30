import { FC } from 'react'
import { Drawer } from 'antd'
import { ImageShowcase } from '../NFTDetails/ImageShowcase'
import { RightSection } from '../NFTDetails/RightSection'
import { checkMobile } from '../../../utils'

export const BuySellNFTs: FC<{
  setShowSingleNFT: any
}> = ({ setShowSingleNFT }): JSX.Element => {
  const elem = document.getElementById('nft-profile-container') //TODO-PROFILE: Stop background scroll
  return (
    <Drawer
      title={null}
      placement={checkMobile() ? 'bottom' : 'right'}
      closable={false}
      onClose={() => setShowSingleNFT(false)}
      getContainer={elem}
      visible={true}
      width={checkMobile() ? '100%' : '32%'}
    >
      <ImageShowcase setShowSingleNFT={setShowSingleNFT} />
      <RightSection status={''} />
    </Drawer>
  )
}
