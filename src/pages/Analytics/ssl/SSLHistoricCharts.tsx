/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'antd'
import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import _ from 'lodash'

const PAGE_WRAPPER = styled.div`
  height: 100%;
  width: 100%;
  padding: 0px 20px 0px 20px;
  .tokenSelector {
    display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
    justify-content: center;
    height: 100px;
    .individualToken {
      font-size: 16px;
      margin: 10px;
      width: 80px;
      height: 30px;
    }
    .individualToken.active {
      width: 100px;
      height: 50px;
      font-size: 20px;
      color: #9966ff;
    }
  }
  .labelRow {
    text-align: center;
    font-size: 28px;
    border: 1px solid white;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .chartRow {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0px -50px 20px -50px;
  }
  .chartColumn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    padding: 0px;
  }
`

const SSLHistoricCharts: FC<{ chartData: any; loading: boolean }> = ({ chartData, loading }) => {
  const [tokens, setTokens] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(null)
  const [tokenData, setTokenData] = useState({ primary: [], secondary: [] })

  const options = {
    title: {
      text: 'Pool value'
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
        text: 'Liquidity'
      }
    },
    series: [
      {
        //type: 'column',
        data: null,
        name: 'Total Trading Volume'
      }
    ]
  }

  const processData = () => {
    const currentTokenData = chartData[activeIndex]
    const primary = [],
      secondary = []
    for (let i = 0; i < currentTokenData.length; i++) {
      primary.push({
        price: currentTokenData[i].price,
        y: Number(currentTokenData[i].amount),
        mintName: currentTokenData[i].mintName,
        x: currentTokenData[i].time,
        uiTime: currentTokenData[i].uiTime
      })
      for (let j = 0; j < currentTokenData[i].secondaryBalances.length; j++) {
        const dataToAdd = {
          price: currentTokenData[i].secondaryBalances[j].price,
          y: Number(currentTokenData[i].secondaryBalances[j].amount),
          mintName: currentTokenData[i].secondaryBalances[j].mintName,
          time: currentTokenData[i].time,
          uiTime: currentTokenData[i].uiTime
        }
        if (!secondary[j]) secondary.push([dataToAdd])
        else secondary[j].push(dataToAdd)
      }
    }
    console.log('secondary: ', secondary)
    //console.log(currentTokenData)
    setTokenData({
      primary,
      secondary
    })
  }

  useEffect(() => {
    if (chartData && chartData.length) {
      const tempTokens = []
      chartData.map((item) => {
        tempTokens.push(item[0].mintName)
      })
      setTokens(tempTokens)
      setActiveIndex(0)
    }
  }, [chartData])

  useEffect(() => {
    if (chartData[activeIndex]) {
      processData()
    } else {
      setTokenData({ primary: [], secondary: [] })
    }
  }, [activeIndex])

  const primaryOptionsAmount = useMemo(() => {
    if (tokenData.primary && tokenData.primary.length) {
      const x = _.cloneDeep(options)
      x.series[0]['data'] = tokenData.primary
      x.series[0]['name'] = tokenData.primary[0].mintName
      x['title']['text'] = tokenData.primary[0].mintName + ' Liquidity amount'
      return x
    } else return options
  }, [tokenData.primary])

  const primaryOptionsValue = useMemo(() => {
    if (tokenData.primary && tokenData.primary.length) {
      const x = _.cloneDeep(options)
      const processedData = tokenData.primary.map((item) => {
        return {
          ...item,
          y: item.y * item.price
        }
      })
      x.series[0]['data'] = processedData
      x.series[0]['name'] = '$ value of ' + tokenData.primary[0].mintName
      x['title']['text'] = tokenData.primary[0].mintName + ' Liquidity value'
      return x
    } else return options
  }, [tokenData.primary])

  const secondaryOptions = (index: number, amount: boolean) => {
    if (
      tokenData.secondary &&
      tokenData.secondary.length &&
      tokenData.secondary[index] &&
      tokenData.secondary[index].length
    ) {
      const x = _.cloneDeep(options)
      if (amount) {
        x.series[0]['data'] = tokenData.secondary[index]
        x.series[0]['name'] = tokenData.secondary[index][0].mintName
        x['title']['text'] = tokenData.secondary[index][0].mintName + ' Liquidity amount'
        return x
      } else {
        const processedData = tokenData.secondary[index].map((item) => {
          return {
            ...item,
            y: item.y * item.price
          }
        })
        x.series[0]['data'] = processedData
        x.series[0]['name'] = '$ value of ' + tokenData.secondary[index][0].mintName
        x['title']['text'] = tokenData.secondary[index][0].mintName + ' Liquidity value'
        return x
      }
    } else return options
  }
  return (
    <PAGE_WRAPPER>
      <div className="tokenSelector">
        {'Select '}
        {tokens.map((item, index) => {
          return (
            <Button
              key={index.toString()}
              className={'individualToken ' + (activeIndex === index ? 'active' : '')}
              onClick={() => {
                setActiveIndex(index)
              }}
            >
              {item}
            </Button>
          )
        })}
      </div>
      <div className="labelRow">
        {'Primary Pool: ' + (tokenData.primary[0] ? tokenData.primary[0].mintName : '')}
      </div>
      <div className="chartRow">
        <div className="chartColumn">
          <HighchartsReact highcharts={Highcharts} options={primaryOptionsAmount} />
        </div>
        <div className="chartColumn">
          <HighchartsReact highcharts={Highcharts} options={primaryOptionsValue} />
        </div>
      </div>
      <div className="labelRow">Secondary Balances</div>
      {tokenData.secondary.map((item, index) => {
        return (
          <div className="chartRow" key={index.toString()}>
            <div className="chartColumn">
              <HighchartsReact highcharts={Highcharts} options={secondaryOptions(index, true)} />
            </div>
            <div className="chartColumn">
              <HighchartsReact highcharts={Highcharts} options={secondaryOptions(index, false)} />
            </div>
          </div>
        )
      })}
    </PAGE_WRAPPER>
  )
}
export default SSLHistoricCharts
