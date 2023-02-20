import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Table } from 'antd'
import { dataSource } from '../pages/TradeV3/constants/feesConstants'
import Column from 'antd/lib/table/Column'
import moment from 'moment'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../layouts'
import { useAccounts, useDarkMode } from '../context'
import { PublicKey } from '@solana/web3.js'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  font-family: Montserrat !important;
  background-color: ${({ theme }) => theme.bg9};
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .ant-table-wrapper {
    margin-right: 0px;
    margin-top: 20px;
    width: 90%;
    .ant-table {
      background: none;
    }
    .ant-table-cell {
      background: none;
      height: 30px;

      color: ${({ theme }) => theme.text21};
      text-align: center;
    }
    .ant-table-cell-row-hover {
      background: none !important;
    }
    .ant-table-thead {
      .ant-table-cell {
        font-size: 17px;
        border-bottom: 2px solid #6c6c6c;
      }
      .ant-table-cell:first-child {
        width: 10%;
      }
    }
    .ant-table-tbody {
      .ant-table-cell {
        font-size: 22px;
        font-weight: 700;
        border: none;
      }
    }
    .srm-icon {
      width: 25px;
      height: 25px;
      margin: 0px 7px;
      position: relative;
      bottom: 2px;
    }
    .ant-table-thead
      > tr
      > th:not(:last-child):not(.ant-table-selection-column)
      :not(.ant-table-row-expand-icon-cell):not([colspan])::before {
      display: none;
    }
  }
`

const HEADER = styled.div`
  width: 100%;
  height: 120px;
  .first-row {
    display: flex;
    padding-right: 35px;
    padding-top: 30px;
    margin-left: 5%;
    margin-bottom: 10px;
    .spot-fees {
      background: linear-gradient(90deg, #f7931a 10.61%, #b332ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 25px;
    }
    .month-year {
      font-size: 20px;
      font-weight: 600;
      color: ${({ theme }) => theme.text21};
      margin-left: 5px;
    }
    div:nth-child(2) {
      margin-left: auto;
      .close-white-icon {
        height: 25px;
        width: 25px;
        cursor: pointer;
      }
    }
  }
  .second-row {
    margin-left: 5%;
    margin-bottom: 10px;
    .current-tier {
      display: flex;
      align-items: center;
      * {
        margin-left: 10px;
      }
    }
    div {
      color: ${({ theme }) => theme.text21};
      font-size: 20px;
      font-weight: 600;
    }
    .tierLevel {
      background: linear-gradient(90deg, #f7931a 10.61%, #b332ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  .third-row {
    margin-left: 5%;
    margin-bottom: 20px;
    color: #b3b3b3;
  }
`
const SERUM_MINT = new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt')

export const FeesPopup: FC<{ rewardModal?; rewardToggle?; modalType }> = ({ rewardToggle }) => {
  const { connected } = useWallet()
  const [srmTier, setSrmTier] = useState<string>('0')
  const { getUIAmountString } = useAccounts()
  const { mode } = useDarkMode()
  const getSRMBalance = async () => {
    const amount = getUIAmountString(SERUM_MINT.toBase58())
    let tier = '0'
    for (let i = 0; i < dataSource.length; i++) {
      if (+amount < dataSource[i].amount) {
        tier = dataSource[i].feeTier
        break
      }
      if (dataSource[i].amount === -1) tier = '6'
    }
    setSrmTier(tier)
  }

  useEffect(() => {
    if (connected) getSRMBalance()
  }, [connected])

  return (
    <Wrapper>
      <HEADER>
        <div className="first-row">
          <div>
            <span className="spot-fees">Spot Fees: </span>
            <span className="month-year">
              {moment().format('MMMM')} {moment().format('YYYY')}
            </span>
          </div>
          <div>
            <img
              onClick={() => rewardToggle(false)}
              className="close-white-icon"
              src={mode === 'dark' ? `/img/assets/close-white-icon.svg` : `/img/assets/close-gray-icon.svg`}
              alt=""
            />
          </div>
        </div>
        <div className="second-row">
          <div className="current-tier">
            My current tier:{' '}
            {connected ? (
              <span className="tierLevel">
                {' '}
                {dataSource[+srmTier].taker} Taker/ {dataSource[+srmTier].maker} Maker{' '}
              </span>
            ) : (
              <Connect />
            )}
          </div>
        </div>
        <div className="third-row">*Disclaimer: Spot fees for GooseFx are subject to change.</div>
      </HEADER>
      <Table dataSource={dataSource} rowSelection={null}>
        <Column dataIndex="feeTier" key="feeTier" title="Fee Tier" />
        <Column
          dataIndex="holding"
          key="holding"
          title="Holding"
          render={(value) => (
            <>
              <div>
                {value}
                <img src="/img/crypto/SRM.svg" alt="SRM" className="srm-icon" />
                SRM
              </div>
            </>
          )}
        />
        <Column dataIndex="taker" key="taker" title="Taker" />
        <Column dataIndex="maker" key="maker" title="Maker" />
      </Table>
      ;
    </Wrapper>
  )
}

export default FeesPopup
