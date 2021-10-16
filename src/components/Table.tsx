import { Table, Tag, Space } from 'antd'
import { FC, ReactElement } from 'react'
import { BlockTail } from './BlockTail'

const { Column, ColumnGroup } = Table

const data = [
  {
    key: '1',
    market: (
      <BlockTail
        image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`}
        imageHeight={'22px'}
        imageWidth={'22px'}
        text={<span style={{ marginLeft: 15, fontSize: 13 }}>gUSD</span>}
        backgroundColor={''}
        width={''}
        justifyItems={''}
      />
    ),
    currentPrice: '$142.83',
    averagePrice: '$142.83',
    amount: '42.383',
    profitLoss: '+$2,555.22',
    debt: '$2,690.34'
  },
  {
    key: '2',
    market: (
      <BlockTail
        image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`}
        imageHeight={'22px'}
        imageWidth={'22px'}
        text={<span style={{ marginLeft: 15, fontSize: 13 }}>gUSD</span>}
        backgroundColor={''}
        width={''}
        justifyItems={''}
      />
    ),
    currentPrice: '$142.83',
    averagePrice: '$142.83',
    amount: '42.383',
    profitLoss: '+$2,555.22',
    debt: '$2,690.34'
  },
  {
    key: '3',
    market: (
      <BlockTail
        image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`}
        imageHeight={'22px'}
        imageWidth={'22px'}
        text={<span style={{ marginLeft: 15, fontSize: 13 }}>gUSD</span>}
        backgroundColor={''}
        width={''}
        justifyItems={''}
      />
    ),
    currentPrice: '$142.83',
    averagePrice: '$142.83',
    amount: '42.383',
    profitLoss: '+$2,555.22',
    debt: '$2,690.34'
  },
  {
    key: '4',
    market: (
      <BlockTail
        image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`}
        imageHeight={'22px'}
        imageWidth={'22px'}
        text={<span style={{ marginLeft: 15, fontSize: 13 }}>gUSD</span>}
        backgroundColor={''}
        width={''}
        justifyItems={''}
      />
    ),
    currentPrice: '$142.83',
    averagePrice: '$142.83',
    amount: '42.383',
    profitLoss: '+$2,555.22',
    debt: '$2,690.34'
  },
  {
    key: '5',
    market: (
      <BlockTail
        image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`}
        imageHeight={'22px'}
        imageWidth={'22px'}
        text={<span style={{ marginLeft: 15, fontSize: 13 }}>gUSD</span>}
        backgroundColor={''}
        width={''}
        justifyItems={''}
      />
    ),
    currentPrice: '$142.83',
    averagePrice: '$142.83',
    amount: '42.383',
    profitLoss: '+$2,555.22',
    debt: '$2,690.34'
  },
  {
    key: '6',
    market: (
      <BlockTail
        image={`${process.env.PUBLIC_URL}/img/synths/GOFX.svg`}
        imageHeight={'22px'}
        imageWidth={'22px'}
        text={<span style={{ marginLeft: 15, fontSize: 13 }}>gUSD</span>}
        backgroundColor={''}
        width={''}
        justifyItems={''}
      />
    ),
    currentPrice: '$142.83',
    averagePrice: '$142.83',
    amount: '42.383',
    profitLoss: '+$2,555.22',
    debt: '$2,690.34'
  }
]

export const TableData: FC = () => {
  return (
    <Table
      dataSource={data}
      pagination={false}
      bordered={false}
      style={{ width: '100%', padding: 0, margin: 0, backgroundColor: 'transparent' }}
    >
      <Column dataIndex="market" key="1" align="left" width={100} />
      <Column dataIndex="currentPrice" key="2" align="center" width={100} />
      <Column dataIndex="averagePrice" key="3" align="right" width={100} />
      <Column dataIndex="amount" key="4" align="right" width={100} />
      <Column dataIndex="profitLoss" key="5" align="right" width={80} />
      <Column dataIndex="debt" key="6" align="right" width={30} />
    </Table>
  )
}
