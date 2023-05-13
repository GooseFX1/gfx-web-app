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
import { useWallet } from '@solana/wallet-adapter-react'

export const ProfileItemDetails: FC<{
  visible: boolean
  setDrawerSingleNFT: any
  setSellModal: any
  singleNFT: any
  setShowDelistModal: any
  setShowAcceptBidModal: any
}> = ({
  visible,
  setDrawerSingleNFT,
  setSellModal,
  singleNFT,
  setShowDelistModal,
  setShowAcceptBidModal
}): JSX.Element => {
  const { ask, bids, general } = useNFTDetails()
  const { setBidNow, setBuyNow, setCancelBidClicked } = useNFTAggregator()
  const { sessionUser, sessionUserParsedAccounts } = useNFTProfile()
  const { wallet } = useWallet()
  const pubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])
  const elem = document.getElementById('nft-profile-container') //TODO-PROFILE: Stop background scroll
  const currentAsk: number | null = useMemo(
    () => (ask ? parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER : null),
    [ask]
  )
  const myBid = useMemo(() => {
    if (bids.length > 0) {
      return bids.filter((bid) => bid.wallet_key === pubKey.toString())
    }
    return null
  }, [bids])

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
      width={checkMobile() ? '100%' : '450px'}
      bodyStyle={{ padding: '0' }}
    >
      <div tw="px-[30px]">
        <ImageShowcase
          setShowSingleNFT={setDrawerSingleNFT}
          isOwner={isOwner}
          setShowAcceptBidModal={setShowAcceptBidModal}
        />
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
              <Button
                height="56px"
                width={ask ? '200px' : '100%'}
                cssStyle={tw`bg-red-2 mr-2 sm:mr-0`}
                onClick={() => {
                  setShowDelistModal(true)
                }}
              >
                <span tw="text-regular font-semibold text-white">Delist </span>
              </Button>
            )}

            <Button
              height="56px"
              width={ask ? '200px' : '100%'}
              cssStyle={tw`bg-blue-1 ml-2  sm:mr-0`}
              onClick={() => {
                setSellModal(true)
              }}
            >
              <span tw="text-regular font-semibold text-white">{ask ? 'Modify Listing' : 'List Item'}</span>
            </Button>
          </>
        ) : (
          <>
            {myBid ? (
              <Button
                height="56px"
                width={ask ? '185px' : '100%'}
                cssStyle={tw`bg-red-2 mr-2`}
                onClick={() => setCancelBidClicked(general)}
              >
                <span tw="text-regular font-semibold text-white">Cancel Bid</span>
              </Button>
            ) : (
              <Button
                height="56px"
                width={ask ? '185px' : '100%'}
                cssStyle={tw`bg-blue-1 mr-2`}
                onClick={() => setBidNow(general)}
              >
                <span tw="text-regular font-semibold text-white">Bid</span>
              </Button>
            )}
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
