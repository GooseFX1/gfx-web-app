import React, { useState, useEffect, useMemo, FC } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { TransactionInstruction, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { Menu, Image } from 'antd'
import { useNFTProfile, useDarkMode, useConnectionConfig } from '../../../context'
import { ILocationState } from '../../../types/app_params.d'
import { PopupProfile } from './PopupProfile'
import { Share } from '../Share'
import {
  AUCTION_HOUSE,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_PROGRAM_ID,
  toPublicKey,
  createWithdrawInstruction
} from '../../../web3'
import { callWithdrawInstruction } from '../actions'
import { MainButton, SuccessfulListingMsg } from '../../../components'
import { notify } from '../../../utils'
import { StyledHeaderProfile, StyledMenu, SETTLE_BALANCE_MODAL, MARGIN_VERTICAL } from './HeaderProfile.styled'
import BN from 'bn.js'
import { IAppParams } from '../../../types/app_params.d'

const menu = (setShareModal: (b: boolean) => void) => (
  <StyledMenu>
    <Menu.Item onClick={() => setShareModal(true)}>
      <div>Share</div>
    </Menu.Item>
    <Menu.Item onClick={() => console.log('report')}>
      <div>Report</div>
    </Menu.Item>
    <Menu.Item>Help</Menu.Item>
  </StyledMenu>
)

type Props = {
  isSessionUser: boolean
}

export const HeaderProfile: FC<Props> = ({ isSessionUser }: Props): JSX.Element => {
  const location = useLocation<ILocationState>()
  const history = useHistory()
  const params = useParams<IAppParams>()
  const { connection, network } = useConnectionConfig()
  const { connected, publicKey, sendTransaction } = useWallet()
  const { sessionUser, nonSessionProfile, fetchNonSessionProfile } = useNFTProfile()
  const { mode } = useDarkMode()
  const [userEscrowBalance, setUserEscrowBalance] = useState<number>()
  const [escrowPaymentAccount, setEscrowPaymentAccount] = useState<[PublicKey, number]>()
  const [profileModal, setProfileModal] = useState(false)
  const [shareModal, setShareModal] = useState(false)
  const [settleBalanceModal, setSettleBalanceModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleCancel = () => setProfileModal(false)

  const currentUserProfile = useMemo(() => {
    console.log(sessionUser, nonSessionProfile)

    if (nonSessionProfile !== undefined && !isSessionUser) {
      return nonSessionProfile
    } else if (sessionUser !== undefined && isSessionUser) {
      return sessionUser
    } else {
      return undefined
    }
  }, [isSessionUser, sessionUser, nonSessionProfile])

  useEffect(() => {
    isCreatingProfile()
    return () => {}
  }, [])

  useEffect(() => {
    if (
      !isSessionUser &&
      params.userAddress &&
      (nonSessionProfile === undefined || nonSessionProfile.pubkey !== params.userAddress)
    ) {
      fetchNonSessionProfile('address', params.userAddress, connection).then((res) =>
        console.log('Non Session User', res)
      )
    }

    return () => {}
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

      const confirm = await connection.confirmTransaction(signature, 'confirmed')
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

  const validExternalLink = (url: string): string => {
    if (url.includes('https://') || url.includes('http://')) {
      return url
    } else {
      return `https://${url}`
    }
  }

  const onShare = (social: string) => {
    console.log(social)
  }

  const successfulEscrowWithdrawMsg = (signature: any, amount: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successful Escrow Withdrawal`}
        itemName={`Amount: ${amount}`}
        supportText={`Remaining balance: 0`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const handleModal = () => {
    if (profileModal) {
      return <PopupProfile visible={profileModal} setVisible={setProfileModal} handleCancel={handleCancel} />
    } else if (shareModal) {
      return (
        <Share
          visible={shareModal}
          handleCancel={() => setShareModal(false)}
          socials={['twitter', 'telegram', 'facebook', 'copy link']}
          handleShare={onShare}
        />
      )
    } else if (settleBalanceModal) {
      return (
        <SETTLE_BALANCE_MODAL visible={settleBalanceModal} setVisible={setSettleBalanceModal}>
          <h2 className="bm-title bm-title-bold">Escrow Account</h2>
          <MARGIN_VERTICAL>
            <p>
              Your escrow account is currently holding a balance. This amount will go toward future bids or purchases if
              you leave it in the account.
            </p>
            <p>
              If you wish to withdraw the amount, you can return the amount to your wallet by settling the amount here.
            </p>
          </MARGIN_VERTICAL>
          <MARGIN_VERTICAL>
            <h3>
              Balance: <strong>{userEscrowBalance}</strong>
            </h3>
          </MARGIN_VERTICAL>
          <MainButton
            height={'60px'}
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
  }

  return (
    <StyledHeaderProfile mode={mode}>
      {handleModal()}
      <img className="back-icon" src={`/img/assets/arrow.svg`} alt="arrow-icon" onClick={() => history.goBack()} />
      <div className="avatar-profile-wrap">
        <Image
          className="avatar-profile"
          fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
          src={
            currentUserProfile
              ? currentUserProfile.profile_pic_link
              : `/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`
          }
          preview={false}
          alt={currentUserProfile ? currentUserProfile.nickname : 'loading'}
        />
        {connected && currentUserProfile && (
          <img className="edit-icon" src={`/img/assets/edit.svg`} alt="" onClick={() => setProfileModal(true)} />
        )}
      </div>
      <div>
        <div className="name-wrap">
          {currentUserProfile === undefined ? (
            <span className="name">...loading</span>
          ) : (
            <span className="name">
              {currentUserProfile.nickname !== null && currentUserProfile.nickname.length > 0
                ? currentUserProfile.nickname
                : 'Unnamed'}
            </span>
          )}
          {currentUserProfile && currentUserProfile.is_verified && (
            <img className="check-icon" src={`/img/assets/check-icon.png`} alt="is-verified-user" />
          )}
        </div>
        <div>
          {currentUserProfile === undefined ? (
            <div>...Loading</div>
          ) : (
            <div className="social-list">
              {currentUserProfile.twitter_link && (
                <a
                  className="social-item"
                  href={validExternalLink(currentUserProfile.twitter_link)}
                  target={'_blank'}
                  rel={'noreferrer'}
                >
                  <img className="social-icon" src={`/img/assets/twitter.svg`} alt="" />
                </a>
              )}
              {currentUserProfile.instagram_link && (
                <a
                  className="social-item"
                  href={validExternalLink(currentUserProfile.instagram_link)}
                  target={'_blank'}
                  rel={'noreferrer'}
                >
                  <img className="social-icon" src={`/img/assets/instagram.svg`} alt="" />
                </a>
              )}
              {currentUserProfile.facebook_link && (
                <a
                  className="social-item"
                  href={validExternalLink(currentUserProfile.facebook_link)}
                  target={'_blank'}
                  rel={'noreferrer'}
                >
                  <img className="social-icon" src={`/img/assets/facebook.svg`} alt="" />
                </a>
              )}
              {currentUserProfile.youtube_link && (
                <a
                  className="social-item-yt"
                  href={validExternalLink(currentUserProfile.youtube_link)}
                  target={'_blank'}
                  rel={'noreferrer'}
                >
                  <img className="social-icon" src={`/img/assets/youtube.png`} alt="" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="action-wrap">
        {isSessionUser && connected && publicKey ? (
          <button className="btn-purple" onClick={() => setSettleBalanceModal(true)}>
            <span>
              Settle Balance: <strong>{userEscrowBalance ? userEscrowBalance.toFixed(2) : 0}</strong>
            </span>
          </button>
        ) : (
          <span></span>
        )}
        {isSessionUser && connected && publicKey && (
          <button className="btn-create" onClick={() => history.push('/NFTs/create')}>
            <span>Create</span>
          </button>
        )}
        {/* <StyledDropdown overlay={menu(setShareModal)} trigger={['click']} placement="bottomRight" arrow>
          <Button>
            <img className="more-icon" src={`/img/assets/more_icon.svg`} alt="more" />
          </Button>
        </StyledDropdown> */}
      </div>
    </StyledHeaderProfile>
  )
}
