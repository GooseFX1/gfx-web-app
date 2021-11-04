import React, { useState } from 'react'
import { Menu, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { PopupProfile } from './PopupProfile'
import { useDarkMode } from '../../../context'
import { StyledHeaderProfile, StyledDropdown, StyledMenu } from './HeaderProfile.styled'

const menu = (
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

export const HeaderProfile = () => {
  const history = useHistory()
  const { mode } = useDarkMode()
  const [visible, setVisible] = useState(false)
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
        <button className="btn-create">Create</button>
        <StyledDropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
          <Button>
            <img className="more-icon" src={`${process.env.PUBLIC_URL}/img/assets/more_icon.svg`} alt="more" />
          </Button>
        </StyledDropdown>
      </div>
      <PopupProfile visible={visible} handleOk={handleOk} handleCancel={handleCancel} />
    </StyledHeaderProfile>
  )
}
