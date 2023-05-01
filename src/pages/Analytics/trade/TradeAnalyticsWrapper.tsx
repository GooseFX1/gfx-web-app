/* eslint-disable prefer-const */
import { useWallet } from '@solana/wallet-adapter-react'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { isAdminAllowed } from '../../../api/NFTLaunchpad'
import { useNavCollapse } from '../../../context'
import { Connect } from '../../../layouts'
import { GradientText } from '../../NFTs/adminPage/components/UpcomingMints'
import { httpClient } from '../../../api'
import { GET_ANALYTICS_DATA } from '../../TradeV3/perps/perpsConstants'
import { Table, Tooltip } from 'antd'
//import AnalyticsDashboard from './AnalyticsDashboard'

const CONNECT_WALLET_WRAPPER = styled.div`
  ${tw`w-full flex-col flex items-center justify-center`}
  height: 90vh;
  .gooseLogo {
    ${tw`w-28 h-28`}
  }
  .first-line {
    ${tw`mt-8 font-semibold text-3xl	`}
    color: ${({ theme }) => theme.text7};
  }
  .connectWallet {
    margin-top: 25px;
    transform: scale(1.3);
  }
`
const WRAPPER = styled.div`
  ${tw`flex justify-center mt-4 items-center flex-col h-screen`}
  .first-line {
    ${tw`mt-8 font-semibold text-3xl	`}
    color: ${({ theme }) => theme.text7};
  }
  .gfxLogo {
    ${tw`w-28 h-28`}
  }
  .second-line {
    ${tw`text-lg mt-6 font-medium	w-96 text-center`}
    color: ${({ theme }) => theme.text4};
  }
`
const TABLE_WRAPPER = styled.div`
  ${tw`h-full w-full`}
  .publicKey {
    ${tw`cursor-pointer`}
  }
`

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
  {
    title: 'Updated Time',
    dataIndex: 'lastUpdatedTime',
    key: 'lastUpdatedTime'
  },
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

export const TradeAnalyticsWrapper: FC = () => {
  const { wallet, connected } = useWallet()
  const { toggleCollapse } = useNavCollapse()
  const [adminAllowed, setAdminAllowed] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tableData, setTableData] = useState<any[]>(null)
  const [numberOfTraders, setNumberOfTraders] = useState<number>(0)
  const [processedData, setProcessedData] = useState(null)

  const getAnalyticsData = async () => {
    const res = await httpClient('api-services').get(`${GET_ANALYTICS_DATA}`)
    if (res.status === 200) {
      console.log(res)
      setTableData(res.data.traderData)
    } else {
      setNumberOfTraders(0)
      setTableData(null)
    }
  }

  const truncateAddress = (walletAddress) => {
    const formatted =
      walletAddress.slice(0, 4) + '...' + walletAddress.slice(walletAddress.length - 5, walletAddress.length - 1)
    return {
      formatted: formatted,
      original: walletAddress
    }
  }
  const processData = () => {
    const dataSource = []
    tableData.map((item, index) => {
      const processedTime = new Date(item.lastUpdatedTime).toString()
      let processedHealth = '100'
      console.log('health is: ', item.health)
      if (item.health === null) {
        processedHealth = 'N/A'
      } else if (item.health !== '100') {
        const tempHealth = 100 + Number(item.health)
        if (!Number.isNaN(tempHealth)) processedHealth = tempHealth.toString()
        else processedHealth = 'N/A'
      }
      console.log('processed health: ', processedHealth)
      dataSource.push({
        key: index.toString(),
        walletAddress: item.walletAddress,
        traderAddress: item.trader,
        volume: Number(item.volume).toFixed(2),
        lastUpdatedTime: processedTime,
        health: processedHealth,
        liquidationPrice: item.liquidationPrice,
        unrealisedPnl: item.unrealisedPnl,
        potfolioValue: item.potfolioValue,
        totalWithdrawn: item.totalWithdrawn,
        totalDeposited: item.totalDeposited
      })
    })
    setProcessedData(dataSource)
  }

  useEffect(() => {
    if (tableData && tableData.length) processData()
  }, [tableData])

  useEffect(() => {
    toggleCollapse(true)
    ;(async () => {
      if (wallet?.adapter?.publicKey) {
        const data = await isAdminAllowed(wallet?.adapter?.publicKey.toString())
        setAdminAllowed(data.allowed)
      }
    })()
  }, [wallet?.adapter?.publicKey])

  useEffect(() => {
    if (adminAllowed) getAnalyticsData()
    else setTableData(null)
  }, [adminAllowed])

  return !connected ? (
    <CONNECT_WALLET_WRAPPER>
      <img className="gooseLogo" src="/img/assets/GOFX-icon.svg" alt="Goose" />
      <div className="first-line">Welcome to NFT Analytics page!</div>
      <div className="connectWallet">
        <Connect />
      </div>
    </CONNECT_WALLET_WRAPPER>
  ) : !adminAllowed ? (
    <WRAPPER>
      <img className="gfxLogo" src="/img/assets/GOFX-icon.svg" alt="Launchpad Logo" />
      <div className="first-line">Ups, wallet not supported!</div>
      <div className="second-line">
        Please contact <GradientText text={'contact@goosefx.io'} fontSize={18} fontWeight={500} /> or try again.
      </div>
    </WRAPPER>
  ) : (
    <TABLE_WRAPPER>
      <div>No of traders: </div>
      <div>{numberOfTraders}</div>
      <Table dataSource={processedData}>
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
          />
        ))}
      </Table>
    </TABLE_WRAPPER>
  )
}
