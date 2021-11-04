import styled from 'styled-components'
import { Modal, Form } from 'antd'

export const StyledPopupEditMyCreatedNFT = styled(Modal)`
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 20px;
  width: 620px !important;
  height: 700px;
  .ant-modal-header {
    border-radius: 20px;
    background-color: ${({ theme }) => theme.bg3};
    padding: 30px 45px 0 45px;
    border: none;
    .ant-modal-title {
      font-size: 25px;
      color: ${({ theme }) => theme.text1};
      font-weight: 600;
    }
  }
  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }
  .ant-modal-body {
    padding: 30px 45px 15px;
  }
  .ant-modal-footer {
    border: none;
    .ant-btn:not(.ant-btn-primary) {
      font-size: 18px;
      font-weight: 600;
      border: none;
      margin-right: ${({ theme }) => theme.margins['2x']};
      color: ${({ theme }) => theme.text2};
    }
    .ant-btn-primary {
      width: 245px;
      height: 60px;
      font-size: 18px;
      font-weight: 600;
      color: ${({ theme }) => theme.text1};
      border-radius: 60px;
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
      color: ${({ theme }) => theme.text1};
    }
  }
  .avatar-wrapper {
    background-color: ${({ theme }) => theme.bg3};
    border-style: dashed;
    border-color: #848484;
    border-width: 2px;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: ${({ theme }) => theme.margins['4x']};
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
      padding-left: 57px;
      font-size: 14px;
      color: ${({ theme }) => theme.text1};
    }
    .image-wrap {
      position: relative;
      .icon-upload {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
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
      border-radius: 6px;
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
`

export const StyledFormEditCreatedNFT = styled(Form)`
  .half-width {
    flex: 1;
    width: 50%;
    margin: 0 ${({ theme }) => theme.margins['1x']};
  }
  .full-width {
    display: flex;
    margin: 0 -${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2x']};
    &.last-item {
      align-items: center;
    }
  }
  .ant-form-item {
    margin-bottom: ${({ theme }) => theme.margins['1x']};
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
      color: ${({ theme }) => theme.text1};
      line-height: 1;
    }
    .ant-form-item-optional {
      color: #8a8a8a;
      font-size: 12px;
    }
  }
  .ant-form-item-control-input {
    input {
      border: none;
      border-radius: 0;
      border-bottom: 2px solid #a8a8a8;
      color: ${({ theme }) => theme.text1};
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
      margin-top: ${({ theme }) => theme.margins['2x']};
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
    color: ${({ theme }) => theme.text1};
    line-height: 1;
    margin-bottom: ${({ theme }) => theme.margins['1x']};
    .heart-purple {
      width: 35px;
      height: 35px;
      margin-left: ${({ theme }) => theme.margins['1x']};
      padding-top: 8px;
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
      margin-right: ${({ theme }) => theme.margins['1x']};
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
  .btn-save {
    margin-top: ${({ theme }) => theme.margins['4x']};
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 50px;
    height: 53px;
    border-radius: 53px;
    border: none;
    background: #9625ae;
  }
`
