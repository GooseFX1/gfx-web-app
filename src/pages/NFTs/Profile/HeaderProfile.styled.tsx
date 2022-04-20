import styled from 'styled-components'
import { Dropdown, Menu } from 'antd'
import { Modal } from '../../../components'

export const StyledHeaderProfile = styled.div<{ mode?: string }>`
  ${({ theme, mode }) => `
  position: relative;
  height: 30vh;
  padding: ${theme.margin(3)};
  padding-bottom: ${theme.margin(8)};
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  background: ${
    mode === 'dark'
      ? 'linear-gradient(180deg, rgba(19, 19, 19, 1) 17.43%, rgba(85, 50, 111, 1) 85.26%)'
      : 'linear-gradient(180deg, #eeeeee 17.43%, #C986FB 85.26%);'
  };

  .back-icon {
    position: absolute;
    top: 55px;
    left: 55px;
    transform: rotate(90deg);
    width: 26px;
    filter: ${
      mode === 'dark'
        ? 'invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%)'
        : '#000'
    };
    cursor: pointer;
  }

  .avatar-profile-wrap {
    position: relative;
    width: 80px;
    margin: 0 15px 0 15px;
    .avatar-profile {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    .edit-icon {
      position: absolute;
      width: 40px;
      height: 40px;
      bottom: -5px;
      right: -1px;
      cursor: pointer;
    }
  }
  .name-wrap {
    display: flex;
    align-items: start;
    margin-left: ${theme.margin(1)};
  }
  .name {
    color: ${theme.text1};
    font-size: 35px;
    font-weight: 600;
    display: inline-block;
    margin-right: ${theme.margin(1)};
  }
  .check-icon {
    width: 24px;
    height: 24px;
  }
  .social-list {
    margin-top: ${theme.margin(2)};
    ${theme.flexCenter}
    .social-item {
      display: inline-block;
      width: 35px;
      margin: 0 ${theme.margin(1)};
      background: #2A2A2A;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .social-item-yt {
      height: 35px;
      width: 35px;
      background-color: #0D0D0D;
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
      height: 35px;
    }
  }
  .action-wrap {    
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    align-items: end;

    .btn-create {
      color: ${theme.white};
      background-color: #3735bb;
      height: 43px;
      min-width: 132px;
      font-size: 17px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      ${theme.roundedBorders}
    }
    .btn-create2 {
      background-color: #bb3535;
      margin-right: 10px;
    }
    .btn-purple {
      height: 43px;
      min-width: 132px;
      font-size: 17px;
      font-weight: 700;
      padding: 0 16px;
      margin-right: 12px;
      color: ${theme.white};
      background-color: ${theme.secondary3};
      border: none;
      cursor: pointer;
      ${theme.roundedBorders}
    }
  }
`}
`
export const StyledDropdown = styled(Dropdown)`
  height: auto;
  width: auto;
  padding: 0;
  border: none;
  background: transparent;
  margin-left: ${({ theme }) => theme.margin(3)};
  .more-icon {
    width: 43px;
    height: 41px;
  }
`
export const StyledMenu = styled(Menu)`
  ${({ theme }) => `
  font-size: 12px;
  color: ${theme.white};
  background-color: ${theme.black};
  min-width: 208px;
  padding: ${theme.margin(1)} 0;
  ${theme.smallBorderRadius}
  margin-top: ${theme.margin(2)};
  position: relative;
  li {
    padding: ${theme.margin(1)} ${theme.margin(3)};
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
`}
`

export const SETTLE_BALANCE_MODAL = styled(Modal)`
  &.ant-modal {
    width: 501px !important;
  }

  .ant-modal-body {
    padding: ${({ theme }) => theme.margin(4.5)};
  }

  .modal-close-icon {
    width: 22px;
    height: 22px;
    position: absolute;
    right: 32px;
  }

  .bm-title {
    color: ${({ theme }) => theme.text1};
    font-size: 20px;
    font-weight: 500;
  }

  .bm-title-bold {
    font-weight: 600;
  }

  div,
  h3 {
    color: ${({ theme }) => theme.text1};
  }

  .btn-text {
    font-weight: 700;
    font-size: 17px;
  }
`

export const MARGIN_VERTICAL = styled.div`
  margin: 24px 0;
`
