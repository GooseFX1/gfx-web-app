/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Table } from 'antd'
import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Spin } from 'antd'

const COLUMN = [
  {
    title: 'token',
    dataIndex: 'mintName',
    key: 'mintName'
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: 'Value',
    dataIndex: 'usdValue',
    key: 'usdValue'
  },
  {
    title: 'Ratio',
    dataIndex: 'ratio',
    key: 'ratio'
  }
]

const TABLE_WRAPPER = styled.div`
  .tableContainer {
    padding: 50px 100px 10px 100px;
    .poolName {
      text-align: center;
      font-size: 24px;
      margin-bottom: 20px;
    }
  }
`

const PAGE_WRAPPER = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  .ant-spin {
    font-size: 48px;
  }
`

const SSLAnalyticsTableWrapper: FC<{ liveBalances: any; refreshData: any; loading: boolean }> = ({
  liveBalances,
  refreshData,
  loading
}) => {
  console.log(liveBalances)

  const getValue = (amount: string, price: number) => {
    const numAm = Number(amount)
    if (Number.isNaN(numAm)) return null
    return (numAm * price).toFixed(3)
  }

  const getRatio = (main: string, secondary: string) => {
    const mainNum = Number(main)
    if (Number.isNaN(mainNum)) return null
    const secondaryNum = Number(secondary)
    if (Number.isNaN(secondaryNum)) return null
    return (secondaryNum / mainNum).toFixed(3)
  }
  return (
    <PAGE_WRAPPER>
      <TABLE_WRAPPER>
        {!loading ? (
          <div>
            <div>
              <Button onClick={() => refreshData()}>Reload data</Button>
            </div>
            {liveBalances.map((item, index) => {
              const dsItem = []
              const valuePrimary = getValue(item.amount, item.price)
              dsItem.push({
                mintName: item.mintName,
                amount: item.amount,
                price: item.price,
                usdValue: valuePrimary,
                ratio: 1
              })
              for (let i = 0; i < item.secondaryBalances.length; i++) {
                const sb = item.secondaryBalances[i]
                const valueSecondary = getValue(sb.amount, sb.price)
                dsItem.push({
                  mintName: sb.mintName,
                  amount: sb.amount,
                  price: sb.price,
                  usdValue: valueSecondary,
                  ratio: getRatio(valuePrimary, valueSecondary)
                })
              }
              return (
                <div key={item.mintName} className="tableContainer">
                  <div className="poolName">{'POOL: ' + item.mintName}</div>
                  <Table dataSource={dsItem} columns={COLUMN} pagination={false} />
                </div>
              )
            })}
          </div>
        ) : (
          <Spin size="large" />
        )}
      </TABLE_WRAPPER>
    </PAGE_WRAPPER>
  )
}

export default SSLAnalyticsTableWrapper
