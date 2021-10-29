import React, { useState } from 'react'
import styled from 'styled-components'
import { Menu, Dropdown, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { PopupProfile } from './PopupProfile'

const HEADER_PROFILE = styled.div`
  position: relative;
  height: 260px;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  background: rgb(30, 30, 30);
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 3%, rgba(30, 30, 30, 1) 43%);
  .back-icon {
    position: absolute;
    top: 55px;
    left: 55px;
    transform: rotate(90deg);
    width: 36px;
    filter: invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%);
    cursor: pointer;
  }
  .avatar-profile-wrap {
    position: relative;
    width: 80px;
    margin: 0 auto;
    .avatar-profile {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    .edit-icon {
      position: absolute;
      width: 31px;
      height: 31px;
      bottom: -5px;
      right: -1px;
      cursor: pointer;
    }
  }
  .name-wrap {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .name {
    color: #fff;
    font-size: 18px;
    display: inline-block;
    margin-right: 10px;
  }
  .check-icon {
    width: 20px;
    height: 20px;
  }
  .social-list {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    .social-item {
      display: inline-block;
      width: 35px;
      margin: 0 8px;
    }
    .social-icon {
      width: 35px;
      height: 35px;
    }
  }
  .action-wrap {
    position: absolute;
    top: 44px;
    right: 21px;
    .btn-create {
      color: #fff;
      background-color: #3735bb;
      height: 41px;
      min-width: 132px;
      border-radius: 45px;
      font-size: 13px;
      border: none;
      cursor: pointer;
    }
  }
`
const DROPDOWN = styled(Dropdown)`
  width: auto;
  padding: 0;
  border: none;
  background: transparent;
  margin-left: 22px;
  .more-icon {
    width: 43px;
    height: 41px;
  }
`
const MENU_LIST = styled(Menu)`
  font-size: 12px;
  color: #fff;
  background-color: #000;
  min-width: 208px;
  padding: 10px 0;
  border-radius: 10px;
  margin-top: 16px;
  position: relative;
  li {
    padding: 8px 23px;
  }
  &:before {
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-top-color: #000;
    border-left-color: #000;
    top: -5px;
    right: 18px;
    position: absolute;
    z-index: 1;
    display: block;
    width: 10px;
    height: 10px;
    background: transparent;
    border-style: solid;
    border-width: 5px;
    transform: rotate(45deg);
    content: '';
  }
`

const menu = (
  <MENU_LIST>
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
  </MENU_LIST>
)

export const HeaderProfile = () => {
  const history = useHistory()
  const [visible, setVisible] = useState(false)
  const handleOk = () => setVisible(false)
  const handleCancel = () => setVisible(false)
  return (
    <HEADER_PROFILE>
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
        <DROPDOWN overlay={menu} trigger={['click']} placement="bottomRight" arrow>
          <Button>
            <img className="more-icon" src={`${process.env.PUBLIC_URL}/img/assets/more_icon.svg`} alt="more" />
          </Button>
        </DROPDOWN>
      </div>
      <PopupProfile visible={visible} handleOk={handleOk} handleCancel={handleCancel} />
    </HEADER_PROFILE>
  )
}
