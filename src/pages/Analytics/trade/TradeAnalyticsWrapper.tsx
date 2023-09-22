import { useWallet } from '@solana/wallet-adapter-react'
import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { isAdminAllowed } from '../../../api/NFTLaunchpad'
import { Connect } from '../../../layouts'
import { GradientText } from '../../../components'
import { httpClient } from '../../../api'
import { GET_ANALYTICS_DATA } from '../../TradeV3/perps/perpsConstants'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { TradeAnalyticsData } from './TradeAnalyticsTable'

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
const DATA_WRAPPER = styled.div`
  ${tw`h-full w-full p-5`}
  .publicKey {
    ${tw`cursor-pointer`}
  }
`

const TradeAnalyticsWrapper: FC = () => {
  const { wallet, connected } = useWallet()
  const [adminAllowed, setAdminAllowed] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tableData, setTableData] = useState<any[]>(null)
  const [numberOfTraders, setNumberOfTraders] = useState<number>(0)
  const [processedData, setProcessedData] = useState(null)
  const [mostRecent, setMostRecent] = useState<number>(null) //time of most recent data point
  const [volumeData, setVolumeData] = useState([])
  const [volumeSeries, setVolumeSeries] = useState(null)

  const options = useMemo(
    () => ({
      title: {
        text: 'Total Trading Volume'
      },
      chart: {
        type: 'spline'
      },
      xAxis: {
        type: 'datetime',
        labels: {
          rotation: -20,
          style: {
            fontSize: '8px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Volume (in Dollars)'
        }
      },
      series: [
        {
          //type: 'column',
          data: volumeSeries,
          name: 'Total Trading Volume'
        }
      ]
    }),
    [volumeSeries]
  )

  const getAnalyticsData = async () => {
    const res = await httpClient('api-services').get(`${GET_ANALYTICS_DATA}`)
    if (res.status === 200) {
      setTableData(res.data.traderData)
      setNumberOfTraders(res.data.totalTraders)
      setVolumeData(res.data.volumeData)
    } else {
      setNumberOfTraders(0)
      setTableData(null)
    }
  }

  const processData = () => {
    const dataSource = []
    let recent = null
    tableData.map((item, index) => {
      //const processedTime =

      if (item.lastUpdatedTime > recent) recent = item.lastUpdatedTime
      let processedHealth = 100
      if (item.health === null) {
        processedHealth = null
      } else if (item.health !== '100') {
        const tempHealth = 100 + Number(Number(item.health).toFixed(2))
        if (!Number.isNaN(tempHealth)) processedHealth = tempHealth
        else processedHealth = null
      } else if (item.health === '100') processedHealth = 100

      let liquidationPrice = item.liquidationPrice
      if (liquidationPrice === '0.00') liquidationPrice = null
      else if (Number.isNaN(+liquidationPrice)) liquidationPrice = null
      else liquidationPrice = Number(Number(liquidationPrice).toFixed(2))

      let unrealisedPnl = item.unrealisedPnl
      if (unrealisedPnl === '0.00') unrealisedPnl = null
      else if (Number.isNaN(+unrealisedPnl)) unrealisedPnl = null
      else unrealisedPnl = Number(Number(unrealisedPnl).toFixed(2))

      let potfolioValue = item.potfolioValue
      if (potfolioValue === '0.00') potfolioValue = null
      else if (Number.isNaN(+potfolioValue)) potfolioValue = null
      else potfolioValue = Number(Number(potfolioValue).toFixed(2))

      let totalDeposited = item.totalDeposited
      if (totalDeposited === '0.00') totalDeposited = null
      else if (Number.isNaN(+totalDeposited)) totalDeposited = null
      else totalDeposited = Number(Number(totalDeposited).toFixed(2))

      let totalWithdrawn = item.totalWithdrawn
      if (totalWithdrawn === '0.00') totalWithdrawn = null
      else if (Number.isNaN(+totalWithdrawn)) totalWithdrawn = null
      else totalWithdrawn = Number(Number(totalWithdrawn).toFixed(2))

      let volume = item.volume
      if (volume === '0.00') volume = null
      else if (Number.isNaN(+volume)) volume = null
      else volume = Number(Number(volume).toFixed(2))

      dataSource.push({
        key: index.toString(),
        walletAddress: item.walletAddress,
        traderAddress: item.trader,
        volume: volume,
        //lastUpdatedTime: processedTime,
        health: processedHealth,
        liquidationPrice: liquidationPrice,
        unrealisedPnl: unrealisedPnl,
        potfolioValue: potfolioValue,
        totalWithdrawn: totalWithdrawn,
        totalDeposited: totalDeposited
      })
    })
    setProcessedData(dataSource)
    setMostRecent(recent)
    const volumeSource = []
    const sortedData = volumeData.sort((a, b) => a.lastUpdatedTime - b.lastUpdatedTime)
    sortedData.map((item) => {
      volumeSource.push([item.lastUpdatedTime, item.totalVolume])
    })
    setVolumeSeries(volumeSource)
  }

  useEffect(() => {
    if (tableData && tableData.length && volumeData && volumeData.length) processData()
  }, [tableData, volumeData])

  useEffect(() => {
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
      <img className="gooseLogo" src="/img/crypto/GOFX.svg" alt="Goose" />
      <div className="first-line">Welcome to NFT Analytics page!</div>
      <div className="connectWallet">
        <Connect />
      </div>
    </CONNECT_WALLET_WRAPPER>
  ) : !adminAllowed ? (
    <WRAPPER>
      <img className="gfxLogo" src="/img/crypto/GOFX.svg" alt="Launchpad Logo" />
      <div className="first-line">Ups, wallet not supported!</div>
      <div className="second-line">
        Please contact <GradientText text={'contact@goosefx.io'} fontSize={18} fontWeight={500} /> or try again.
      </div>
    </WRAPPER>
  ) : (
    <DATA_WRAPPER>
      <div>No of traders: {numberOfTraders}</div>
      <div>Time last updated: {new Date(mostRecent).toString()}</div>
      <TradeAnalyticsData processedData={processedData} />
      <HighchartsReact highcharts={Highcharts} options={options} />
    </DATA_WRAPPER>
  )
}
export default TradeAnalyticsWrapper
