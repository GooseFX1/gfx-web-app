import styled from 'styled-components'
import { Form, Modal } from 'antd'

export const StyledPopupProfile = styled(Modal)`
  * {
    font-family: 'Montserrat' !important;
  }

  ${({ theme }) => `
  background: ${theme.bg3};
  ${theme.largeBorderRadius}
  width: 500px !important;
  
  .ant-modal-header {
    ${theme.largeBorderRadius}
    background: ${theme.bg3};
    padding: ${theme.margin(4)} ${theme.margin(5.5)} 0 ${theme.margin(5.5)};
    border: none;
    .ant-modal-title {
      font-size: 25px;
      color: ${theme.text7};
      font-weight: 600;
    }
  }
  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }
  .ant-modal-body {
    padding: ${theme.margin(1)} ${theme.margin(5.5)} ${theme.margin(4)};
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
      color: ${theme.text8};
      text-align: center;
      max-width: 70px;
      margin-top: ${theme.margin(0.5)};
    }
    .note {
      padding-left: ${theme.margin(2.5)};
      font-size: 14px;
      color: ${theme.text8};
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
  ${({ theme }) => `
  margin-top: ${theme.margin(3)};
  .half-width {
    flex: 1;
    width: 50%;
    margin: 0 ${theme.margin(1)};
  }
  .full-width {
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
