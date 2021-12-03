import styled from 'styled-components'

import { Modal } from 'antd'

export const StyledPopupCompletedProfile = styled(Modal)`
  ${({ theme }) => `
  background: #2a2a2a;
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
    margin-top: ${theme.margins['5x']};
    font-size: 30px;
    font-weight: 600;
    color: #fff;
  }
  .desc {
    margin-top: ${theme.margins['2.5x']};
    font-size: 20px;
    font-weight: 500;
    color: #fff;
  }
  .ant-modal-body {
    padding: ${theme.margins['3.5x']} 155px;
  }
  .ant-modal-close {
    display: none;
  }
  .button-group {
    display: flex;
    margin-top: ${theme.margins['3x']};
    justify-content: center;
    .skip-btn {
      font-size: 20px;
      font-weight: 500;
      color: #fff;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    .continue-btn {
      width: 169px;
      height: 52px;
      margin-left: ${theme.margins['3.5x']};
      padding: ${theme.margins['1.5x']} ${theme.margins['3x']} ${theme.margins['1.5x']};
      border-radius: 45px;
      color: #fff;
      background-color: #9625ae;
      border: none;
      cursor: pointer;
    }
  }
`}
`
