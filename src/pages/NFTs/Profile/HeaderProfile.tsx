import React, { useState } from 'react'
import { Menu, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { PopupProfile } from './PopupProfile'
import PopupCompleteProfile from './PopupCompleteProfile'
import { useDarkMode } from '../../../context'
import { StyledHeaderProfile, StyledDropdown, StyledMenu } from './HeaderProfile.styled'

const menu = (isExplore: boolean) =>
  isExplore ? (
    <StyledMenu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="/share">
          Share
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="/report">
          Report
        </a>
      </Menu.Item>
    </StyledMenu>
  ) : (
    <StyledMenu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="/share-profile">
          Share profile
        </a>
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
  const history = useHistory()
  const { mode } = useDarkMode()
  const [visible, setVisible] = useState(false)
  const [visibleCompletePopup, setVisibleCompletePopup] = useState(true)
  const onSkip = () => setVisibleCompletePopup(false)
  const onContinue = () => setVisibleCompletePopup(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)
  return (
    <StyledHeaderProfile mode={mode}>
      <img
        className="back-icon"
        src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
        alt=""
        onClick={() => history.goBack()}
      />
      <div className="avatar-profile-wrap">
        <img className="avatar-profile" src={`${process.env.PUBLIC_URL}/img/assets/avatar-profile.png`} alt="" />
        <img
          className="edit-icon"
          src={`${process.env.PUBLIC_URL}/img/assets/edit.svg`}
          alt=""
          onClick={() => setVisible(true)}
        />
      </div>
      <div className="name-wrap">
        <span className="name">yeoohr</span>
        <img className="check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
      </div>
      <div className="social-list">
        <a className="social-item" href="/twitter">
          <img className="social-icon" src={`${process.env.PUBLIC_URL}/img/assets/twitter.svg`} alt="" />
        </a>
        <a className="social-item" href="/instagram">
          <img className="social-icon" src={`${process.env.PUBLIC_URL}/img/assets/instagram.svg`} alt="" />
        </a>
        <a className="social-item" href="/facebook">
          <img className="social-icon" src={`${process.env.PUBLIC_URL}/img/assets/facebook.svg`} alt="" />
        </a>
      </div>
      <div className="action-wrap">
        {!isExplore && (
          <button className="btn-create">
            <span>Create</span>
          </button>
        )}
        <StyledDropdown overlay={menu(isExplore)} trigger={['click']} placement="bottomRight" arrow>
          <Button>
            <img className="more-icon" src={`${process.env.PUBLIC_URL}/img/assets/more_icon.svg`} alt="more" />
          </Button>
        </StyledDropdown>
      </div>
      <PopupProfile visible={visible} setVisible={setVisible} handleOk={handleOk} handleCancel={handleCancel} />
      <PopupCompleteProfile visible={visibleCompletePopup} handleOk={onSkip} handleCancel={onContinue} />
    </StyledHeaderProfile>
  )
}
