import React, { FC, useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as saveLoadAdapter from './save-load-adapter'
import { widget, ChartingLibraryWidgetOptions, IChartingLibraryWidget } from '../../../charting_library'
import { useDarkMode } from '../../../context'
import { flatten } from '../../../utils'

const CONTAINER = styled.div<{ $visible: boolean }>`
  width: 100%;
  height: 600px;
  max-height: ${({ $visible }) => ($visible ? '600px' : '0')};
  opacity: ${({ $visible }) => ($visible ? '1' : '0')};
  transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;
`

export const TVChartContainer: FC<{
  interval: string
  symbol: string
  visible: boolean
}> = ({ interval, symbol, visible }) => {
  const { mode } = useDarkMode()
  const tvWidget = useRef<IChartingLibraryWidget | null>()

  useEffect(() => {
    const chartProperties = JSON.parse(localStorage.getItem('chartproperties') || '{}')
    const savedProperties = flatten(chartProperties, {
      restrictTo: ['scalesProperties', 'tradingProperties']
    })

    const widgetOptions: ChartingLibraryWidgetOptions = {
      autosize: true,
      client_id: 'tradingview.com',
      container: 'tv_chart_container',
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      fullscreen: false,
      interval: interval as ChartingLibraryWidgetOptions['interval'],
      library_path: '/charting_library/',
      locale: 'en',
      overrides: {
        ...savedProperties,
        'mainSeriesProperties.candleStyle.upColor': '#41C77A',
        'mainSeriesProperties.candleStyle.downColor': '#F23B69',
        'mainSeriesProperties.candleStyle.borderUpColor': '#41C77A',
        'mainSeriesProperties.candleStyle.borderDownColor': '#F23B69',
        'mainSeriesProperties.candleStyle.wickUpColor': '#41C77A',
        'mainSeriesProperties.candleStyle.wickDownColor': '#F23B69'
      },
      // @ts-ignore
      save_load_adapter: saveLoadAdapter,
      settings_adapter: {
        initialSettings: {
          'trading.orderPanelSettingsBroker': JSON.stringify({
            showRelativePriceControl: false,
            showCurrencyRiskInQty: false,
            showPercentRiskInQty: false,
            showBracketsInCurrency: false,
            showBracketsInPercent: false
          }),
          // "proterty"
          'trading.chart.proterty':
            localStorage.getItem('trading.chart.proterty') ||
            JSON.stringify({
              hideFloatingPanel: 1
            }),
          'chart.favoriteDrawings': localStorage.getItem('chart.favoriteDrawings') || JSON.stringify([]),
          'chart.favoriteDrawingsPosition': localStorage.getItem('chart.favoriteDrawingsPosition') || JSON.stringify({})
        },
        setValue: (key, value) => {
          localStorage.setItem(key, value)
        },
        removeValue: (key) => {
          localStorage.removeItem(key)
        }
      },
      studies_overrides: {},
      symbol: 'AAPL',
      theme: mode === 'dark' ? 'Dark' : 'Light',
      user_id: 'public_user_id'
    }

    tvWidget.current = new widget(widgetOptions)

    tvWidget.current.onChartReady(() => {
      tvWidget.current!.headerReady().then(() => {
        const button = tvWidget.current!.createButton()
        button.setAttribute('title', 'Click to show a notification popup')
        button.classList.add('apply-common-tooltip')
        button.addEventListener('click', () =>
          tvWidget.current!.showNoticeDialog({
            title: 'Notification',
            body: 'TradingView Charting Library API works correctly',
            callback: () => {}
          })
        )
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

  return <CONTAINER id="tv_chart_container" $visible={visible} />
}
