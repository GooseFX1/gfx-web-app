import React, { FC, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { UDFCompatibleDatafeed } from './udf-compatible-datafeed'
import { widget, ChartingLibraryWidgetOptions, IChartingLibraryWidget, ResolutionString } from '../../../charting_library'
import { useDarkMode } from '../../../context'

const CONTAINER = styled.div`
  width: 80vw;
  height: 66vh;
`

export const TVChartContainer: FC<{
  interval: string
  symbol: string
}> = ({ interval = 'D' as ResolutionString, symbol = 'BTC/USDC' }) => {
  const { mode } = useDarkMode()
  const tvWidget = useRef<IChartingLibraryWidget | null>()

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      autosize: true,
      charts_storage_api_version: '1.1',
      charts_storage_url: 'https://saveload.tradingview.com',
      client_id: 'tradingview.com',
      container: 'tv_chart_container',
      datafeed: new UDFCompatibleDatafeed('https://serum-api.bonfida.com/tv'),
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      fullscreen: false,
      interval: interval as ChartingLibraryWidgetOptions['interval'],
      library_path: '/charting_library/',
      locale: 'en',
      studies_overrides: {},
      symbol,
      theme: mode === 'dark' ? 'Dark' : 'Light',
      user_id: 'public_user_id'
    }

    tvWidget.current = new widget(widgetOptions)

    tvWidget.current.onChartReady(() => {
      tvWidget.current!.headerReady().then(() => {
        const button = tvWidget.current!.createButton()
        button.setAttribute('title', 'Click to show a notification popup')
        button.classList.add('apply-common-tooltip')
        button.addEventListener('click', () => tvWidget.current!.showNoticeDialog({
          title: 'Notification',
          body: 'TradingView Charting Library API works correctly',
          callback: () => {}
        }))
        button.innerHTML = 'Check API'
      })
    })

    return () => {
      if (tvWidget.current) {
        tvWidget.current.remove()
        tvWidget.current = null
      }
    }
  }, [interval, mode, symbol])

  return <CONTAINER id="tv_chart_container" />
}
