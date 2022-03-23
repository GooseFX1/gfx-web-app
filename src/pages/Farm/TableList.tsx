import React, { useState, useMemo, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Table } from 'antd'
import { columns } from './Columns'
import { useWallet } from '@solana/wallet-adapter-react'
import { ExpandedContent } from './ExpandedContent'
import { Program, Provider, workspace } from '@project-serum/anchor'
import { useConnectionConfig } from '../../context'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { STAKE_PREFIX, toPublicKey } from '../../web3'
import { ADDRESSES, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from '../../web3/ids'
import { getStakingAccountKey } from '../../web3/stake'

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
const StakeIDL = require('../../web3/idl/stake.json')
const CONTROLLER_KEY = new PublicKey('8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ')

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
const getStakeProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(
    StakeIDL,
    ADDRESSES[network].programs.stake.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
  )
// const getStakingAccountKey = async (wallet: WalletContextState) => {
//   // option to connect a wallet
//   if(wallet.publicKey === null)
//     return undefined
//   const stakingAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
//     [Buffer.from(STAKE_PREFIX), CONTROLLER_KEY.toBuffer(), wallet.publicKey.toBuffer()],
//     toPublicKey(StakeIDL.metadata.address)
//   )
//   return stakingAccountKey[0]
// }

export const TableList = ({ dataSource }: any) => {
  const PAGE_SIZE = 10
  const { network, connection } = useConnectionConfig()
  const accountKey = useRef(null)
  const wallet = useWallet()
  const program = useMemo(
    () => (wallet.publicKey ? getStakeProgram(wallet, connection, network) : undefined),
    [connection, wallet.publicKey]
  )

  const stakingAccountKey = useMemo(async () => {
    if (wallet.publicKey === null) {
      return undefined
    }
    const AccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(STAKE_PREFIX), CONTROLLER_KEY.toBuffer(), wallet.publicKey.toBuffer()],
      toPublicKey(StakeIDL.metadata.address)
    )
    return AccountKey[0]
  }, [wallet.publicKey])

  const accKey = useMemo(async () => await getStakingAccountKey(wallet), [])
  accKey.then((res) => {
    accountKey.current = res
    console.log(accountKey.current, res, 'then')
  })
  console.log(accountKey.current, 'useRef')

  const [eKeys, setEKeys] = useState([])

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
        dataSource={dataSource}
        pagination={{ pageSize: PAGE_SIZE, position: ['bottomLeft'] }}
        bordered={false}
        expandedRowKeys={eKeys}
        expandedRowRender={(r) => <ExpandedContent record={r} myData={'Shrihari'} />}
        expandIcon={(ps) => <ExpandIcon {...ps} onClick={onExpandIcon} />}
        expandIconColumnIndex={6}
      />
    </div>
  )
}
