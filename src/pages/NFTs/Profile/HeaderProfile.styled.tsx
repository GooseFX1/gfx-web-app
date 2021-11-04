import styled from 'styled-components'
import { Dropdown, Menu } from 'antd'

export const StyledHeaderProfile = styled.div<{ mode?: string }>`
  position: relative;
  height: 260px;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  background: rgb(30, 30, 30);
  background: ${({ mode }) =>
    mode === 'dark' ? 'linear-gradient(0deg, rgba(0, 0, 0, 1) 3%, rgba(30, 30, 30, 1) 43%)' : '#fff'};
  .back-icon {
    position: absolute;
    top: 55px;
    left: 55px;
    transform: rotate(90deg);
    width: 36px;
    filter: ${({ mode }) =>
      mode === 'dark'
        ? 'invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%)'
        : '#000'};
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
    margin-top: ${({ theme }) => theme.margins['1x']};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .name {
    color: ${({ theme }) => theme.text1};
    font-size: 18px;
    display: inline-block;
    margin-right: ${({ theme }) => theme.margins['1x']};
  }
  .check-icon {
    width: 20px;
    height: 20px;
  }
  .social-list {
    margin-top: ${({ theme }) => theme.margins['2x']};
    display: flex;
    justify-content: center;
    align-items: center;
    .social-item {
      display: inline-block;
      width: 35px;
      margin: 0 ${({ theme }) => theme.margins['1x']};
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
export const StyledDropdown = styled(Dropdown)`
  width: auto;
  padding: 0;
  border: none;
  background: transparent;
  margin-left: ${({ theme }) => theme.margins['3x']};
  .more-icon {
    width: 43px;
    height: 41px;
  }
`
export const StyledMenu = styled(Menu)`
  font-size: 12px;
  color: #fff;
  background-color: #000;
  min-width: 208px;
  padding: 10px 0;
  border-radius: 10px;
  margin-top: ${({ theme }) => theme.margins['2x']};
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
