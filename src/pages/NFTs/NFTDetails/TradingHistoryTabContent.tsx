import { Table, Row, Col } from 'antd'
import { FC } from 'react'
import styled, { css } from 'styled-components'
import { ITradingHistoryTabItemData } from '../../../types/nft_details'

const TRADING_HISTORY_TAB_CONTENT = styled.div`
  ${({ theme }) => css`
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: 11px;
    font-weight: 500;

    .thtc-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transform: translateY(-24px);
      padding: 0 ${theme.margins['1.5x']};

      .thtc-header-item {
        padding: 0 ${theme.margins['1x']};
      }
    }

    .thtc-table {
      width: 100%;
      height: 100%;
      padding: ${theme.margins['0.5x']} ${theme.margins['1.5x']};
      overflow-y: auto;
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
      background: ${theme.tradingHistoryTabContentBackground};

      thead {
        display: none;
      }

      .ant-table-tbody > tr > td {
        border-bottom: none;
        padding: ${theme.margins['1x']};
      }
    }
    .ant-table-tbody > tr.ant-table-row:hover > td {
      background: ${theme.hoverTrTableBackground};
    }
  `}
`

const columns = [
  {
    key: 'event',
    dataIndex: 'event',
    title: 'Event',
    render: (value: string) => {
      switch (value) {
        case 'offer':
          return (
            <Row align="middle" gutter={4}>
              <Col className="thtc-event">{value}</Col>
              <Col className="thtc-event-epx">(Epx)</Col>
            </Row>
          )
        default:
          return <div className="thtc-event">{value}</div>
      }
    },
    width: '19%'
  },
  {
    key: 'price',
    dataIndex: 'price',
    title: 'Price',
    render: (value: string) => (
      <Row gutter={5} align="middle">
        <Col>
          <img className="thtc-solana-logo" src={`${process.env.PUBLIC_URL}/img/assets/solana-logo.png`} alt="" />
        </Col>
        <Col className="price-value">{value}</Col>
      </Row>
    ),
    width: '23%'
  },
  {
    key: 'from',
    dataIndex: 'from',
    title: 'From',
    render: (value: string) => <div className="thtc-from-to">{value}</div>,
    width: '19%'
  },
  {
    key: 'to',
    dataIndex: 'to',
    title: 'To',
    render: (value: string) => <div className="thtc-from-to">{value}</div>,
    width: '19%'
  },
  {
    key: 'date',
    dataIndex: 'date',
    title: <div className="thtc-align-right">Date</div>,
    render: (value: string) => <div className="thtc-align-right">{value}</div>,
    width: '20%'
  }
]

export const TradingHistoryTabContent: FC<{ data: ITradingHistoryTabItemData[] }> = ({ data, ...rest }) => {
  return (
    <TRADING_HISTORY_TAB_CONTENT {...rest}>
      <Row className="thtc-header" justify="space-between" align="middle">
        {columns.map((column) => (
          <Col className="thtc-header-item" style={{ width: column.width }} key={column.key}>
            {column.title}
          </Col>
        ))}
      </Row>
      <div className="thtc-table">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </TRADING_HISTORY_TAB_CONTENT>
  )
}
