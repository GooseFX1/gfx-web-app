import styled from 'styled-components'
import { Modal, Form } from 'antd'

export const StyledPopupProfile = styled(Modal)`
  ${({ theme }) => `
  background: #2a2a2a;
  ${theme.largeBorderRadius}
  width: 500px !important;
  height: 757px;
  .ant-modal-header {
    ${theme.largeBorderRadius}
    background: #2a2a2a;
    padding: ${theme.margins['4x']} ${theme.margins['5.5x']} 0 ${theme.margins['5.5x']};
    border: none;
    .ant-modal-title {
      font-size: 25px;
      color: #fff;
      font-weight: 600;
    }
  }
  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }
  .ant-modal-body {
    padding: ${theme.margins['4x']} ${theme.margins['5.5x']};
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
      color: #fff;
    }
  }
  .avatar-wrapper {
    background-color: #000;
    border-style: dashed;
    border-color: #848484;
    border-width: 2px;
    ${theme.largeBorderRadius}
    padding: ${theme.margins['3x']};
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
      color: #fff;
      text-align: center;
      max-width: 70px;
      margin-top: ${theme.margins['0.5x']};
    }
    .note {
      padding-left: ${theme.margins['2.5x']};
      font-size: 14px;
      color: #fff;
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
  ${({ theme }) => `
  margin-top: ${theme.margins['3x']};
  .half-width {
    flex: 1;
    width: 50%;
    margin: 0 ${theme.margins['1x']};
  }
  .full-width {
    display: flex;
    margin: 0 -${theme.margins['0.5x']} ${theme.margins['1x']};;
  }
  .ant-form-item {
    margin-bottom: ${theme.margins['1x']};
  }
  .hint {
    font-size: 9px;
  }
  .ant-form-item-label {
    padding-bottom: 0;
    label {
      font-size: 17px;
      font-weight: 600;
      color: #fff;
      line-height: 1;
    }
    .ant-form-item-optional {
      color: #8a8a8a;
      font-size: 12px;
    }

    .ant-form-item-required {
      &::after {
        content: '(required)';
        font-size: 12px;
        color: #8a8a8a;
        display: inline-block;
        padding-left: ${theme.margins['0.5x']}
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
      &:focus {
        box-shadow: none;
      }
    }
  }
  .section-label {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    line-height: 1;
    margin: ${theme.margins['3x']} 0 ${theme.margins['2x']};
  }
  .btn-save {
    margin-top: ${theme.margins['3.5x']};
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 50px;
    height: 53px;
    ${theme.roundedBorders}
    border: none;
    background: #9625ae;
    cursor: pointer;
  }
`}
`
