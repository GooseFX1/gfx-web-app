import styled from 'styled-components'

import { Modal } from 'antd'

export const StyledPopupCompletedProfile = styled(Modal)`
  ${({ theme }) => `
  background: ${theme.bg3};
  ${theme.largeBorderRadius}
  width: 747px !important;
  height: 686px;
  text-align: center;

  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }
  img {
    width: 382px;
    height: auto;
    margin: 0 auto;
    display: block;
  }
  .title {
    margin-top: ${theme.margin(5)};
    font-size: 30px;
    font-weight: 600;
    color: ${theme.text7};
  }
  .desc {
    margin-top: ${theme.margin(2.5)};
    font-size: 20px;
    font-weight: 500;
    color: ${theme.text8};
  }
  .ant-modal-body {
    padding: ${theme.margin(3.5)} 155px;
  }
  .ant-modal-close {
    display: none;
  }
  .button-group {
    display: flex;
    margin-top: ${theme.margin(3)};
    justify-content: center;
    .skip-btn {
      font-size: 20px;
      font-weight: 500;
      color: ${theme.text8};
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    .continue-btn {
      width: 169px;
      height: 52px;
      margin-left: ${theme.margin(3.5)};
      padding: ${theme.margin(1.5)} ${theme.margin(3)} ${theme.margin(1.5)};
      border-radius: 45px;
      color: #fff;
      background-color: #9625ae;
      border: none;
      cursor: pointer;
    }
  }
`}
`
