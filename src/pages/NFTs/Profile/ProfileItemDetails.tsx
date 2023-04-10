import { FC, useMemo } from 'react'
import { Drawer } from 'antd'
import { useNFTDetails } from '../../../context'
import { ImageShowcase } from '../NFTDetails/ImageShowcase'
import { RightSection } from '../NFTDetails/RightSection'
import { Button } from '../../../components'
import { checkMobile } from '../../../utils'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import tw from 'twin.macro'
import 'styled-components/macro'

export const ProfileItemDetails: FC<{
  visible: boolean
  setDrawerSingleNFT: any
  setSellModal: any
}> = ({ visible, setDrawerSingleNFT, setSellModal }): JSX.Element => {
  const { ask } = useNFTDetails()
  const elem = document.getElementById('nft-profile-container') //TODO-PROFILE: Stop background scroll
  const currentAsk: number | null = useMemo(
    () => (ask ? parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER : null),
    [ask]
  )

  return (
    <Drawer
      title={null}
      placement={checkMobile() ? 'bottom' : 'right'}
      closable={false}
      onClose={() => setDrawerSingleNFT(false)}
      getContainer={elem}
      visible={visible}
      width={checkMobile() ? '100%' : '460px'}
      bodyStyle={{ padding: '0' }}
    >
      <div tw="px-[30px]">
        <ImageShowcase setShowSingleNFT={setDrawerSingleNFT} />
        <RightSection status={''} />
      </div>
      <div
        tw="absolute left-0 right-0 bottom-0 h-[86px] w-[100%] 
              dark:bg-black-2 bg-grey-5 px-[30px] flex items-center justify-between
              border-solid border-b-0 border-l-0 border-r-0 dark:border-black-4 border-grey-4"
      >
        {ask && (
          <div>
            <label tw="dark:text-grey-1 text-black-3 font-semibold text-average">On Sale for:</label>
            <div tw="flex items-center text-lg dark:text-grey-5 text-black-2 font-semibold">
              <span>{currentAsk}</span>
              <img src={`/img/crypto/SOL.svg`} alt={'SOL'} tw="h-[20px] ml-2" />
            </div>
          </div>
        )}
        <Button
          height="56px"
          width={ask ? '185px' : '100%'}
          cssStyle={tw`bg-red-1`}
          onClick={() => {
            setDrawerSingleNFT(false)
            setSellModal(true)
          }}
        >
          <span tw="text-regular font-semibold text-white">{ask ? 'Modify Price' : 'List Item'}</span>
        </Button>
      </div>
    </Drawer>
  )
}
