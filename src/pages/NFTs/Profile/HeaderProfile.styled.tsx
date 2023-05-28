import { Dropdown, Menu } from 'antd'
import { Modal } from '../../../components'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

export const StyledHeaderProfile = styled.div<{ mode?: string; background?: string }>`
  ${tw`relative h-[112px]`}
  @media(max-width: 500px) {
    ${tw`flex flex-col justify-between pb-[20px] h-[50vh] sm:h-[160px]`}
    align-items: inherit;
    background: url(${({ background }) => background});
    background-repeat: no-repeat;
    background-size: cover;
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
      ${tw`w-[70px] h-[70px] h-20 ml-[-5px] sm:ml-2.5 mt-[-25px] rounded-[50%] dark:border-black-2 border-white`}
      border: 5px solid;
    }
    .edit-icon {
      ${tw`absolute cursor-pointer h-[30px] bottom-[0px] sm:top-5 sm:right-[-25px] right-[-20px] w-[30px] `}
    }
  }
  .profileBio {
    ${({ theme }) => theme.customScrollBar(0)}
    ${tw`dark:text-grey-2 w-[220px] sm:text-right
     h-10 overflow-y-auto sm:text-[13px] font-semibold leading-[15px] `}
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .wallet-wrap {
    ${tw`mt-[100px] sm:absolute sm:left-0  sm:mt-[125px] `}
  }
  .name-wrap {
    ${tw`mt-[100px] ml-[-170px] sm:right-3 sm:mt-[10px] sm:absolute`}
  }
  .name {
    @media (max-width: 500px) {
      font-size: 20px;
      margin-left: 0;
    }
    ${tw`text-grey-5 sm:text-right sm:w-full`}
    font-size: 35px;
    font-weight: 600;
    display: inline-block;
    margin-right: ${({ theme }) => theme.margin(1)};
  }
  .check-icon {
    width: 24px;
    height: 24px;
  }
  .solscan-img {
    ${tw` `}
  }
  .social-list {
    @media (max-width: 500px) {
      ${tw`sm:absolute right-4 mt-[120px]`}
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
    ${tw`w-[160px] h-[44px] flex items-center rounded-[45px] justify-center relative sm:mt-[130px] sm:mr-2.5 
    sm:w-[145px] font-semibold text-[15px] text-white cursor-pointer text-[13px]`}
    background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
    @media (max-width: 500px) {
      font-size: 14px;
      position: static;
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
    border-radius: 15px;
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
