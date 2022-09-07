import styled from 'styled-components'

import { Modal } from 'antd'

export const StyledPopupCompletedProfile = styled(Modal)`
  * {
    font-family: 'Montserrat';
  }

  ${({ theme }) => `
  background: ${theme.bg3};
  ${theme.largeBorderRadius}
  width: 747px !important;
  height: 686px;
  text-align: center;
  @media(max-width: 500px){
    width: 85% !important;
    height: 529px;
  }

  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }
  img {
    @media(max-width: 500px){
      width: 75% !important;
      height: 220px;
    }
    width: 382px;
    height: auto;
    margin: 0 auto;
    display: block;
  }
  .title {
    @media(max-width: 500px){
      font-size: 20px;
    }
    margin-top: ${theme.margin(5)};
    font-size: 30px;
    font-weight: 600;
    color: ${theme.text7};
  }
  .desc {
    @media(max-width: 500px){
      font-size: 15px;
      margin-bottom: 40px;
    }
    margin-top: ${theme.margin(2.5)};
    font-size: 20px;
    font-weight: 500;
    color: ${theme.text8};
  }
  .ant-modal-body {
    padding: ${theme.margin(3.5)} 155px;
    @media(max-width: 500px){
      padding: 0;
    }
  }
  .ant-modal-close {
    display: none;
  }
  .button-group {
    @media(max-width: 500px){
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column-reverse;
    }
    display: flex;
    margin-top: ${theme.margin(3)};
    justify-content: center;
    .skip-btn {
      @media(max-width: 500px){
        font-size: 15px;
      }
      font-size: 20px;
      font-weight: 500;
      color: ${theme.text8};
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    .continue-btn {
      @media(max-width: 500px){
        width: 150px;
        height: 44px;
        margin-bottom: 28px;
        background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
        border-radius: 20px;
        margin-left: 0;
        font-size: 15px;
      }
      width: 169px;
      height: 52px;
      color: #fff;
      margin-left: ${theme.margin(3.5)};
      font-size: 20px;
      font-weight: 600;
      border-radius: 45px;
      background-color: #9625ae;
      border: none;
      cursor: pointer;
    }
  }
`}
`
