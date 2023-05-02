import { Input, Table, Tooltip } from 'antd'
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'

const WRAPPER = styled.div`
  ${tw`h-full w-full py-5`}
  .ant-input {
    ${tw`w-1/6 my-5`}
  }
`

export const TradeAnalyticsData: FC<{ processedData: any }> = ({ processedData }) => {
  const [searchInput, setSearchInput] = useState(null)
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    if (!searchInput || searchInput === '') setFilteredData(processedData)
  }, [processedData, searchInput])

  const columns = [
    {
      title: 'Wallet',
      dataIndex: 'walletAddress',
      key: 'walletAddress'
    },
    {
      title: 'Trader Address',
      dataIndex: 'traderAddress',
      key: 'traderAddress'
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume'
    },
    // {
    //   title: 'Updated Time',
    //   dataIndex: 'lastUpdatedTime',
    //   key: 'lastUpdatedTime'
    // },
    {
      title: 'Health',
      dataIndex: 'health',
      key: 'health'
    },

    {
      title: 'Liq. Price',
      dataIndex: 'liquidationPrice',
      key: 'liquidationPrice'
    },
    {
      title: 'Unreliazed PNL',
      dataIndex: 'unrealisedPnl',
      key: 'unrealisedPnl'
    },
    {
      title: 'Portfolio Value',
      dataIndex: 'potfolioValue',
      key: 'potfolioValue'
    },
    {
      title: 'Total Deposited',
      dataIndex: 'totalDeposited',
      key: 'totalDeposited'
    },
    {
      title: 'Total Withdrawn',
      dataIndex: 'totalWithdrawn',
      key: 'totalWithdrawn'
    }
  ]

  const truncateAddress = (walletAddress) => {
    const formatted =
      walletAddress.slice(0, 4) + '...' + walletAddress.slice(walletAddress.length - 5, walletAddress.length - 1)
    return {
      formatted: formatted,
      original: walletAddress
    }
  }

  const handleChange = (e) => {
    const input = e.target.value.toLowerCase()
    setSearchInput(input)
    const dataToSet = processedData.filter((item) => {
      if (item.walletAddress.toLowerCase().includes(input) || item.traderAddress.toLowerCase().includes(input))
        return item
    })
    setFilteredData(dataToSet)
  }

  return (
    <WRAPPER>
      <Input value={searchInput} onChange={(e) => handleChange(e)} placeholder="Search Wallet/Trader Address" />
      <Table dataSource={filteredData}>
        {columns.map((item, index) => (
          <Table.Column
            title={item.title}
            key={item.key}
            dataIndex={item.dataIndex}
            render={(item) => {
              if (index == 0 || index === 1)
                return (
                  <Tooltip title={item}>
                    <span
                      className="publicKey"
                      onClick={() => {
                        navigator.clipboard.writeText(item)
                      }}
                    >
                      {truncateAddress(item).formatted}
                    </span>
                  </Tooltip>
                )
              return <span>{item}</span>
            }}
            sorter={(a: number, b: number) => a[columns[index].key] - b[columns[index].key]}
            sortDirections={['descend', 'ascend']}
          />
        ))}
      </Table>
    </WRAPPER>
  )
}
