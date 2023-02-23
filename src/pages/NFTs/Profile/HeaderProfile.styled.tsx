import { Dropdown, Menu } from 'antd'
import { Modal } from '../../../components'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

export const StyledHeaderProfile = styled.div<{ mode?: string; background?: string }>`
  ${tw`flex items-end p-[24px] pb-[84px] justify-start`}
  @media(max-width: 500px) {
    ${tw`flex flex-col justify-between pb-[20px] h-[50vh] sm:h-[180px]`}
    align-items: inherit;
    background: url(${({ background }) => background});
    background-repeat: no-repeat;
    background-size: cover;
  }

  .row {
    display: flex;
    justify-content: space-between;

    .ant-dropdown {
      z-index: 0;
    }
  }

  .back-icon {
    position: absolute;
    top: 85px;
    left: 55px;
    transform: rotate(90deg);
    width: 26px;
    filter: ${({ mode }) =>
      mode === 'dark'
        ? 'invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%)'
        : '#000'};
    cursor: pointer;
  }

  .avatar-profile-wrap {
    position: relative;
    ${tw`w-[60px] h-[60px]`}
    margin: 0 15px 0 0;
    .avatar-profile {
      ${tw`w-[80px] h-[60px]  h-20 ml-[-5px] mt-[-25px] rounded-[50%]`}
      border: 5px solid #131313;
    }
    .edit-icon {
      ${tw`absolute cursor-pointer h-[30px] bottom-[0px] right-[-20px] w-[30px]`}
    }
  }
  .name-wrap {
    ${tw`mt-[100px] ml-[-170px]`}
  }
  .name {
    @media (max-width: 500px) {
      font-size: 20px;
      margin-left: 0;
    }
    color: ${({ theme }) => theme.text1};
    font-size: 35px;
    font-weight: 600;
    display: inline-block;
    margin-right: ${({ theme }) => theme.margin(1)};
  }
  .check-icon {
    width: 24px;
    height: 24px;
  }
  .social-list {
    @media (max-width: 500px) {
      margin-top: 0;
    }
    margin-top: ${({ theme }) => theme.margin(2)};
    ${({ theme }) => theme.flexCenter}
    .social-item {
      display: inline-block;
      width: 35px;
      margin: 0 ${({ theme }) => theme.margin(1)};
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
      height: 35px;
    }
  }
  .complete-profile {
    ${tw`w-[160px] h-[44px] flex items-center rounded-[45px] justify-center relative bottom-[-100px]
     font-semibold text-[15px] text-white cursor-pointer`}
    background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
    @media (max-width: 500px) {
      font-size: 14px;
      position: static;
    }
  }
  .action-wrap {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    align-items: end;

    .btn-create {
      color: ${({ theme }) => theme.white};
      background-color: #3735bb;
      height: 43px;
      min-width: 132px;
      font-size: 17px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      ${({ theme }) => theme.roundedBorders}
    }
    .btn-create2 {
      background-color: #bb3535;
      margin-right: 10px;
    }
    .btn-purple {
      ${tw`w-[160px] h-[44px] flex items-center rounded-[45px] justify-center relative bottom-[-100px]
      font-semibold text-[15px] text-white cursor-pointer`}

      margin-right: 12px;
      color: ${({ theme }) => theme.white};
      background-color: ${({ theme }) => theme.secondary3};
      border: none;
      cursor: pointer;
      ${({ theme }) => theme.roundedBorders};
      position: relative;
    }
  }
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
  @media (max-width: 500px) {
    margin-top: 0;
    background-color: #383838;
    min-width: inherit;
  }
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
