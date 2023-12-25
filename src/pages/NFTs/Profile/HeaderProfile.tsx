import React, { useState, useEffect, useMemo, useCallback, FC } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useLocation, useParams } from 'react-router-dom'
import { TransactionInstruction, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { Image } from 'antd'
// import styled from 'styled-components'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { useNFTProfile, useDarkMode, useConnectionConfig } from '../../../context'
import { ILocationState } from '../../../types/app_params'
import { Button } from '../../../components'
import { PopupProfile } from './PopupProfile'

import {
  AUCTION_HOUSE,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_PROGRAM_ID,
  toPublicKey,
  createWithdrawInstruction,
  confirmTransaction
} from '../../../web3'
import { callWithdrawInstruction } from '../actions'
import { MainButton, SuccessfulListingMsg } from '../../../components'
import { checkMobile, notify, truncateAddress } from '../../../utils'
import { StyledHeaderProfile, SETTLE_BALANCE_MODAL, MARGIN_VERTICAL } from './HeaderProfile.styled'
import BN from 'bn.js'
import { IAppParams } from '../../../types/app_params'
import tw from 'twin.macro'
import 'styled-components/macro'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { WalletProfilePicture } from './ProfilePageSidebar'

type Props = {
  isSessionUser: boolean
}

export const HeaderProfile: FC<Props> = ({ isSessionUser }: Props): JSX.Element => {
  const location = useLocation<ILocationState>()
  const params = useParams<IAppParams>()
  const { connection, network } = useConnectionConfig()
  const { sendTransaction, wallet } = useWallet()
  const { sessionUser, nonSessionProfile, fetchNonSessionProfile } = useNFTProfile()
  const { mode } = useDarkMode()
  const [userEscrowBalance, setUserEscrowBalance] = useState<number>()
  const [escrowPaymentAccount, setEscrowPaymentAccount] = useState<[PublicKey, number]>()
  const [profileModal, setProfileModal] = useState<boolean>(false)
  const [settleBalanceModal, setSettleBalanceModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleCancel = () => setProfileModal(false)

  const publicKey: PublicKey | null = useMemo(
    () => (wallet?.adapter ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter, wallet?.adapter?.publicKey]
  )
  const connected: boolean = useMemo(
    () => (wallet?.adapter ? wallet?.adapter?.connected : false),
    [wallet?.adapter, wallet?.adapter?.connected]
  )

  const currentUserProfile = useMemo(() => {
    if (nonSessionProfile !== undefined && !isSessionUser) {
      return nonSessionProfile
    } else if (sessionUser !== null && isSessionUser) {
      return sessionUser
    } else {
      return undefined
    }
  }, [isSessionUser, sessionUser, nonSessionProfile])

  useEffect(() => {
    isCreatingProfile()
    return null
  }, [])

  useEffect(() => {
    if (
      !isSessionUser &&
      params.userAddress &&
      (nonSessionProfile === undefined || nonSessionProfile.pubkey !== params.userAddress)
    ) {
      fetchNonSessionProfile('address', params.userAddress, connection).then(() => console.log('Non Session User'))
    }

    return null
  }, [isSessionUser, nonSessionProfile, params.userAddress])

  useEffect(() => {
    fetchEscrowPayment().then((escrowBalance: number | undefined) => setUserEscrowBalance(escrowBalance))
  }, [connected, publicKey])

  const fetchEscrowPayment = async (): Promise<number | undefined> => {
    try {
      const escrowAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
        [Buffer.from(AUCTION_HOUSE_PREFIX), toPublicKey(AUCTION_HOUSE).toBuffer(), publicKey.toBuffer()],
        toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
      )
      setEscrowPaymentAccount(escrowAccount)
      const balance = await connection.getBalance(escrowAccount[0])
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      return undefined
    }
  }

  const handleWithdrawEscrowBalance = (e) => {
    e.preventDefault()
    setIsLoading(true)

    const withdrawAmount: BN = new BN(userEscrowBalance * LAMPORTS_PER_SOL)
    callAuctionHouseWithdraw(withdrawAmount)
  }

  const callAuctionHouseWithdraw = async (amount: BN) => {
    if (escrowPaymentAccount === undefined) return

    const { withdrawInstructionAccounts, withdrawInstructionArgs } = await callWithdrawInstruction(
      publicKey,
      escrowPaymentAccount,
      amount
    )

    const withdrawIX: TransactionInstruction = await createWithdrawInstruction(
      withdrawInstructionAccounts,
      withdrawInstructionArgs
    )

    const transaction = new Transaction().add(withdrawIX)
    try {
      const signature = await sendTransaction(transaction, connection)
      console.log(signature)

      const confirm = await confirmTransaction(connection, signature, 'confirmed')
      console.log(confirm)

      if (confirm.value.err === null) {
        notify(successfulEscrowWithdrawMsg(signature, amount.toString()))
        setUserEscrowBalance(0)
        setSettleBalanceModal(false)
      }
    } catch (error) {
      notify({
        type: 'error',
        message: error.message
      })
    }

    setIsLoading(false)
  }

  const isCreatingProfile = (): void => {
    if (location.state && location.state.isCreatingProfile) {
      setProfileModal(true)
    }
  }

  const successfulEscrowWithdrawMsg = (signature: any, amount: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successful Escrow Withdrawal`}
        itemName={`Amount: ${parseFloat(amount) / LAMPORTS_PER_SOL_NUMBER}`}
        supportText={`Remaining balance: 0`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const handleModal = useCallback(() => {
    if (profileModal) {
      return <PopupProfile visible={profileModal} setVisible={setProfileModal} handleCancel={handleCancel} />
    } else if (settleBalanceModal) {
      return (
        <SETTLE_BALANCE_MODAL visible={settleBalanceModal} setVisible={setSettleBalanceModal}>
          <h2 className="bm-title bm-title-bold">Escrow Account</h2>
          <MARGIN_VERTICAL>
            <p>
              Your escrow account is currently holding a balance. This amount will go toward future bids or
              purchases if you leave it in the account.
            </p>
            <p>
              If you wish to withdraw the amount, you can return the amount to your wallet by settling the amount
              here.
            </p>
          </MARGIN_VERTICAL>
          <MARGIN_VERTICAL>
            <h3>
              Balance: <strong>{userEscrowBalance}</strong>
            </h3>
          </MARGIN_VERTICAL>
          <MainButton
            height={'40px'}
            width="100%"
            status="action"
            onClick={handleWithdrawEscrowBalance}
            loading={isLoading}
            disabled={userEscrowBalance === 0}
          >
            <span className={'btn-text'}>Settle Balance</span>
          </MainButton>
        </SETTLE_BALANCE_MODAL>
      )
    } else {
      return false
    }
  }, [profileModal, settleBalanceModal])

  let profilePic = currentUserProfile?.profile_pic_link
  if (profilePic === 'https://gfx-nest-image-resources.s3.amazonaws.com/avatar.png') profilePic = null

  return (
    <StyledHeaderProfile mode={mode}>
      {handleModal()}

      {checkMobile() && (
        <div tw="flex justify-between items-center h-full">
          <div className="avatar-profile-wrap">
            {profilePic ? (
              <Image
                width={70}
                height={70}
                className="avatar-profile"
                fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
                src={profilePic ? profilePic : `/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
                preview={false}
                alt={currentUserProfile ? currentUserProfile.nickname : 'loading'}
              />
            ) : (
              <WalletProfilePicture />
              // mobile version
            )}
          </div>

          <div className="name-wrap" tw="ml-4">
            {currentUserProfile === undefined ? (
              <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
            ) : (
              <div className="name">
                {currentUserProfile.nickname !== null && currentUserProfile.nickname.length > 0
                  ? currentUserProfile.nickname
                  : truncateAddress(wallet?.adapter?.publicKey?.toString())}
              </div>
            )}
            {currentUserProfile !== undefined && (
              <div className="profileBio">
                {currentUserProfile.bio ? (
                  currentUserProfile.bio
                ) : sessionUser ? (
                  <div>
                    Complete your profile
                    <br />
                    and start sharing!
                  </div>
                ) : (
                  <div> No Bio </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div tw="absolute bottom-0 right-[22px] flex sm:right-2">
        {connected && publicKey && (
          <Button
            height={'35px'}
            width={'200px'}
            cssStyle={tw`bg-purple-1 mr-[12px] sm:mr-0`}
            onClick={() => setSettleBalanceModal(true)}
            loading={settleBalanceModal}
          >
            <span tw="font-semibold text-regular">
              Settle Balance:{' '}
              <strong tw="font-bold text-white">{userEscrowBalance ? userEscrowBalance.toFixed(2) : 0}</strong>
            </span>
          </Button>
        )}
      </div>
    </StyledHeaderProfile>
  )
}
