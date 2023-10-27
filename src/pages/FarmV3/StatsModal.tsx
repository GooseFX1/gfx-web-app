import { FC, Dispatch, SetStateAction, useState, useEffect, useMemo } from 'react'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'
import tw, { styled } from 'twin.macro'
import { checkMobile } from '../../utils'
import 'styled-components/macro'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { SSLToken } from './constants'
import axios from 'axios'
import _ from 'lodash'
import { Tooltip } from 'antd'
import { RotatingLoader } from '../../components/RotatingLoader'
import { useDarkMode } from '../../context'

const STYLED_POPUP = styled(PopupCustom)<{
  currentSlide: number
  userAnswer: any
}>`
  .ant-modal-content {
    ${tw`h-full dark:bg-black-2 bg-white rounded-bigger`}
  }
  .ant-modal-close-x {
    > img {
      ${tw`sm:!h-4 sm:!w-4 absolute bottom-2 opacity-60`}
    }
  }
  .ant-modal-body {
    ${tw`p-5 sm:p-[15px]`}
    .historical {
      ${tw`dark:text-grey-5 text-black-4 underline font-semibold text-lg mr-8`}
      text-decoration-thickness: 1px;
    }
    .highcharts-background {
      ${tw`dark:fill-[#1c1c1c] fill-[#fff]`}
    }
    .highcharts-grid-line {
      ${tw`dark:stroke-[#3C3C3C] stroke-[#CACACA]`}
    }
    .highcharts-legend-item,
    .highcharts-credits,
    .highcharts-markers.highcharts-tracker,
    .highcharts-xaxis {
      ${tw`hidden`}
    }
    .highcharts-container {
      ${tw`!h-[380px]`}
    }
  }
`

const WRAPPER = styled.div``

export const StatsModal: FC<{
  token: SSLToken
  statsModal: boolean
  setStatsModal: Dispatch<SetStateAction<boolean>>
}> = ({ token, statsModal, setStatsModal }) => {
  const [rangeIndex, setRangeIndex] = useState<number>(0)
  const [data, setData] = useState([])
  const [chartData, setChartData] = useState([])
  const [gofxChartData, setGofxChartData] = useState([])
  const { mode } = useDarkMode()
  const range = ['7D']

  const options = {
    title: {
      text: ''
    },
    chart: {
      type: 'area'
    },
    xAxis: {
      type: 'datetime',
      labels: {
        rotation: -90,
        format: '{value:%d/%m/%y}',
        style: {
          fontSize: '11px',
          fontFamily: 'Poppins, Monserrat, sans-serif',
          color: '#B5B5B5',
          fontWeight: 500
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      },
      labels: {
        style: {
          fontSize: '11px',
          fontFamily: 'Poppins, Monserrat, sans-serif',
          color: '#B5B5B5',
          fontWeight: 500
        }
      }
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineWidth: 2
      }
    },
    series: [
      {
        data: null,
        fillColor: 'rgba(214, 56, 227, 0.3)',
        lineColor: '#D638E3'
      },
      {
        data: null,
        fillColor: 'rgba(88, 85, 255, 0.3)',
        lineColor: '#5855FF'
      }
    ]
  }

  const getSSLCharts = async () => {
    //const url = SSL_CHARTS + token
    const res = await axios.get(`http://localhost:4000/ssl-apis/charts/prices/${token?.token}`)
    if (res.status === 200) {
      setData(res.data.data)
    } else {
      return []
    }
  }

  const processData = () => {
    const charts = []
    const gofxCharts = []
    for (let i = data.length - 1; i >= 0; i--) {
      charts.push({
        x: data[i].time,
        y: Number(data[i].price),
        mintName: data[i].mintName,
        uiTime: data[i].uiTime
      })
      gofxCharts.push({
        x: data[i].time,
        y: Number(data[i].price * 2.5),
        mintName: data[i].mintName,
        uiTime: data[i].uiTime
      })
    }
    setChartData(charts)
    setGofxChartData(gofxCharts)
  }

  const updatedOptions = useMemo(() => {
    if (chartData && chartData.length && gofxChartData && gofxChartData.length) {
      const x = _.cloneDeep(options)
      x.series[0]['data'] = gofxChartData
      x.series[1]['data'] = chartData
      return x
    } else return options
  }, [chartData])

  useEffect(() => {
    getSSLCharts()
  }, [])

  useEffect(() => {
    processData()
  }, [data])

  return (
    <STYLED_POPUP
      height={checkMobile() ? '363px' : '500px'}
      width={checkMobile() ? '95%' : '750px'}
      title={null}
      centered={true}
      visible={statsModal ? true : false}
      onCancel={() => setStatsModal(false)}
      footer={null}
    >
      <WRAPPER>
        <div tw="flex flex-row items-center">
          <Tooltip
            color={mode === 'dark' ? '#EEEEEE' : '#131313'}
            title={
              <span tw="dark:text-grey-1 text-grey-2 font-semibold text-tiny">
                This chart shows the historical performance of deposits in our SSL pools vs simply holding the
                asset.
              </span>
            }
            placement="topLeft"
            overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
            overlayInnerStyle={{ borderRadius: '5px', width: '400px' }}
          >
            <div className="historical">Historical Performance</div>
          </Tooltip>
          <div tw="h-5 w-5 rounded-circle bg-[#D638E3] mr-2"></div>
          <div tw="dark:text-grey-5 text-grey-1 text-regular font-semibold mr-2.5">GooseFX</div>
          <div tw="h-5 w-5 rounded-circle bg-blue-1 mr-2"></div>
          <div tw="dark:text-grey-5 text-grey-1 text-regular font-semibold">Hold</div>
        </div>
        <div tw="flex flex-row mt-2.5">
          {range.map((item, index) => (
            <div
              key={item}
              onClick={() => setRangeIndex(index)}
              css={[
                tw`h-[30px] w-[70px] cursor-pointer flex flex-row items-center justify-center rounded-[36px] mb-6`,
                index === rangeIndex && tw`bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2`
              ]}
            >
              <span
                css={[
                  tw`text-regular font-semibold dark:text-grey-2 text-grey-1`,
                  index === rangeIndex && tw`!text-grey-5`
                ]}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
        <div>
          {chartData && chartData.length && gofxChartData && gofxChartData.length ? (
            <HighchartsReact highcharts={Highcharts} options={updatedOptions} />
          ) : (
            <div tw="mt-20">
              <RotatingLoader textSize={50} iconSize={50} iconColor={'#B5B5B5'} />
            </div>
          )}
        </div>
      </WRAPPER>
    </STYLED_POPUP>
  )
}
