import { useState, useEffect, FC } from 'react'
import { Table, Row, Col } from 'antd'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import styled, { css } from 'styled-components'
import { useNFTDetails } from '../../../context'
import { truncateAddress } from '../../../utils'
import tw from 'twin.macro'

const TRADING_HISTORY_TAB_CONTENT = styled.div`
  ${({ theme }) => css`
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    color: ${theme.text2};
    font-size: 11px;
    font-weight: 500;

    .thtc-not-found {
      ${tw`sm:text-center`}
      width: 100%;
      height: 100%;
      padding: ${theme.margin(0.5)} ${theme.margin(1.5)};
      display: grid;
      place-items: center;
      font-size: 14px;
    }

    .price-value,
    .thtc-align-right,
    .thtc-event {
      color: ${theme.text7};
    }

    .thtc-event-epx {
      color: #ff6464;
    }

    .thtc-solana-logo {
      width: 15px;
      height: 15px;
    }

    .thtc-from-to {
      font-weight: 600;
      color: #9a4ef6;
    }

    .thtc-align-right {
      text-align: right;
    }

    .ant-table {
      font-size: 11px;
      font-weight: 500;
      background-color: transparent;

      .ant-table-tbody > tr.ant-table-row > * {
        &:hover {
          background: transparent !important;
        }
      }

      .ant-table-thead > tr > th {
        font-weight: 700;
        color: ${theme.text1};
        padding: ${theme.margin(1)};
        background-color: transparent;
        border-bottom: 1px solid ${theme.bg2};
      }

      .ant-table-tbody > tr > td {
        border-bottom: none;
        padding: ${theme.margin(1)};
      }
    }
  `}
`

const bidColumns = [
  {
    key: 'event',
    dataIndex: 'event',
    title: 'Event',
    render: (val: string) => <div className="thtc-event">{val == 'ask' ? 'ASK' : 'BID'}</div>,
    width: '19%'
  },
  {
    key: 'buyer_price',
    dataIndex: 'buyer_price',
    title: 'Price',
    render: (value: string) => (
      <Row gutter={5} align="middle">
        <Col>
          <img className="thtc-solana-logo" src={`/img/assets/solana-logo.png`} alt="" />
        </Col>
        <Col className="price-value">{parseFloat(value) / LAMPORTS_PER_SOL}</Col>
      </Row>
    ),
    width: '23%'
  },
  {
    key: 'wallet_key',
    dataIndex: 'wallet_key',
    title: 'From',
    render: (value: string) => <div className="thtc-from-to">{truncateAddress(value)}</div>,
    width: '19%'
  },
  {
    key: 'token_account_mint_key',
    dataIndex: 'token_account_mint_key',
    title: 'To',
    render: (value: string) => <div className="thtc-from-to">{truncateAddress(value)}</div>,
    width: '19%'
  },
  {
    key: 'clock',
    dataIndex: 'clock',
    title: <div className="thtc-align-right">Date</div>,
    render: (value: string) => (
      <div className="thtc-align-right">{new Date(parseInt(value)).toLocaleDateString('en-US')}</div>
    ),
    width: '20%'
  }
]

export const TradingHistoryTabContent: FC = ({ ...rest }) => {
  const { bids } = useNFTDetails()
  const [tradingHistory, setTradingHistory] = useState([])

  useEffect(() => {
    setTradingHistory(bids.map((bid) => ({ ...bid, event: 'bid' })))
  }, [bids])

  return (
    <TRADING_HISTORY_TAB_CONTENT {...rest}>
      {tradingHistory.length === 0 ? (
        <div className="thtc-not-found">
          <p>Open Bids</p>
          <p>No bids so far, be the first to bid for this amazing piece.</p>
        </div>
      ) : (
        <Table
          columns={bidColumns}
          dataSource={bids.map((bid) => ({ ...bid, key: bid.bid_id }))}
          pagination={false}
        />
      )}
    </TRADING_HISTORY_TAB_CONTENT>
  )
}
