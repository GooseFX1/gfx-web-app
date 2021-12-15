import React, { useState } from 'react'
import { mockData } from './mockData'
import styled, { css } from 'styled-components'
import { Table, Button } from 'antd'
import { columns } from './Columns'

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

const STYLED_EXPANDED_CONTENT = styled.div`
  padding-top: ${({ theme }) => theme.margins['4x']};
  padding-right: ${({ theme }) => theme.margins['10x']};
  padding-bottom: ${({ theme }) => theme.margins['7x']};
  padding-left: ${({ theme }) => theme.margins['4x']};
  background-image: linear-gradient(to bottom, #39253e, rgba(42, 42, 42, 0));
  display: flex;
  align-items: center;
`

const STYLED_LEFT_CONTENT = styled.div`
  width: 23%;
  .left-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 270px;
    margin: 0 auto;
  }
  .farm-logo {
    width: 60px;
    height: 60px;
  }
  button {
    width: 169px;
    height: 52px;
    line-height: 42px;
    border-radius: 52px;
    font-family: Montserrat;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    color: #fff;
    background-color: #6b33b0 !important;
    border-color: #6b33b0 !important;
    &:hover {
      opacity: 0.8;
    }
  }
`
const STYLED_RIGHT_CONTENT = styled.div`
  width: 77%;
  display: flex;
  .right-inner {
    flex-wrap: wrap;
    max-width: 720px;
    display: flex;
    margin-right: 0;
    margin-left: auto;
  }
`
const STYLED_SOL = styled.div`
  width: 300px;
  height: 60px;
  background-color: #111;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.margins['4x']};
  margin: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2x']};
  .value {
    font-family: Montserrat;
    font-size: 22px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #b1b1b1;
  }
  .text {
    font-family: Montserrat;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    color: #b1b1b1;
    display: flex;
  }
  .text-2 {
    margin-left: ${({ theme }) => theme.margins['1.5x']};
  }
`
const STYLED_STAKE = styled.div`
  width: 300px;
  height: 51px;
  border-radius: 51px;
  background-color: #1e1e1e;
  line-height: 49px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #b1b1b1;
  margin: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2x']};
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

const ExpandedContent = () => {
  return (
    <STYLED_EXPANDED_CONTENT>
      <STYLED_LEFT_CONTENT>
        <div className="left-inner">
          <img src={`${process.env.PUBLIC_URL}/img/assets/farm-logo.svg`} alt="" />
          <Button type="primary">
            <span>Connect Wallet</span>
          </Button>
        </div>
      </STYLED_LEFT_CONTENT>
      <STYLED_RIGHT_CONTENT>
        <div className="right-inner">
          {[0, 1, 2, 3].map((item) =>
            item < 2 ? (
              <STYLED_SOL>
                <div className="value">0.00 SOL</div>
                <div className="text">
                  <div className="text-1">Half</div>
                  <div className="text-2">Max</div>
                </div>
              </STYLED_SOL>
            ) : (
              <STYLED_STAKE>{item === 2 ? 'Stake' : 'Unstake and claim'}</STYLED_STAKE>
            )
          )}
        </div>
      </STYLED_RIGHT_CONTENT>
    </STYLED_EXPANDED_CONTENT>
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
      expandedRowRender={(r) => <ExpandedContent />}
      expandIcon={(ps) => <ExpandIcon {...ps} onClick={onExpandIcon} />}
      expandIconColumnIndex={6}
    />
  )
}
