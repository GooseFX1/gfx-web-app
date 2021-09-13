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
import { Market, MARKETS } from '@project-serum/serum'
import { PublicKey } from '@solana/web3.js'
import { useConnectionConfig } from './settings'
import { ISwapToken } from './swap'
import { computePoolsPDAs } from '../web3'
import { notify } from '../utils'
import moment from 'moment'

interface IRates {
  inValue: number
  outValue: number
  outValueForSwap: number
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
  const { connection, network } = useConnectionConfig()
  const [fetching, setFetching] = useState(false)
  const [rates, setRates] = useState<IRates>({
    inValue: 0,
    outValue: 0,
    outValueForSwap: 0,
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
        try {
          const time = moment().format('MMMM DD, h:mm a')
          const inValue = await getValueFromSerum(inToken.symbol)
          setRates(({ outValue, outValuePerIn, outValueForSwap }) => ({
            inValue,
            outValue,
            outValueForSwap,
            outValuePerIn,
            time
          }))
        } catch (e) {
          // notify({ icon: 'rate_error', message: e.message, type: 'error' })
        }
      }

      if (outToken) {
        try {
          const time = moment().format('MMMM DD, h:mm a')
          const outValue = await getValueFromSerum(outToken.symbol)
          setRates(({ inValue, outValuePerIn, outValueForSwap }) => ({
            inValue,
            outValue,
            outValueForSwap,
            outValuePerIn,
            time
          }))
        } catch (e) {
          // notify({ icon: 'rate_error', message: e.message, type: 'error' })
        }
      }

      if (inToken && outToken) {
        try {
          const time = moment().format('MMMM DD, h:mm a')
          const { pool } = await computePoolsPDAs(inToken.symbol, outToken.symbol, network)
          const [aAccount, bAccount] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(inToken.address) }),
            connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(outToken.address) })
          ])

          const a = parseFloat(aAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          const b = parseFloat(bAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          const { toSwapAmount: aIn } = inToken
          const outValueForSwap = aIn > 0 ? b - (a * b) / (a + aIn) : 0
          const outValuePerIn = b - (a * b) / (a + 10 ** inToken.decimals)

          setRates(({ inValue, outValue }) => ({ inValue, outValue, outValueForSwap, outValuePerIn, time }))
        } catch (e) {
          notify({ icon: 'rate_error', message: 'Pool not found', type: 'error' })
        }
      }

      setFetching(false)
    }, timeoutDelay)
  }, [connection, network, ratesToFetch])

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
