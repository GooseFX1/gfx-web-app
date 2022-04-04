import React, { useState, useMemo, useEffect } from 'react'
import { Program, Provider } from '@project-serum/anchor'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import styled, { css } from 'styled-components'
import { Table } from 'antd'
import { columns } from './Columns'
import { ExpandedContent } from './ExpandedContent'
import { getStakingAccountKey, fetchCurrentAmountStaked, CONTROLLER_KEY, CONTROLLER_LAYOUT } from '../../web3'
import { useConnectionConfig, usePriceFeed } from '../../context'
import { ADDRESSES } from '../../web3/ids'
const StakeIDL = require('../../web3/idl/stake.json')

//#region styles
const STYLED_TABLE_LIST = styled(Table)`
  ${({ theme }) => `
  max-width: 100%;
  .ant-table {
    background: ${theme.bg3};
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: ${theme.tableListBoxShadow};
  }
  .normal-text {
    font-family: Montserrat;
    font-size: 17px;
    font-weight: 600;
    text-align: center;
    color: ${theme.text8};
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 30px;
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 30px;
  }
  .ant-table-thead {
    background-color: #181818;
    background: ${theme.farmHeaderBg};
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    box-shadow: ${theme.tableHeaderBoxShadow};
    > tr {
      > th {
        border: none;
        font-size: 16px;
        font-weight: 700;
        color: ${theme.text1};
        background-color: transparent;
        padding-top: 0;
        padding-bottom: ${theme.margin(2)};
        &:before {
          content: none !important;
        }
      }
    }
  }
  .ant-table-tbody {
    > tr {
      &.ant-table-expanded-row {
        > td {
          padding: 0;
          border-bottom: 0;
        }
      }
      > td {
        background-color: ${theme.bg3};
        border-color: #8c8c8c;
        padding-bottom: ${theme.margin(4)};
      }
      &:last-child {
        td {
          border: none;
          &:first-child {
            border-bottom-left-radius: 20px;
          }
          &:last-child {
            border-bottom-right-radius: 20px;
          }
        }
      }
      &.ant-table-row:hover {
        > td {
          background-color: ${theme.hoverTrFarmBg} !important;
        }
      }
    }
  }

  .ant-pagination-item {
    a {
      display: inline;
      color: ${theme.text6};
    }

    &:hover{
      a {
        color: ${theme.text6};
      }
    }

    &:hover{
      border-color: ${theme.text6};
    }
  }

  .ant-pagination-item-active {
    border-color: transparent;
    a {
      color: ${theme.text6};
    }

    &:hover {
      border-color: ${theme.grey1};
    }
  }

  .ant-pagination-item-link {
    color: ${theme.text6};

    &:hover {
      border-color: ${theme.text6};
      color: ${theme.text6};
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
    filter: ${({ theme }) => theme.filterDownIcon};
  `}
`

interface IFarmData {
  id: string
  image: string
  name: string
  earned: number
  apr: number
  rewards: string
  liquidity: number
  type: string
  currentlyStaked: number
}
//#endregion

export const TableList = ({ dataSource }: any) => {
  const { prices } = usePriceFeed()
  const { network, connection } = useConnectionConfig()
  const wallet = useWallet()
  const [accountKey, setAccountKey] = useState<PublicKey>()
  const [farmData, setFarmData] = useState<IFarmData[]>([
    {
      id: '1',
      image: 'GOFX',
      name: 'GOFX',
      earned: 0,
      apr: 0,
      rewards: '100% GOFX',
      liquidity: 0,
      type: 'Single Sided',
      currentlyStaked: 0
    }
  ])
  const [eKeys, setEKeys] = useState([])
  const PAGE_SIZE = 10

  const gofxPrice = useMemo(() => prices['GOFX/USDC'], [prices])

  const stakeProgram: Program = useMemo(() => {
    return wallet.publicKey
      ? new Program(
          StakeIDL,
          ADDRESSES[network].programs.stake.address,
          new Provider(connection, wallet as WalletContextState, { commitment: 'finalized' })
        )
      : undefined
  }, [connection, wallet.publicKey])

  useEffect(() => {
    if (wallet.publicKey) {
      if (accountKey === undefined) {
        getStakingAccountKey(wallet).then((accountKey) => setAccountKey(accountKey))
      }
    } else {
      setAccountKey(undefined)
    }

    return () => {}
  }, [wallet.publicKey, connection])

  useEffect(() => {
    if (gofxPrice !== undefined) {
      fetchTableData(accountKey).then((farmData) => {
        if (farmData.length > 0) {
          setFarmData(farmData)
        }
      })
    }
  }, [accountKey, gofxPrice])

  const fetchTableData = async (accountKey: PublicKey) => {
    // pool data
    const { data: controllerData } = await connection.getAccountInfo(CONTROLLER_KEY)
    const { staking_balance, daily_reward } = await CONTROLLER_LAYOUT.decode(controllerData)
    const liqidity: number = staking_balance.toNumber() / LAMPORTS_PER_SOL
    const APR: number = (1 / liqidity) * (daily_reward.toNumber() / LAMPORTS_PER_SOL) * 365

    // user account data
    const accountData = await fetchCurrentAmountStaked(connection, accountKey, wallet)

    return [
      {
        id: '1',
        image: 'GOFX',
        name: 'GOFX',
        earned: accountData.tokenEarned ? accountData.tokenEarned : 0,
        apr: APR,
        rewards: '100% GOFX',
        liquidity: gofxPrice.current * liqidity,
        type: 'Single Sided',
        currentlyStaked: accountData.tokenStaked ? accountData.tokenStaked : 0
      }
    ]
  }

  const onExpandIcon = (id) => {
    const temp = [...eKeys]
    const j = temp.indexOf(id)
    if (j > -1) temp.splice(j, 1)
    else temp.push(id)
    setEKeys(temp)
  }

  return (
    <div>
      <STYLED_TABLE_LIST
        rowKey="id"
        columns={columns}
        dataSource={farmData}
        pagination={{ pageSize: PAGE_SIZE, position: ['bottomLeft'] }}
        bordered={false}
        expandedRowKeys={eKeys}
        expandedRowRender={(rowData) => (
          <ExpandedContent rowData={rowData} stakeProgram={stakeProgram} stakeAccountKey={accountKey} />
        )}
        expandIcon={(ps) => <ExpandIcon {...ps} onClick={onExpandIcon} />}
        expandIconColumnIndex={6}
      />
    </div>
  )
}

const ExpandIcon = (props) => {
  const { expanded, record, onClick } = props
  return (
    <STYLED_EXPAND_ICON
      expanded={expanded}
      src={`/img/assets/arrow-down-large.svg`}
      onClick={() => onClick(record.id)}
      alt=""
    />
  )
}
