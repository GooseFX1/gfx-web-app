import styled from 'styled-components'
import { Table } from 'antd'

export const StyledTableList = styled(Table)`
  ${({ theme }) => `
  .item {
    display: flex;
    align-items: center;
    
    width: 100%;
    .image {
      width: 30px;
      height: 30px;
      ${theme.smallBorderRadius}
    }
    .text {
      font-size: 12px;
      font-weight: 500;
      color: ${theme.text1};
      padding-left: ${theme.margin(1)};
    }
  }

  .price-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .image {
      width: 24px;
      height: 24px;
    }
    .price {
      color: ${theme.text1};
      font-size: 14px;
      font-weight: 600;
      padding-left: ${theme.margin(1)};
    }
  }
  .from,
  .to {
    font-size: 15px;
    font-weight: 600;
    color: #9a4ef6;
    text-align: center;
  }

  .text-normal {
    font-size: 15px;
    font-weight: 500;
    color: ${theme.text1};
  }

  .ant-table-container{
   @media(max-width: 500px){
    overflow-x: scroll;
   }
  }

  .ant-table-thead {
    > tr {
      > th {
        border: none;
        font-size: 16px;
        font-weight: 700;
        color: ${theme.text1};
        background-color: ${theme.bg3};
        text-align: center;
        &:before {
          content: none !important;
        }
      }
    }
  }
  .ant-table-tbody {
    > tr {
      > td {
        background-color: ${theme.bg3};
        border: none;
        color: ${theme.text1};
        text-align: center;
      }
      &.ant-table-row:hover {
        > td {
          background-color: ${theme.bg6};
        }
      }
    }
  }
`}
`
