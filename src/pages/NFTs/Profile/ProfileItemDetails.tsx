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
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { useWallet } from '@solana/wallet-adapter-react'
import { ButtonContainer } from '../Collection/DetailViewNFTDrawer'

export const ProfileItemDetails: FC<{
  visible: boolean
  setDrawerSingleNFT: any
  setSellModal: any
  singleNFT: any
  setShowDelistModal: any
}> = ({ visible, setDrawerSingleNFT, setSellModal, singleNFT, setShowDelistModal }): JSX.Element => {
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

  const isOwner: boolean = useMemo(() => {
    // if (props.userId) return true
    const findAccount: undefined | ParsedAccount =
      singleNFT && sessionUserParsedAccounts !== undefined
        ? sessionUserParsedAccounts.find((acct) => acct.mint === singleNFT.mint_address)
        : undefined
    return findAccount === undefined ? false : true
  }, [sessionUser, sessionUserParsedAccounts])
  const bgForBtn = ask ? tw`bg-blue-1 ml-2 sm:!ml-0 sm:mr-0` : tw`bg-red-2 ml-2 sm:mr-0 sm:!ml-0`

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
      <div tw="px-[30px] sm:px-[14px]">
        <ImageShowcase setShowSingleNFT={setDrawerSingleNFT} isOwner={isOwner} />
        <RightSection status={''} />
      </div>

      <ButtonContainer />
    </Drawer>
  )
}
