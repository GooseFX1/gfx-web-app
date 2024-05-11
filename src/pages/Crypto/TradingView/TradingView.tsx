import React, { FC, useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as saveLoadAdapter from './save-load-adapter'
import { convertResolutionToApi, DataFeedWrapper } from './Datafeed'
import { widget, ChartingLibraryWidgetOptions, IChartingLibraryWidget } from '@/tv_charting_lib/charting_library'
import { useCrypto, useDarkMode } from '../../../context'
import { flatten } from '../../../utils'

const CONTAINER = styled.div<{ $visible: boolean }>`
  width: 100%;
  height: 100%;
  max-height: ${({ $visible }) => ($visible ? '600px' : '0')};
  opacity: ${({ $visible }) => ($visible ? '1' : '0')};
  transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;
`

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol']
  interval: ChartingLibraryWidgetOptions['interval'] | string
  auto_save_delay: ChartingLibraryWidgetOptions['auto_save_delay']
  datafeedUrl?: string
  libraryPath: ChartingLibraryWidgetOptions['library_path']
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
  clientId: ChartingLibraryWidgetOptions['client_id']
  userId: ChartingLibraryWidgetOptions['user_id']
  fullscreen: ChartingLibraryWidgetOptions['fullscreen']
  autosize: ChartingLibraryWidgetOptions['autosize']
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
  containerId: string
  theme?: string
  timeframe: ChartingLibraryWidgetOptions['timeframe']
}

export const TVChartContainer: FC<{ visible: boolean }> = ({ visible }) => {
  const { selectedCrypto } = useCrypto()
  const symbol = selectedCrypto.pair
  const { mode } = useDarkMode()
  const datafeed = DataFeedWrapper()
  let resolution = window.localStorage.getItem('resolution') ?? '60'
  try {
    convertResolutionToApi(resolution)
  } catch (e) {
    resolution = '5'
  }

  const defaultProps: ChartContainerProps = {
    symbol: symbol,
    interval: resolution ? resolution : '5',
    auto_save_delay: 5,
    containerId: 'tv_chart_container',
    libraryPath: 'src/tv_charting_lib/charting_library/',
    //libraryPath: '../../../tv_charting_lib/charting_library',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    timeframe: '1D'
  }

  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null)
  const chartProperties = JSON.parse(localStorage.getItem('chartproperties') || '{}')

  useEffect(() => {
    const savedProperties = flatten(chartProperties, {
      restrictTo: ['scalesProperties', 'tradingProperties']
    })

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol,
      interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
      autosize: defaultProps.autosize,
      auto_save_delay: 5,
      container: defaultProps.containerId as ChartingLibraryWidgetOptions['container'],
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      load_last_chart: true,
      datafeed: datafeed,
      disabled_features: [
        'use_localstorage_for_settings',
        'volume_force_overlay',
        'left_toolbar',
        'show_symbol_logos', // 'show_logo_on_all_charts',
        //'caption_buttons_text_if_possible',
        'header_settings',
        'header_compare',
        'show_symbol_logo_for_compare_studies', //'compare_symbol',
        'header_screenshot',
        'header_widget', // 'header_widget_dom_node',
        'header_saveload',
        'header_undo_redo',
        'show_interval_dialog_on_key_press',
        'header_symbol_search'
      ],
      enabled_features: ['study_templates'],
      fullscreen: defaultProps.fullscreen,
      library_path: defaultProps.libraryPath as string,
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
          'chart.favoriteDrawingsPosition':
            localStorage.getItem('chart.favoriteDrawingsPosition') || JSON.stringify({})
        },
        setValue: (key, value) => {
          localStorage.setItem(key, value)
        },
        removeValue: (key) => {
          localStorage.removeItem(key)
        }
      },
      studies_overrides: defaultProps.studiesOverrides
      //theme: mode === 'dark' ? 'dark' : 'light'
    }

    const tvWidget = new widget(widgetOptions)

    tvWidget.onChartReady(() => {
      tvWidgetRef.current = tvWidget
      tvWidget.subscribe('onAutoSaveNeeded', () => tvWidget.saveChartToServer())
    })
  }, [
    mode,
    symbol,
    chartProperties,
    datafeed,
    defaultProps.autosize,
    defaultProps.clientId,
    defaultProps.containerId,
    defaultProps.fullscreen,
    defaultProps.interval,
    defaultProps.libraryPath,
    defaultProps.studiesOverrides,
    defaultProps.theme,
    defaultProps.userId
  ])

  return <CONTAINER id={defaultProps.containerId} $visible={visible} />
}
