import React, { useState, useEffect } from 'react'
import { Menu, Button } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { PopupProfile } from './PopupProfile'
import { ShareProfile } from './ShareProfile'
import { useDarkMode } from '../../../context'
import { StyledHeaderProfile, StyledDropdown, StyledMenu } from './HeaderProfile.styled'
import { ILocationState } from '../../../types/app_params.d'
import { useNFTProfile } from '../../../context'
import { Image } from 'antd'

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

  return (
    <StyledHeaderProfile mode={mode}>
      <img
        className="back-icon"
        src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
        alt="arrow-icon"
        onClick={() => history.push(isExplore ? '/NFTs/profile' : '/NFTs')}
      />
      <div className="avatar-profile-wrap">
        <Image
          className="avatar-profile"
          fallback={`${process.env.PUBLIC_URL}/img/assets/avatar.png`}
          src={sessionUser.profile_pic_link}
          preview={false}
          alt={sessionUser.nickname}
        />
        <img
          className="edit-icon"
          src={`${process.env.PUBLIC_URL}/img/assets/edit.svg`}
          alt=""
          onClick={() => setVisible(true)}
        />
      </div>
      <div className="name-wrap">
        <span className="name">{sessionUser.nickname}</span>
        {sessionUser.is_verified && (
          <img
            className="check-icon"
            src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`}
            alt=""
            onClick={() => history.push('/NFTs/profile/explore')}
          />
        )}
      </div>
      <div className="social-list">
        {sessionUser.twitter_link && (
          <a className="social-item" href={sessionUser.twitter_link} target={'_blank'} rel={'noreferrer'}>
            <img className="social-icon" src={`${process.env.PUBLIC_URL}/img/assets/twitter.svg`} alt="" />
          </a>
        )}
        {sessionUser.instagram_link && (
          <a className="social-item" href={sessionUser.instagram_link} target={'_blank'} rel={'noreferrer'}>
            <img className="social-icon" src={`${process.env.PUBLIC_URL}/img/assets/instagram.svg`} alt="" />
          </a>
        )}
        {sessionUser.facebook_link && (
          <a className="social-item" href={sessionUser.facebook_link} target={'_blank'} rel={'noreferrer'}>
            <img className="social-icon" src={`${process.env.PUBLIC_URL}/img/assets/facebook.svg`} alt="" />
          </a>
        )}
        {sessionUser.youtube_link && (
          <a className="social-item" href={sessionUser.youtube_link} target={'_blank'} rel={'noreferrer'}>
            <img className="social-icon" src={`${process.env.PUBLIC_URL}/img/assets/youtube.png`} alt="" />
          </a>
        )}
      </div>
      <div className="action-wrap">
        <button className="btn-create">
          <span>Create</span>
        </button>

        <StyledDropdown overlay={menu(setVisibleShareProfile)} trigger={['click']} placement="bottomRight" arrow>
          <Button>
            <img className="more-icon" src={`${process.env.PUBLIC_URL}/img/assets/more_icon.svg`} alt="more" />
          </Button>
        </StyledDropdown>
      </div>
      <PopupProfile visible={visible} setVisible={setVisible} handleCancel={handleCancel} />
      <ShareProfile visible={visibleShareProfile} handleCancel={() => setVisibleShareProfile(false)} />
    </StyledHeaderProfile>
  )
}
