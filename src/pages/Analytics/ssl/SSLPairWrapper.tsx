/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useMemo, useState } from 'react'
import { MINTS, PAIRS } from './utils'
import { ANALYTICS_BASE } from '../../../api/analytics'
import { GET_SSL_JUPITER } from '../../TradeV3/perps/perpsConstants'
import axios from 'axios'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { AlertOutlined, CheckCircleOutlined } from '@ant-design/icons'
import _ from 'lodash'
import styled from 'styled-components'
import { Button, Spin } from 'antd'

const WRAPPER = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  .ant-spin {
    font-size: 48px;
  }
  .chartWrapper {
    margin: 50px 100px 150px 100px;
  }
  .reloadWrapper {
    margin-bottom: 20px;
  }
  .latestWrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .individualLatest {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .pairName {
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
`

const options = {
  title: {
    text: 'Jupiter Uptime'
  },
  chart: {
    type: 'spline'
    //marginLeft: '0px',
    //marginRight: '0px',
    //marginTop: '0px',
    //marginBottom: '0px'
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
      text: 'is Active?'
    }
  },
  series: [
    {
      //type: 'column',
      data: null,
      name: 'Jupiter uptime history'
    }
  ]
}

const SSLPairWrapper: FC = () => {
  const [chartData, setChartData] = useState([])
  const [apiResponse, setApiResponse] = useState([])
  const [pair, setPair] = useState<string[]>([])
  const [lastStatus, setLastStatus] = useState([])
  const [loading, setLoading] = useState(false)

  const getPairData = async () => {
    const url = ANALYTICS_BASE + GET_SSL_JUPITER
    const apiData = []
    setLoading(true)
    for (let i = 0; i < PAIRS.length; i++) {
      const pair = PAIRS[i]
      const urlGet = url + pair
      const response = await axios.get(urlGet)
      apiData.push(response.data.data)
    }
    setApiResponse(apiData)
    setLoading(false)
  }

  const processData = async () => {
    const allPairData = []
    for (let i = 0; i < apiResponse.length; i++) {
      const pair = apiResponse[i]
      const pairProcessedData = []
      for (let j = 0; j < pair.length; j++) {
        const pairData = pair[j]
        pairProcessedData.push({
          x: pairData.time,
          y: pairData.active === true ? 1 : 0,
          name: pairData.name
        })
      }
      allPairData.push(pairProcessedData)
    }
    setChartData(allPairData)
  }

  const getChartOptions = (index: number) => {
    if (chartData && chartData[index] && chartData[index].length) {
      const x = _.cloneDeep(options)
      x.series[0]['data'] = chartData[index]
      x.series[0]['name'] = 'active status'
      x['title']['text'] = chartData[index][0].name + ' uptime'
      return x
    } else {
      return options
    }
  }

  const getLatestData = () => {
    const latestArray = chartData.map((item, index) => {
      return item[item.length - 1]
    })
    setLastStatus(latestArray)
  }

  useEffect(() => {
    if (apiResponse && apiResponse.length) processData()
  }, [apiResponse])

  useEffect(() => {
    if (chartData && chartData.length) getLatestData()
  }, [chartData])

  useEffect(() => {
    getPairData()
  }, [])
  return (
    <WRAPPER>
      {!loading ? (
        <>
          <div className="reloadWrapper">
            <Button onClick={() => getPairData()}>Reload data</Button>
          </div>
          <div className="latestWrapper">
            {lastStatus.map((item, index) => {
              return (
                <div key={index.toString()} className="individualLatest">
                  <div className="pairName">{item.name}</div>
                  <div>
                    {item.y === 1 ? (
                      <>
                        <CheckCircleOutlined style={{ color: 'green' }} />
                        <CheckCircleOutlined style={{ color: 'green' }} />
                        <CheckCircleOutlined style={{ color: 'green' }} />
                      </>
                    ) : (
                      <>
                        <AlertOutlined style={{ color: 'red' }} />
                        <AlertOutlined style={{ color: 'red' }} />
                        <AlertOutlined style={{ color: 'red' }} />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {chartData.map((item, index) => {
            return (
              <div key={index.toString()} className="chartWrapper">
                <HighchartsReact highcharts={Highcharts} options={getChartOptions(index)} />
              </div>
            )
          })}
        </>
      ) : (
        <Spin size="large" />
      )}
    </WRAPPER>
  )
}

export default SSLPairWrapper
