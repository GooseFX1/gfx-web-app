import { useMemo } from 'react'
import { SUPPORTED_TOKEN_LIST } from '../../../constants'
import { AVAILABLE_MARKETS, useCrypto } from '../../../context'
import { sleep, getUnixTs } from '../../../utils/misc'

const URL_SERVER = 'https://trading-view.goosefx.io/tradingview/'

export const DataFeedWrapper = (): any => {
  const { selectedCrypto, isSpot } = useCrypto()
  const dataFeed = useMemo(() => makeDataFeed(), [selectedCrypto, isSpot])
  return dataFeed
}

const makeDataFeed = () => {
  const subscriptions = {}
  const overTime = {}
  const lastReqTime = {}

  const apiFetchHandler = async (url: string) => {
    try {
      const response = await fetch(url)
      if (response.ok) {
        const responseJson = await response.json()
        return responseJson.success ? responseJson.data : responseJson ? responseJson : null
      }
    } catch (err) {
      console.log(`Error fetching from Chart API ${url}: ${err}`)
    }
    return null
  }

  return {
    onReady(callback) {
      setTimeout(
        () =>
          callback({
            supported_resolutions: [
              '5',
              '15',
              '60',
              '120',
              '240',
              '1D'
              //  '2D', '3D', '5D', '1W', '1M', '2M', '3M', '6M', '12M'
            ],
            supports_group_request: false,
            supports_marks: false,
            supports_search: false,
            supports_timescale_marks: false
          }),
        0
      )
    },

    async resolveSymbol(symbolName, onSymboleResolvedCallback, onResolveErrorCallback) {
      let fromCustomMarket = false
      let customMarket = []
      try {
        const customMarketStr = localStorage.getItem('customMarkets')
        customMarket = customMarketStr !== null ? JSON.parse(customMarketStr) : []
      } catch (e) {
        console.log('error', e)
      }
      let marketInfo = AVAILABLE_MARKETS(SUPPORTED_TOKEN_LIST).find(
        (item) => item.name === symbolName && !item.deprecated
      )

      if (!marketInfo) {
        marketInfo = customMarket.find((item) => item.name === symbolName || item.userName === symbolName)
        fromCustomMarket = true
      }

      if (!marketInfo) {
        return
      }

      const result = await apiFetchHandler(`${URL_SERVER}symbols?symbol=${marketInfo.name.toString()}`)

      if (!result) {
        onResolveErrorCallback()
        return
      }
      if (result.name !== marketInfo.name) {
        if (result.name.includes('unknown')) {
          result.name = marketInfo.name
          result.ticker = marketInfo.name
          result.description = marketInfo.name
        } else {
          if (fromCustomMarket) {
            for (let index = 0; index < customMarket.length; index++) {
              if (customMarket[index].name === symbolName) {
                customMarket[index].userName = customMarket[index].name
                customMarket[index].name = result.name
              }
            }
            localStorage.setItem('customMarkets', JSON.stringify(customMarket))
          } else {
            result.name = marketInfo.name
          }
        }
      }
      onSymboleResolvedCallback(result)
    },
    async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback) {
      //eslint-disable-next-line
      from = Math.floor(from)
      //eslint-disable-next-line
      to = Math.ceil(to)

      window.localStorage.setItem('resolution', resolution)
      //eslint-disable-next-line
      resolution = convertResolutionToApi(resolution)

      if (from < minTs(symbolInfo.out_count, resolution)) {
        onHistoryCallback([], { nodeData: false })
        return
      }
      //eslint-disable-next-line
      if (from < 1609459200) from = 1609459200

      const key = `${symbolInfo.name}--${resolution}`

      if (overTime[key] && overTime[key] > from) {
        onHistoryCallback([], { nodeData: false })
        return
      }

      try {
        const result = await apiFetchHandler(
          `${URL_SERVER}history?symbol=${symbolInfo.name}&resolution=${resolution}&from=${from}&to=${to}`
        )

        if (result.close.length === 0) {
          overTime[key] = to
        }

        onHistoryCallback(parseCandles(result), {
          nodeData: result.length === 0
        })
      } catch (err) {
        onErrorCallback(err)
      }
    },
    async subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID) {
      if (subscriptions[subscriberUID]) {
        subscriptions[subscriberUID].stop()
        delete subscriptions[subscriberUID]
      }

      let stopped = false
      subscriptions[subscriberUID] = { stop: () => (stopped = true) }

      while (!stopped) {
        await sleep(2000)
        for (let i = 0; i < 10; ++i) {
          if (document.visibilityState !== 'visible') {
            await sleep(2000)
          }
        }
        if (stopped) {
          return
        }

        try {
          const to = Math.ceil(getUnixTs())
          const from = reduceTs(to, resolution)

          const resolutionApi = convertResolutionToApi(resolution)

          if (lastReqTime[subscriberUID] && lastReqTime[subscriberUID] + 1000 * 60 > new Date().getTime()) {
            continue
          }
          lastReqTime[subscriberUID] = new Date().getTime()

          const candle = await apiFetchHandler(
            `${URL_SERVER}history?symbol=${symbolInfo.name}&resolution=${resolutionApi}&from=${from}&to=${to}`
          )

          for (const item of parseCandles(candle)) {
            onRealtimeCallback(item)
          }
          continue
        } catch (e) {
          console.warn(e)
          await sleep(10000)
          continue
        }
      }
    },
    unsubscribeBars(subscriberUID) {
      subscriptions[subscriberUID].stop()
      delete subscriptions[subscriberUID]
    },
    //eslint-disable-next-line
    async searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: Function) {
      const marketList: any[] = AVAILABLE_MARKETS(SUPPORTED_TOKEN_LIST).filter(
        (item) => item.name.includes(userInput) && !item.deprecated
      )
      const reList = []
      marketList.forEach((item) => {
        reList.push({
          symbol: item.name,
          full_name: item.name,
          description: item.name,
          exchange: 'Raydium',
          params: [],
          type: 'spot',
          ticker: item.name
        })
      })
      if (onResult) {
        onResult(reList)
      }
    }
  }
}

const minTs = (minCount: number, resolutionTv: string) => {
  const ts = getUnixTs()
  switch (resolutionTv) {
    case '1':
      return ts - 60 * 1 * minCount
    case '3':
      return ts - 60 * 3 * minCount
    case '5':
      return ts - 60 * 5 * minCount
    case '15':
      return ts - 60 * 15 * minCount
    case '30':
      return ts - 60 * 30 * minCount
    case '45':
      return ts - 60 * 45 * minCount
    case '60':
      return ts - 60 * 60 * minCount
    case '120':
      return ts - 60 * 120 * minCount
    case '240':
      return ts - 60 * 240 * minCount
    case '720':
      return ts - 60 * 720 * minCount
    case '1d':
      return ts - 3600 * 24 * minCount
    case 'D':
      return ts - 3600 * 24 * 31 * 12 * minCount
    case '2d':
      return ts - 3600 * 24 * 2 * minCount
    case '3d':
      return ts - 3600 * 24 * 3 * minCount
    case '5d':
      return ts - 3600 * 24 * 5 * minCount
    case '7d':
      return ts - 3600 * 24 * 7 * minCount
    case '1m':
      return ts - 3600 * 24 * 31 * 1 * minCount
    case '2m':
      return ts - 3600 * 24 * 31 * 2 * minCount
    case '3m':
      return ts - 3600 * 24 * 31 * 3 * minCount
    case '6m':
      return ts - 3600 * 24 * 31 * 6 * minCount
    case '1y':
      return ts - 3600 * 24 * 31 * 12 * minCount
    default:
      throw Error(`minTs resolution error: ${resolutionTv}`)
  }
}

const reduceTs = (ts: number, resolutionTv: string) => {
  switch (resolutionTv) {
    case '1':
      return ts - 60 * 1
    case '3':
      return ts - 60 * 3
    case '5':
      return ts - 60 * 5
    case '15':
      return ts - 60 * 15
    case '30':
      return ts - 60 * 30
    case '45':
      return ts - 60 * 45
    case '60':
      return ts - 60 * 60
    case '120':
      return ts - 60 * 120
    case '240':
      return ts - 60 * 240
    case '720':
      return ts - 60 * 720
    case '1D':
      return ts - 3600 * 24
    case '2D':
      return ts - 3600 * 24 * 2
    case '3D':
      return ts - 3600 * 24 * 3
    case '5D':
      return ts - 3600 * 24 * 5
    case '7D':
      return ts - 3600 * 24 * 7
    case '1M':
      return ts - 3600 * 24 * 31 * 1
    case '2M':
      return ts - 3600 * 24 * 31 * 2
    case '3M':
      return ts - 3600 * 24 * 31 * 3
    case '6M':
      return ts - 3600 * 24 * 31 * 6
    case '1Y':
      return ts - 3600 * 24 * 31 * 12
    default:
      throw Error(`reduceTs resolution error: ${resolutionTv}`)
  }
}

export const convertResolutionToApi = (resolution: string): string => {
  switch (resolution) {
    case '1':
      return '1'
    case '3':
      return '3'
    case '5':
      return '5'
    case '15':
      return '15'
    case '30':
      return '30'
    case '45':
      return '60'
    case '60':
      return '60'
    case '120':
      return '120'
    case '240':
      return '240'
    case '720':
      return '720'
    case '1D':
      return 'D'
    case '2D':
      return 'D'
    case '3D':
      return 'D'
    case '5D':
      return 'D'
    case '7D':
      return 'D'
    case '1M':
      return 'D'
    case '2M':
      return 'D'
    case '3M':
      return 'D'
    case '6M':
      return 'D'
    case '1Y':
      return 'D'
    default:
      throw Error(`convertResolutionToApi resolution error: ${resolution}`)
  }
}

interface rawCandles {
  s: string
  close: Array<number>
  open: Array<number>
  low: Array<number>
  high: Array<number>
  time: Array<number>
  volume: Array<number>
}

interface bar {
  time: number
  close: number
  open: number
  low: number
  high: number
  volume: number
}

const parseCandles = (candles: rawCandles) => {
  const result: Array<bar> = []
  for (let i = 0; i < candles.time.length; i++) {
    result.push({
      time: candles.time[i] * 1000,
      close: candles.close[i],
      open: candles.open[i],
      high: candles.high[i],
      low: candles.low[i],
      volume: candles.volume[i]
    })
  }
  return result
}
