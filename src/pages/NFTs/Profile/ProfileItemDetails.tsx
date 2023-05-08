import { FC, useMemo } from 'react'
import { Drawer } from 'antd'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useNFTAggregator, useNFTDetails, useNFTProfile } from '../../../context'
import { ImageShowcase } from '../NFTDetails/ImageShowcase'
import { RightSection } from '../NFTDetails/RightSection'
import { Button } from '../../../components'
import { ParsedAccount } from '../../../web3'
import { checkMobile } from '../../../utils'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import tw from 'twin.macro'
import 'styled-components/macro'

export const ProfileItemDetails: FC<{
  visible: boolean
  setDrawerSingleNFT: any
  setSellModal: any
  singleNFT: any
}> = ({ visible, setDrawerSingleNFT, setSellModal, singleNFT }): JSX.Element => {
  const { ask, bids, general } = useNFTDetails()
  const { setBidNow, setBuyNow } = useNFTAggregator()
  const { sessionUser, sessionUserParsedAccounts } = useNFTProfile()
  const elem = document.getElementById('nft-profile-container') //TODO-PROFILE: Stop background scroll
  const currentAsk: number | null = useMemo(
    () => (ask ? parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER : null),
    [ask]
  )

  const isOwner: boolean = useMemo(() => {
    // if (props.userId) return true
    const findAccount: undefined | ParsedAccount =
      singleNFT && sessionUserParsedAccounts !== undefined
        ? sessionUserParsedAccounts.find((acct) => acct.mint === singleNFT.mint_address)
        : undefined
    return findAccount === undefined ? false : true
  }, [sessionUser, sessionUserParsedAccounts])
  return (
    <Drawer
      title={null}
      placement={checkMobile() ? 'bottom' : 'right'}
      closable={false}
      onClose={() => setDrawerSingleNFT(false)}
      getContainer={elem}
      visible={visible}
      height={checkMobile() ? '655px' : '786px'}
      width={checkMobile() ? '100%' : '460px'}
      bodyStyle={{ padding: '0' }}
    >
      <div tw="px-[16px]">
        <ImageShowcase setShowSingleNFT={setDrawerSingleNFT} />
        <RightSection status={''} />
      </div>
      <div
        tw="absolute left-0 right-0 bottom-0 h-[86px] w-[100%] 
              dark:bg-black-2 bg-grey-5 px-[24px] flex items-center justify-between
              border-solid border-b-0 border-l-0 border-r-0 dark:border-black-4 border-grey-4"
      >
        {isOwner ? (
          <>
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
              width={ask ? '200px' : '100%'}
              cssStyle={tw`bg-red-1 mr-2 sm:mr-0`}
              onClick={() => {
                setSellModal(true)
              }}
            >
              <span tw="text-regular font-semibold text-white">{ask ? 'Modify Price' : 'List Item'}</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              height="56px"
              width={ask ? '185px' : '100%'}
              cssStyle={tw`bg-blue-1 mr-2`}
              onClick={() => setBidNow(general)}
            >
              <span tw="text-regular font-semibold text-white">Bid</span>
            </Button>
            {ask && (
              <Button
                height="56px"
                width="185px"
                cssStyle={tw`bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2`}
                onClick={() => setBuyNow(general)}
              >
                <span tw="text-regular font-semibold text-white">Buy Now</span>
              </Button>
            )}
          </>
        )}
      </div>
    </Drawer>
  )
}
