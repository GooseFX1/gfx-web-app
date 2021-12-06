import styled from 'styled-components'
import { Row } from 'antd'

export const StyledFormDoubleItem = styled(Row)`
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
  .ant-form-item-control-input-content {
    padding: 0 ${({ theme }) => theme.margins['2x']};
    margin: 0 -${({ theme }) => theme.margins['2x']};
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
`
