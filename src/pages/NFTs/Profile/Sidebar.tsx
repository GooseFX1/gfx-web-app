/* eslint-disable */
import { FC, useMemo, useState } from 'react'
import { Image } from 'antd'
import styled from 'styled-components'
import { useAccounts, useDarkMode, useNFTProfile } from '../../../context'
import { checkMobile, notify, truncateAddress } from '../../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { PopupProfile } from './PopupProfile'
import { Share } from '../Share'
import { generateTinyURL } from '../../../api/tinyUrl'
import { WRAPPED_SOL_MINT } from '@jup-ag/core'
import { formatNumber } from '../launchpad/candyMachine/utils'

const PROFILE = styled.div`
  width: 25vw;
  background: ${({ theme }) => theme.bg25};
  border-top-right-radius: 20px;

  .profile-pic {
    display: flex;
    position: relative;
    height: 100px;
    .avatar-profile-wrap {
      position: relative;
      width: 116px;
      bottom: 50px;
      left: 28px;
      .avatar-profile {
        width: 116px;
        border-radius: 50%;
        border: 8px solid #131313;
      }
      .icon {
        width: 40px;
        height: 40px;
        position: absolute;
        bottom: -5px;
        right: -1px;
        cursor: pointer;
      }
    }

    .no-socials-msg {
      position: absolute;
      right: 20px;
      top: 20px;
      color: ${({ theme }) => theme.text20};
      font-size: 18px;
      font-weight: 600;
    }

    .social-list {
      margin-left: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      .social-item {
        display: inline-block;
        width: 35px;
        margin: 0 ${({ theme }) => theme.margin(2)};
        background: #2a2a2a;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .social-item-yt {
        height: 35px;
        width: 35px;
        background-color: #0d0d0d;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 25px;
          width: 25px;
        }
      }
      .social-icon {
        width: 35px;
        height: 30px;
        background-color: ${({ theme }) => theme.bg25};
      }
      .height{
        height: 17px;
      }
    }
  }

  .bio {
    color: ${({ theme }) => theme.text20};
    font-size: 15px;
    font-weight: 600;
    margin: 20px 25px 35px;
  }

  .graphic-img{
    width: 100%;
    height: 159px;
  }

  .portfolio{
    margin: 20px auto;
    width: 90%;
    color: ${({ theme }) => theme.text30};
    font-size: 20px;
    font-weight: 600;

    >span{
        color: ${({ theme }) => theme.text31};
        font-size: 20px;
        font-weight: 600;
    }

    .track-portfolio{
        font-size: 15px;
        margin-top: 12px;
        margin-bottom: 35px;

    }
  }
}
`

const SCAN_SHARE = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  > span {
    font-size: 30px;
    color: ${({ theme }) => theme.text7};
    font-weight: 600;
  }

  .solscan-img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    cursor: pointer;
  }

  .share-img {
    height: 40px;
    width: 40px;
    cursor: pointer;
  }
`

const SOL = styled.div`
  width: 90%;
  margin: 0 auto;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text4};

  > div {
    margin-bottom: 12px;
  }

  > span {
    font-weight: 600;
    font-size: 30px;
  }

  .sol {
    font-size: 18px;
    margin-left: 10px;
  }

  > img {
    height: 20px;
    width: 20px;
    margin-left: 7px;
  }
`

type Props = {
  isSessionUser: boolean
}

export const Sidebar: FC<Props> = ({ isSessionUser }: Props): JSX.Element => {
  const { sessionUser, nonSessionProfile } = useNFTProfile()
  const currentUserProfile = useMemo(() => {
    if (nonSessionProfile !== undefined && !isSessionUser) {
      return nonSessionProfile
    } else if (sessionUser !== undefined && isSessionUser) {
      return sessionUser
    } else {
      return undefined
    }
  }, [isSessionUser, sessionUser, nonSessionProfile])
  const { connected, publicKey } = useWallet()
  const { mode } = useDarkMode()
  const [profileModal, setProfileModal] = useState(false)
  const [shareModal, setShareModal] = useState(false)
  const handleCancel = () => setProfileModal(false)
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey])
  const { getUIAmount } = useAccounts()
  const solAmount = getUIAmount(WRAPPED_SOL_MINT.toBase58())
  const userSol = formatNumber.format(solAmount)
  const [twitterHover, setTwitterHover] = useState(false)
  const [telegramHover, setTelegramHover] = useState(false)
  const [discordHover, setDiscordHover] = useState(false)

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
    } else {
      return false
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

  return (
    <PROFILE>
      {handleModal()}
      <div className="profile-pic">
        {!checkMobile() && (
          <div className="avatar-profile-wrap">
            {currentUserProfile && currentUserProfile.profile_pic_link ? (
              <img
                className="avatar-profile"
                src={currentUserProfile.profile_pic_link}
                alt="user-image"
                height="116px"
                width="116px"
              />
            ) : (
              <img
                className="avatar-profile"
                src={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
                alt="user-image"
                height="116px"
                width="116px"
              />
            )}

            {connected && currentUserProfile && isSessionUser ? (
              <img
                className="icon"
                src={`/img/assets/edit.svg`}
                alt="edit-image"
                onClick={() => setProfileModal(true)}
              />
            ) : (
              <img
                className="icon"
                src={`/img/assets/addImage.svg`}
                alt="add-image"
                onClick={() => setProfileModal(true)}
              />
            )}
          </div>
        )}
        {currentUserProfile &&
        currentUserProfile.twitter_link &&
        currentUserProfile.instagram_link &&
        currentUserProfile.telegram_link &&
        currentUserProfile.youtube_link ? (
          <div className="social-list">
            {currentUserProfile.twitter_link && (
              <a
                className="social-item"
                target={'_blank'}
                rel={'noreferrer'}
                onMouseEnter={() => {
                  setTwitterHover(true)
                }}
                onMouseLeave={() => {
                  setTwitterHover(false)
                }}
                href={validExternalLink(currentUserProfile.twitter_link)}
              >
                <img
                  className={twitterHover ? 'social-icon height' : 'social-icon'}
                  src={twitterHover ? '/img/assets/twitterHover.svg' : '/img/assets/twitterNew.svg'}
                  alt=""
                />
              </a>
            )}
            {currentUserProfile.instagram_link && (
              <a
                className="social-item"
                target={'_blank'}
                rel={'noreferrer'}
                onMouseEnter={() => {
                  setTelegramHover(true)
                }}
                onMouseLeave={() => {
                  setTelegramHover(false)
                }}
                href={validExternalLink(currentUserProfile.instagram_link)}
              >
                <img
                  className="social-icon"
                  src={telegramHover ? '/img/assets/telegramHover.svg' : '/img/assets/telegramNew.svg'}
                  alt=""
                />
              </a>
            )}
            {currentUserProfile.telegram_link && (
              <a
                className="social-item"
                target={'_blank'}
                rel={'noreferrer'}
                onMouseEnter={() => {
                  setDiscordHover(true)
                }}
                onMouseLeave={() => {
                  setDiscordHover(false)
                }}
                href={validExternalLink(currentUserProfile.telegram_link)}
              >
                <img
                  className="social-icon"
                  src={discordHover ? '/img/assets/discordHover.svg' : '/img/assets/discordNew.svg'}
                  alt=""
                />
              </a>
            )}
          </div>
        ) : (
          <div className="no-socials-msg">
            No Socials <br />
            Connected
          </div>
        )}
      </div>
      <SCAN_SHARE>
        <span>{base58 && truncateAddress(base58)}</span>
        <a href="">
          <img src="/img/assets/solscanBlack.svg" alt="solscan-icon" className="solscan-img" />
        </a>
        <div onClick={() => setShareModal(true)} className="share-img">
          <img src="/img/assets/shareBlue.svg" height="40px" width="40px" />
        </div>
      </SCAN_SHARE>
      {currentUserProfile && currentUserProfile.bio ? (
        <div className="bio">{currentUserProfile.bio}</div>
      ) : (
        <div className="bio">
          Add your bio and share with the <br /> world who you are!
        </div>
      )}
      <img src="/img/assets/profileGraphic.png" alt="profile-graphic" className="graphic-img" />
      <div className="portfolio">
        <span>Portfolio Value</span> (Coming soon)
        <div className="track-portfolio">
          Track your colection portfolio like <br /> never before!
        </div>
      </div>
      <SOL>
        <div>Wallet Ballance</div>
        <span>{userSol ? userSol : '0.00'}</span>
        <span className="sol">SOL</span>
        <img src="/img/crypto/sol.png" alt="sol-icon" />
      </SOL>
    </PROFILE>
  )
}
