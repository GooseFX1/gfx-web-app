import React from 'react'
import { mockData } from './mockData'
import { StyledTableList } from './TableList.styled'

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

export const TableList = () => (
  <StyledTableList columns={columns} dataSource={mockData} pagination={false} bordered={false} />
)
