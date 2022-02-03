import styled from 'styled-components'
import { Row } from 'antd'

export const StyledFormDoubleItem = styled(Row)`
  .dropdown-item {
    .ant-form-item-label {
      margin-bottom: ${({ theme }) => theme.margin(2)};
    }
  }
  .ant-form-item {
    margin-bottom: ${({ theme }) => theme.margin(1)};
  }
  .hint {
    font-size: 9px;
    color: ${({ theme }) => theme.hintInputColor};
    text-align: left;
    margin-top: 7px;
  }
  .ant-form-item-label {
    padding-bottom: 0;
    label {
      font-size: 17px;
      font-weight: 600;
      color: ${({ theme }) => theme.text8};
      line-height: 1;
    }
    .ant-form-item-optional {
      color: #8a8a8a;
      font-size: 12px;
    }
  }
  .ant-form-item-control-input-content {
    padding: 0 ${({ theme }) => theme.margin(2)};
    margin: 0 -${({ theme }) => theme.margin(2)};
  }
  .ant-form-item-control-input {
    position: relative;
    input {
      border: none;
      border-radius: 0;
      border-bottom: 2px solid #a8a8a8;
      color: ${({ theme }) => theme.text8};
      font-size: 12px;
      padding-left: 0;
      text-align: left;
      &:focus {
        box-shadow: none;
      }
    }
    .unit {
      position: absolute;
      font-family: Montserrat;
      font-size: 15px;
      font-weight: 800;
      color: #a8a8a8;
      right: ${({ theme }) => theme.margin(4)};
    }
    .ant-picker {
      width: 195px;
      height: 41px;
      border-radius: 41px;
      margin-top: ${({ theme }) => theme.margin(2)};
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
`
