import { Form, Modal } from 'antd'
import { PopupCustom } from '../Popup/PopupCustom'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

export const StyledPopupProfile = styled(Modal)`
  @media (max-width: 500px) {
    max-width: 100%;
  }
  * {
    font-family: 'Montserrat' !important;
  }

  ${({ theme }) => `
  background: ${theme.bg3};
  ${theme.largeBorderRadius}
  width: 500px !important;
  
  .ant-modal-header {
    ${theme.largeBorderRadius};
    background: ${theme.bg3};
    padding: ${theme.margin(4)} ${theme.margin(5.5)} 0 ${theme.margin(5.5)};
    border: none;
    @media(max-width: 500px){
      padding: 32px 25px 0 25px;
    }
    .ant-modal-title {
      font-size: 25px;
      color: ${theme.text7};
      font-weight: 600;
    }
  }
  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
    height:100%;
  }
  .ant-modal-body {
    padding: ${theme.margin(1)} ${theme.margin(5.5)} ${theme.margin(4)};
    @media(max-width: 500px){
      padding: 25px;
    }
  }
  .ant-modal-close {
    top: 23px;
    right: 35px;
  }
  .ant-modal-close-x {
    width: auto;
    height: auto;
    font-size: 26px;
    line-height: 1;
    svg {
      color: ${theme.closeIconColor};
    }
  }
  .avatar-wrapper {
    background-color: ${theme.avatarBackground};
    border-style: dashed;
    border-color: #848484;
    border-width: 2px;
    ${theme.largeBorderRadius}
    padding: ${theme.margin(3)};
    .image-group {
      display: flex;
      align-items: center;
    }
    .avatar-image {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
    .text {
      font-size: 10px;
      color: ${theme.text4};
      text-align: center;
      max-width: 70px;
      margin-top: ${theme.margin(0.5)};
    }
    .note {
      padding-left: ${theme.margin(2.5)};
      font-size: 14px;
      color: ${theme.text4};
    }
    .image-wrap {
      position: relative;
      .icon-upload {
        position: absolute;
        width: 100%;
        height: 30px;
        top: 20px;
        right: 0;
        display: flex;
        justify-content: center;
        text-align: center;
        font-size: 30px;
        opacity: 0;
      }
      &:hover {
        .icon-upload {
          opacity: 1;
        }
      }
    }
    .ant-upload {
      flex-direction: column;
    }
    .ant-upload-list-picture-card-container {
      width: 70px;
      height: 70px;
    }
    .ant-upload-list {
      border: none;
      border-radius: 10px;
      position: relative;
      width: 70px;
      height: 70px;
    }
    .ant-upload-select {
      position: absolute;
      border: none;
      width: 100%;
      height: 100%;
      bottom: 0;
      right: 0;
      margin: 0;
      background-color: transparent;
    }
    .ant-upload-list-item {
      padding: 0 !important;
      border: none;
    }
  }
`}
`
export const StyledFormProfile = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .ant-upload-span {
    display: none !important;
  }
  .profile-pic-upload-zone {
    max-width: 10%;
    .ant-upload-list-text {
      display: none;
    }

    span.ant-upload {
      display: flex;
      align-items: center;
      background-color: ${({ theme }) => theme.primary2};
      padding: 0 ${({ theme }) => theme.margin(4)};
      height: 42px;
      width: auto;
      border: none;
      cursor: pointer;
      font-weight: 600;
      ${({ theme }) => theme.roundedBorders}
    }
  }

  ${({ theme }) => `
  margin-top: ${theme.margin(3)};

  .profile-image-upload {
    border-radius: 50%;
    width: 76px;
    height: 76px;
    cursor: pointer;
  }

  .half-width {
    @media(max-width: 500px){
      width: 100%;
    }
    flex: 1;
    width: 50%;
    margin: 0 ${theme.margin(1)};
  }
  .full-width {
    @media(max-width: 500px){
      display: block;
    }
    display: flex;
    margin: 0 -${theme.margin(0.5)} ${theme.margin(1)};;
  }
  .ant-form-item {
    margin-bottom: ${theme.margin(1)};
  }
  .hint {
    margin: 8px 0 12px;
    font-size: 9px;
    font-weight: 700;
    color: #8a8a8a;
  }
  .ant-form-item-label {
    padding-bottom: 0;
    color: #8a8a8a;

    label {
      font-size: 17px;
      font-weight: 600;
      color: #8a8a8a;
      line-height: 1;
    }
    .ant-form-item-optional {
      color: #8a8a8a;
      font-size: 12px;
      font-weight: 600;
    }

    .ant-form-item-required {
      &::after {
        content: '(required)';
        font-size: 12px;
        font-weight: 600;
        color: #8a8a8a;
        display: inline-block;
        padding-left: ${theme.margin(0.5)}
      }
    }
  }
  
  .ant-form-item-control-input {
    input {
      border: none;
      border-radius: 0;
      border-bottom: 2px solid #a8a8a8;
      text-align: left;
      padding-left: 0;
      color: ${theme.text1} !important;
      &:focus {
        box-shadow: none;
      }
    }
  }

  .ant-form-item-control-input-content{
    padding-bottom: 1rem;
  }
  .section-label {
    font-size: 17px;
    font-weight: 600;
    color: ${theme.text7};
    line-height: 1;
    margin: ${theme.margin(3)} 0 ${theme.margin(2)};
  }

  .btn-save {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: ${theme.margin(3.5)};
    width: 100%;
    height: 53px;
    ${theme.roundedBorders}
    border: none;
    background: #9625ae;
    cursor: pointer;
    
    span {
      font-size: 17px;
      font-weight: 600;
      line-height: 50px;
    }
  }
`}
`

export const STYLED_PROFILE_POPUP = styled(PopupCustom)`
  /* &.ant-modal {
    ${tw`dark:text-[20px] mt-12 sm:mt-0  text-[10px]`}
    background-color: ${({ theme }) => theme.walletModalWallet};
  } */
  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-8px] sm:mt-auto sm:absolute`}
    background-color: ${({ theme }) => theme.bg26};
    border-radius: 20px;

    @media (max-width: 500px) {
      border-radius: 20px 20px 0 0;
    }
  }
  .ant-upload-span {
    display: none !important;
  }
  .optional {
    ${tw`text-[15px] font-semibold`}
    color: ${({ theme }) => theme.text34};
  }
  .inputContainer {
    color: ${({ theme }) => theme.text11};
    ${tw`bg-none text-[15px] w-[90%] font-semibold mb-1 mt-0.5`}
    border: none;
    background: none;
    :focus {
      outline: none;
    }
  }
  .underLine {
    background: #b5b5b5;
    ${tw`text-[#b5b5b5] h-[2px]`}
  }
  .publicURLText {
    ${tw`text-[13px] sm:text-[10px] font-semibold mt-2 text-[#636363]`}
  }
  .publicURLWhiteText {
    ${tw`text-[13px] font-semibold mt-2 sm:text-[10px]  `}
    color: ${({ theme }) => theme.textWhitePurple}
  }
  .scrollContainer {
    ${tw`sm:h-[480px] sm:overflow-y-auto sm:w-[100%] sm:mt-0`}
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .buyBtnContainer {
    ${tw`flex items-center w-[100%]
     justify-between sm:mt-[20px] absolute bottom-[50px] sm:bottom-4  `}
  }
  .titleHeader {
    color: ${({ theme }) => theme.text32};
    white-space: nowrap;
    ${tw`text-[18px] font-semibold mt-3 leading-[23px]`}
  }
  .titleHeaderBlue {
    color: ${({ theme }) => theme.text32};
    ${tw`text-[18px] font-semibold mt-3 leading-[23px] `}
  }
  .profilePicText {
    ${tw`text-[13px] mt-[10px] ml-2 font-semibold text-[#b5b5b5]`}
  }
  .ant-modal-body {
    ${tw`py-6 px-[30px] sm:px-[20px] `}
  }
  .title {
    color: ${({ theme }) => theme.text32};
    ${tw`text-[20px] font-semibold sm:mt-[-8px] sm:pb-1.5`}
  }

  .separator {
    ${tw`sm:h-[1px] h-0 dark:bg-black-4 bg-grey-4 sm:w-[99vw] sm:absolute  sm:left-0`}
  }
  .saveChanges {
    ${tw`w-[440px] sm:w-[calc(100% - 40px)] sm:absolute
      sm:h-[50px] sm:text-[15px]  cursor-pointer mt-[20px] sm:mt-3 rounded-[50px] border-none
     h-[53px] text-white text-[20px] font-semibold flex items-center justify-center`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    :disabled {
      cursor: not-allowed;
      ${tw`text-[#636363]`}
      background: ${({ theme }) => theme.bg22};
    }
  }
  .profile-image-upload {
    ${tw`w-[100px] h-[100px] rounded-[50%] cursor-pointer`}
  }
`
