import React, {
  createContext,
  Dispatch,
  FC,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import moment from 'moment'
import { Market, MARKETS } from '@project-serum/serum'
import { useConnectionConfig } from './settings'
import { ISwapToken } from './swap'

interface IRates {
  inValue: number
  outValue: number
  outValuePerIn: number
  time: string
}

interface IRatesToFetch {
  inToken?: ISwapToken
  outToken?: ISwapToken
}

interface IRatesConfig {
  fetching: boolean
  rates: IRates
  ratesToFetch: IRatesToFetch
  refreshRates: () => void
  setRates: Dispatch<SetStateAction<IRates>>
  setRatesToFetch: Dispatch<SetStateAction<IRatesToFetch>>
}

const RatesContext = createContext<IRatesConfig | null>(null)

export const RatesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const [fetching, setFetching] = useState(false)
  const [rates, setRates] = useState<IRates>({
    inValue: 0,
    outValue: 0,
    outValuePerIn: 0,
    time: moment().format('MMMM DD, h:mm a')
  })
  const [ratesToFetch, setRatesToFetch] = useState<IRatesToFetch>({})

  let refreshTimeout: MutableRefObject<NodeJS.Timeout | undefined> = useRef()
  const timeoutDelay = 300
  const refreshRates = useCallback(() => {
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current)
    }

    setFetching(true)
    refreshTimeout.current = setTimeout(async () => {
      const { inToken, outToken } = ratesToFetch

      const getValueFromSerum = async (symbol: string) => {
        const match = MARKETS.find(({ deprecated, name }) => !deprecated && name === `${symbol}/USDC`)
        if (!match) {
          throw new Error(`Market not found: ${symbol}/USDC`)
        }

        try {
          const { address, programId } = match
          const bids = await (await Market.load(connection, address, {}, programId)).loadBids(connection)
          return bids.getL2(1)[0][0]
        } catch (e) {
          throw new Error('Error fetching exchange rate')
        }
      }

      if (inToken) {
        const time = moment().format('MMMM DD, h:mm a')

        try {
          const inValue = await getValueFromSerum(inToken.symbol)
          setRates(({ outValue, outValuePerIn }) => ({ inValue, outValue, outValuePerIn, time }))
        } catch (e) {
          setRates(({ outValue, outValuePerIn }) => ({ inValue: 0, outValue, outValuePerIn, time }))
        }
      }

      if (outToken) {
        const time = moment().format('MMMM DD, h:mm a')

        try {
          const outValue = await getValueFromSerum(outToken.symbol)
          setRates(({ inValue, outValuePerIn }) => ({ inValue, outValue, outValuePerIn, time }))
        } catch (e) {
          setRates(({ inValue, outValuePerIn }) => ({ inValue, outValue: 0, outValuePerIn, time }))
        }
      }

      setFetching(false)
    }, timeoutDelay)
  }, [connection, ratesToFetch])

  useEffect(() => refreshRates(), [ratesToFetch, refreshRates])

  return (
    <RatesContext.Provider value={{ fetching, rates, ratesToFetch, refreshRates, setRates, setRatesToFetch }}>
      {children}
    </RatesContext.Provider>
  )
}

export const useRates = (): IRatesConfig => {
  const context = useContext(RatesContext)
  if (!context) {
    throw new Error('Missing rates context')
  }

  const { fetching, rates, ratesToFetch, refreshRates, setRates, setRatesToFetch } = context
  return { fetching, rates, ratesToFetch, refreshRates, setRates, setRatesToFetch }
}
