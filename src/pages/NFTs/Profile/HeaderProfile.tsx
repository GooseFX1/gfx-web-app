/* eslint-disable */
import React, { useState, useEffect, useMemo, FC } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { TransactionInstruction, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { Image, Button, Dropdown, Menu } from 'antd'
import styled from 'styled-components'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { generateTinyURL } from '../../../api/tinyUrl'
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
import { MainButton, SuccessfulListingMsg, FloatingActionButton } from '../../../components'
import { checkMobile, notify } from '../../../utils'
import { StyledHeaderProfile, StyledMenu, SETTLE_BALANCE_MODAL, MARGIN_VERTICAL } from './HeaderProfile.styled'
import BN from 'bn.js'
import { IAppParams } from '../../../types/app_params.d'
import { FLOATING_ACTION_ICON } from '../../../styles'

const DROPDOWN = styled(Dropdown)`
  width: auto;
  padding: 0;
  border: none;
  background: transparent;
  margin-left: ${({ theme }) => theme.margin(3)};

  .collection-more-icon {
    @media (max-width: 500px) {
      transform: rotate(90deg);
    }
    width: 43px;
    height: 41px;
  }

  &:after {
    content: none;
  }
`

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
  const [randomBackground, setRandomBackground] = useState('')

  const currentUserProfile = useMemo(() => {
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
    return null
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

    return null
  }, [isSessionUser, nonSessionProfile, params.userAddress])

  useEffect(() => {
    fetchEscrowPayment().then((escrowBalance: number | undefined) => setUserEscrowBalance(escrowBalance))
  }, [connected, publicKey])

  useEffect(() => {
    const backgroundArray = [
      '/img/assets/redBackground.png',
      '/img/assets/purpleBackground.png',
      '/img/assets/multiBackground.png'
    ]
    const randomImage = backgroundArray[Math.floor(Math.random() * backgroundArray.length)]
    setRandomBackground(randomImage)
  }, [])

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

  const onShare = async (social: string) => {
    if (social === 'copy link') {
      copyToClipboard()
      return
    }

    const res = await generateTinyURL(
      `https://${process.env.NODE_ENV !== 'production' ? 'app.staging.goosefx.io' : window.location.host}${
        window.location.pathname
      }`,
      ['gfx', 'nest-exchange', 'user-profile', social]
    )

    if (res.status !== 200) {
      notify({ type: 'error', message: 'Error creating sharing url' })
      return
    }

    const tinyURL = res.data.data.tiny_url

    switch (social) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=Check%20out%20${currentUserProfile.nickname}s
          %20collection%20on%20Nest%20NFT%20Exchange%20&url=${tinyURL}&via=GooseFX1&
          original_referer=${window.location.host}${window.location.pathname}`
        )
        break
      case 'telegram':
        window.open(
          `https://t.me/share/url?url=${tinyURL}&text=Check%20out%20${currentUserProfile.nickname}s
          %20collection%20on%20Nest%20NFT%20Exchange%20`
        )
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${tinyURL}`)
        break
      default:
        break
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href)
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

  const menu = (
    <StyledMenu>
      <Menu.Item onClick={() => setProfileModal(true)}>
        <div>Edit profile</div>
      </Menu.Item>
      <Menu.Item onClick={() => setShareModal(true)}>
        <div>Share Profile</div>
      </Menu.Item>
    </StyledMenu>
  )

  return (
    <StyledHeaderProfile mode={mode} background={randomBackground}>
      {handleModal()}
      {checkMobile() ? (
        <div className="row" id="row">
          <div style={{ position: checkMobile() ? 'static' : 'absolute', top: '24px', left: '24px' }}>
            <FloatingActionButton height={40} onClick={() => history.goBack()}>
              <FLOATING_ACTION_ICON src={`/img/assets/arrow.svg`} alt="back" />
            </FloatingActionButton>
          </div>
          <div>
            <DROPDOWN
              overlay={menu}
              trigger={['click']}
              placement="bottomRight"
              getPopupContainer={() => document.getElementById('row')}
            >
              <Button style={{ height: 'auto' }}>
                <img className="collection-more-icon" src={`/img/assets/more_icon.svg`} alt="more" />
              </Button>
            </DROPDOWN>
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
          <FloatingActionButton height={40} onClick={() => history.goBack()}>
            <FLOATING_ACTION_ICON src={`/img/assets/arrow.svg`} alt="back" />
          </FloatingActionButton>
        </div>
      )}

      {!checkMobile() && (
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
          {connected && currentUserProfile && isSessionUser && (
            <img className="edit-icon" src={`/img/assets/edit.svg`} alt="" onClick={() => setProfileModal(true)} />
          )}
        </div>
      )}
      <div
        style={{
          display: checkMobile() ? 'flex' : 'block',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: checkMobile() ? '35px' : 'auto'
        }}
      >
        <div className="name-wrap">
          {currentUserProfile === undefined ? (
            <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
          ) : (
            <span className="name">
              {currentUserProfile.nickname !== null && currentUserProfile.nickname.length > 0
                ? currentUserProfile.nickname
                : 'Unnamed'}
            </span>
          )}
          {currentUserProfile && currentUserProfile.is_verified && (
            <img className="check-icon" src={`/img/assets/check-icon.svg`} alt="is-verified-user" />
          )}
        </div>
        {currentUserProfile === undefined ? (
          <div className="social-list">
            {[1, 2, 3, 4].map((_, key) => (
              <span className="social-item" key={key}>
                <SkeletonCommon width="35px" height="35px" borderRadius="50%" />
              </span>
            ))}
          </div>
        ) : currentUserProfile.twitter_link &&
          currentUserProfile.instagram_link &&
          currentUserProfile.telegram_link &&
          currentUserProfile.youtube_link ? (
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
            {currentUserProfile.telegram_link && (
              <a
                className="social-item"
                href={validExternalLink(currentUserProfile.telegram_link)}
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
        ) : (
          checkMobile() && (
            <div className="complete-profile" onClick={() => setProfileModal(true)}>
              Complete Profile
            </div>
          )
        )}
      </div>
      {!checkMobile() && (
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
          <DROPDOWN overlay={menu} trigger={['click']} placement="bottomRight" align={{ offset: [0, 26] }}>
            <Button style={{ height: 'auto' }}>
              <img className="collection-more-icon" src={`/img/assets/more_icon.svg`} alt="more" />
            </Button>
          </DROPDOWN>
        </div>
      )}
    </StyledHeaderProfile>
  )
}
