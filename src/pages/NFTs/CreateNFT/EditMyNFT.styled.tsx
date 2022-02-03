import styled from 'styled-components'
import { Modal, Form } from 'antd'

export const StyledEditMyNFT = styled(Modal)`
  ${({ theme }) => `
  background-color: ${theme.bg3};
  ${theme.largeBorderRadius}
  width: 620px !important;
  .ant-modal-header {
    ${theme.largeBorderRadius};
    background-color: ${theme.bg3};
    padding: ${theme.margin(3.5)} ${theme.margin(5.5)} 0 ${theme.margin(5.5)};
    border: none;
    .ant-modal-title {
      font-size: 25px;
      color: ${theme.text1};
      font-weight: 600;
    }
  }
  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }
  .ant-modal-body {
    padding: ${theme.margin(3.5)} ${theme.margin(5.5)} ${theme.margin(2)};
  }
  .ant-modal-footer {
    border: none;
    padding: ${theme.margin(1)} ${theme.margin(5.5)};
    .ant-btn:not(.ant-btn-primary) {
      font-size: 18px;
      font-weight: 600;
      border: none;
      margin-right: ${theme.margin(2)};
      color: ${theme.text2};
    }
    .ant-btn-primary {
      width: 245px;
      height: 60px;
      font-size: 18px;
      font-weight: 600;
      color: ${theme.text1};
      ${theme.roundedBorders};
      background: #7d7d7d;
      border: none;
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
      color: ${theme.text1};
    }
  }
  .avatar-wrapper {
    background-color: ${theme.bg3};
    border-style: dashed;
    border-color: #848484;
    border-width: 2px;
    ${theme.largeBorderRadius};
    padding: ${theme.margin(3)};
    margin-bottom: ${theme.margin(4)};
    .image-group {
      display: flex;
      align-items: center;
    }
    .avatar-image {
      width: 104px;
      height: 104px;
      border-radius: 5px;
    }
    .note {
      font-size: 14px;
      padding-left: ${theme.margin(7)};
      color: ${theme.text1};
    }
    .image-wrap {
      position: relative;
      .icon-upload {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        ${theme.flexCenter}
        font-size: 30px;
        opacity: 0;
      }
      &:hover {
        .icon-upload {
          opacity: 1;
        }
      }
    }
    .ant-upload-list {
      border: none;
      ${theme.smallBorderRadius}
      position: relative;
      width: 104px;
      height: 104px;
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

export const StyledFormEditCreatedNFT = styled(Form)`
  ${({ theme }) => `
  .half-width {
    flex: 1;
    width: 50%;
    margin: 0 ${theme.margin(1)};
  }
  .full-width {
    display: flex;
    margin: 0 -${theme.margin(1)} ${theme.margin(2)};
    &.last-item {
      align-items: center;
    }
  }
  .ant-form-item {
    margin-bottom: ${theme.margin(1)};
  }
  .hint {
    font-size: 9px;
    color: #b9b9b9;
  }
  .ant-form-item-label {
    padding-bottom: 0;
    label {
      font-size: 17px;
      font-weight: 600;
      color: ${theme.text1};
      line-height: 1;
    }
    .ant-form-item-optional {
      color: #8a8a8a;
      font-size: 12px;
    }
    > label {
      &.ant-form-item-required {
        &:not(.ant-form-item-required-mark-optional) {
          &::before {
            display: none;
          }
        }
      }
    }
  }
  .ant-input-number {
    border: none;
  }
  .ant-input-number:focus, .ant-input-number-focused {
    box-shadow: none;
  }
  .ant-form-item-control-input {
    input {
      border: none;
      border-radius: 0;
      border-bottom: 2px solid #a8a8a8;
      color: ${theme.text1};
      padding-left: 0px;
      font-size: 12px;
      text-align: left;
      &:focus {
        box-shadow: none;
      }
    }
    .ant-picker {
      width: 195px;
      height: 41px;
      border-radius: 41px;
      margin-top: ${theme.margin(2)};
      background: #9625ae;
      border: none;
      input {
        border: none;
        color: #fff;
      }
      .ant-picker-suffix {
        color: #fff;
      }
    }
  }
  .label-section {
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: 600;
    color: ${theme.text1};
    line-height: 1;
    margin-bottom: ${theme.margin(1)};
    .heart-purple {
      width: 35px;
      height: 35px;
      margin-left: ${theme.margin(1)};
      padding-top: ${theme.margin(1)};
    }
  }
  .description {
    font-size: 10px;
    font-weight: 600;
    color: #828282;
  }
  .percent {
    display: flex;
    align-items: center;
    .item {
      height: 32px;
      border-radius: 2px;
      color: #bebebe;
      margin-right: ${theme.margin(1)};
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      line-height: 30px;
      &.active {
        width: 45px;
        color: #fff;
        background: #9625ae;
      }
    }
  }
  .actions {
    text-align: right;
    padding-top: ${theme.margin(3.5)};
  }
  .cancel-btn {
    font-size: 18px;
    font-weight: 600;
    border: none;
    margin-right: ${theme.margin(2)};
    color: ${theme.text2};
  }
  .save-changes-btn {
    width: 245px;
    height: 60px;
    font-size: 18px;
    font-weight: 600;
    color: ${theme.text1};
    ${theme.roundedBorders};
    background: #7d7d7d;
    border: none;
  }
  `}
`
