import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu, Button, Image } from 'antd'
import { useNFTProfile, useDarkMode } from '../../../context'
import { ILocationState } from '../../../types/app_params.d'
import { PopupProfile } from './PopupProfile'
import { ShareProfile } from './ShareProfile'
import { StyledHeaderProfile, StyledDropdown, StyledMenu } from './HeaderProfile.styled'
import { MainButton } from '../../../components'
import { CenteredDiv } from '../../../styles'

const menu = (setVisibleShareProfile: (b: boolean) => void) => (
  <StyledMenu>
    <Menu.Item>
      <div onClick={() => setVisibleShareProfile(true)}>Share</div>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/report">
        Report
      </a>
    </Menu.Item>
    <Menu.Item>
      <div onClick={() => setVisibleShareProfile(true)}>Share Profile</div>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/help">
        Help
      </a>
    </Menu.Item>
  </StyledMenu>
)

type Props = {
  isExplore?: boolean
}

export const HeaderProfile = ({ isExplore }: Props) => {
  const location = useLocation<ILocationState>()
  const history = useHistory()
  const { connected, publicKey } = useWallet()
  const { sessionUser } = useNFTProfile()
  const { mode } = useDarkMode()
  const [visible, setVisible] = useState(false)
  const [visibleShareProfile, setVisibleShareProfile] = useState(false)
  const handleCancel = () => setVisible(false)

  useEffect(() => {
    isCreatingProfile()
    return () => {}
  }, [])

  const isCreatingProfile = (): void => {
    if (location.state && location.state.isCreatingProfile) {
      setVisible(true)
    }
  }

  const validExternalLink = (url: string): string => {
    if (url.includes('https://') || url.includes('http://')) {
      return url
    } else {
      return `https://${url}`
    }
  }

  return (
    <StyledHeaderProfile mode={mode}>
      <img
        className="back-icon"
        src={`/img/assets/arrow.svg`}
        alt="arrow-icon"
        onClick={() => history.push(isExplore ? '/NFTs/profile' : '/NFTs')}
      />
      <div className="avatar-profile-wrap">
        <Image
          className="avatar-profile"
          fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
          src={sessionUser.profile_pic_link}
          preview={false}
          alt={sessionUser.nickname}
        />
        {sessionUser.user_id && (
          <img className="edit-icon" src={`/img/assets/edit.svg`} alt="" onClick={() => setVisible(true)} />
        )}
      </div>
      <div>
        <div className="name-wrap">
          <span className="name">{sessionUser.nickname}</span>
          {!sessionUser.is_verified && (
            <img
              className="check-icon"
              src={`/img/assets/check-icon.png`}
              alt=""
              onClick={() => history.push('/NFTs/profile/explore')}
            />
          )}
        </div>
        <div className="social-list">
          {!sessionUser.user_id && connected && publicKey && (
            <CenteredDiv>
              <MainButton height="30px" onClick={() => setVisible(true)} status="action" width="150px">
                <span>Complete Profile</span>
              </MainButton>
            </CenteredDiv>
          )}
          {sessionUser.twitter_link && (
            <a
              className="social-item"
              href={validExternalLink(sessionUser.twitter_link)}
              target={'_blank'}
              rel={'noreferrer'}
            >
              <img className="social-icon" src={`/img/assets/twitter.svg`} alt="" />
            </a>
          )}
          {sessionUser.instagram_link && (
            <a
              className="social-item"
              href={validExternalLink(sessionUser.instagram_link)}
              target={'_blank'}
              rel={'noreferrer'}
            >
              <img className="social-icon" src={`/img/assets/instagram.svg`} alt="" />
            </a>
          )}
          {sessionUser.facebook_link && (
            <a
              className="social-item"
              href={validExternalLink(sessionUser.facebook_link)}
              target={'_blank'}
              rel={'noreferrer'}
            >
              <img className="social-icon" src={`/img/assets/facebook.svg`} alt="" />
            </a>
          )}
          {sessionUser.youtube_link && (
            <a
              className="social-item-yt"
              href={validExternalLink(sessionUser.youtube_link)}
              target={'_blank'}
              rel={'noreferrer'}
            >
              <img className="social-icon" src={`/img/assets/youtube.png`} alt="" />
            </a>
          )}
        </div>
      </div>

      <div className="action-wrap">
        <button onClick={() => history.push('/NFTs/sell')} className="btn-create btn-create2">
          <span>Sell</span>
        </button>

        <button className="btn-create" onClick={() => history.push('/NFTs/create')}>
          <span>Create</span>
        </button>

        <StyledDropdown overlay={menu(setVisibleShareProfile)} trigger={['click']} placement="bottomRight" arrow>
          <Button>
            <img className="more-icon" src={`/img/assets/more_icon.svg`} alt="more" />
          </Button>
        </StyledDropdown>
      </div>
      <PopupProfile visible={visible} setVisible={setVisible} handleCancel={handleCancel} />
      <ShareProfile visible={visibleShareProfile} handleCancel={() => setVisibleShareProfile(false)} />
    </StyledHeaderProfile>
  )
}
