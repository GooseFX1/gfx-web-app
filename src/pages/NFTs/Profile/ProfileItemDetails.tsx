import { FC } from 'react'
import { Drawer } from 'antd'
import { ImageShowcase } from '../NFTDetails/ImageShowcase'
import { RightSection } from '../NFTDetails/RightSection'
import { Button } from '../../../components'
import { checkMobile } from '../../../utils'
import { useNFTDetails } from '../../../context'
import tw from 'twin.macro'
import 'styled-components/macro'

export const ProfileItemDetails: FC<{
  setShowSingleNFT: any
}> = ({ setShowSingleNFT }): JSX.Element => {
  const { ask } = useNFTDetails()
  const elem = document.getElementById('nft-profile-container') //TODO-PROFILE: Stop background scroll
  return (
    <Drawer
      title={null}
      placement={checkMobile() ? 'bottom' : 'right'}
      closable={false}
      onClose={() => setShowSingleNFT(false)}
      getContainer={elem}
      visible={true}
      width={checkMobile() ? '100%' : '460px'}
      bodyStyle={{ padding: '0' }}
    >
      <div tw="px-[30px]">
        <ImageShowcase setShowSingleNFT={setShowSingleNFT} />
        <RightSection status={''} />
      </div>
      <div
        tw="absolute left-0 right-0 bottom-0 h-[86px] w-[100%] 
              dark:bg-black-2 bg-grey-5 px-[30px] flex items-center justify-between
              border-solid border-b-0 border-l-0 border-r-0 dark:border-black-4 border-grey-4"
      >
        {ask && (
          <div>
            <div>On Sale for:</div>
            <div>{ask}</div>
          </div>
        )}
        <Button
          height="56px"
          width={ask ? '185px' : '100%'}
          cssStyle={tw`bg-red-1`}
          onClick={() => {
            setShowSingleNFT(false)
          }}
        >
          <span tw="text-regular font-semibold text-white">{ask ? 'Modify Price' : 'List Item'}</span>
        </Button>
      </div>
    </Drawer>
  )
}
