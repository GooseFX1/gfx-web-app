import React from 'react'
import styled from 'styled-components'
import { Table } from 'antd'
import { mockData } from './mockData'

const TABLE = styled(Table)`
  .item {
    display: flex;
    align-items: center;
    .image {
      width: 30px;
      height: 30px;
      border-radius: 5px;
    }
    .text {
      font-size: 12px;
      font-weight: 500;
      color: #fff;
      padding-left: 10px;
    }
  }

  .price-wrap {
    display: flex;
    align-items: center;
    .image {
      width: 24px;
      height: 24px;
    }
    .price {
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding-left: 7px;
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
    color: #fff;
  }

  .ant-table-thead {
    > tr {
      > th {
        border: none;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        background: #2a2a2a;
        &:before {
          content: none !important;
        }
      }
    }
  }
  .ant-table-tbody {
    > tr {
      > td {
        background: #2a2a2a;
        border: none;
      }
    }
  }
`
export const columns = [
  {
    title: 'Event',
    dataIndex: 'event',
    key: 'event',
    render: (text) => <span className="text-normal">{text}</span>
  },
  {
    title: 'Item',
    dataIndex: 'item',
    key: 'item',
    render: (record) => (
      <div className="item">
        <img className="image" src={`${process.env.PUBLIC_URL}/img/assets/card-1.png`} alt="" />
        <div className="text">
          <div className="text-name">{record?.name}</div>
          <div className="text-other">{record?.other}</div>
        </div>
      </div>
    )
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: '22%',
    render: (price) => (
      <div className="price-wrap">
        <img className="image" src={`${process.env.PUBLIC_URL}/img/assets/price.svg`} alt="" />
        <span className="price">{price}</span>
      </div>
    )
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (text) => <span className="text-normal">{text}</span>
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: (text) => <span className="from">{text}</span>
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
    render: (text) => <span className="from">{text}</span>
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text) => <span className="text-normal">{text}</span>
  }
]

const TableList = () => <TABLE columns={columns} dataSource={mockData} pagination={false} bordered={false} />

export default TableList
