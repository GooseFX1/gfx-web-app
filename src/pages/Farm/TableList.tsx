import React, { useState } from 'react'
import { mockData } from './mockData'
import styled, { css } from 'styled-components'
import { Table } from 'antd'
import { columns } from './Columns'
import { ExpandedContent } from './ExpandedContent'

const STYLED_TABLE_LIST = styled(Table)`
  ${({ theme }) => `
  max-width: 99%;
  .ant-table {
    background-color: #2a2a2a;
  }
  .normal-text {
    font-family: Montserrat;
    font-size: 17px;
    font-weight: 600;
    text-align: center;
    color: #fff;
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    border-bottom-left-radius: 30px;
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-bottom-right-radius: 30px;
  }
  .ant-table-thead {
    background-color: #181818;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    box-shadow: 0px 8px 6px -3px rgb(0 0 0 / 30%);
    > tr {
      > th {
        border: none;
        font-size: 16px;
        font-weight: 700;
        color: ${theme.text1};
        background-color: transparent;
        padding-top: 0;
        padding-bottom: ${theme.margins['2x']};
        &:before {
          content: none !important;
        }
      }
    }
  }
  .ant-table-tbody {
    > tr {
      &:first-child {
        td {
          background-color: transparent;
        }
      }
      &.ant-table-expanded-row {
        > td {
          padding: 0;
          border-bottom: 0;
        }
      }
      > td {
        background-color: ${theme.bg3};
        border-color: #8c8c8c;
        padding-bottom: ${theme.margins['4x']};
      }
      &:last-child {
        td {
          border-bottom: none;
        }
      }
      &.ant-table-row:hover {
        > td {
          background-color: ${theme.bg6} !important;
        }
      }
    }
  }

  .expanded-active {
    cursor: pointer;
    transform: rotate(180deg);
  }
`}
`

const STYLED_EXPAND_ICON = styled.img<{ expanded: boolean }>`
  ${({ expanded }) => css`
    cursor: pointer;
    transform: ${expanded ? 'rotate(180deg)' : 'rotate(0)'};
  `}
`

const ExpandIcon = (props) => {
  const { expanded, record, onClick } = props
  return (
    <STYLED_EXPAND_ICON
      expanded={expanded}
      src={`${process.env.PUBLIC_URL}/img/assets/arrow-down-large.svg`}
      onClick={() => onClick(record.id)}
      alt=""
    />
  )
}

export const TableList = () => {
  const [eKeys, setEKeys] = useState([])
  const onExpandIcon = (id) => {
    const temp = [...eKeys]
    const j = temp.indexOf(id)
    if (j > -1) temp.splice(j, 1)
    else temp.push(id)
    setEKeys(temp)
  }
  return (
    <STYLED_TABLE_LIST
      rowKey="id"
      columns={columns}
      dataSource={mockData}
      pagination={false}
      bordered={false}
      expandedRowKeys={eKeys}
      expandedRowRender={(r) => <ExpandedContent record={r} />}
      expandIcon={(ps) => <ExpandIcon {...ps} onClick={onExpandIcon} />}
      expandIconColumnIndex={6}
    />
  )
}
