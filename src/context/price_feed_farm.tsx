import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { getFarmTokenPrices } from '../api/SSL'
import { Program, Provider } from '@project-serum/anchor'
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { getStakingAccountKey, SSL_PROGRAM_ID, GAMMA_PROGRAM_ID } from '../web3'
import { useConnectionConfig } from './settings'
import { PublicKey } from '@solana/web3.js'
import sslJson from '../pages/FarmV3/idl/sslv2.json'
import GammaJson from '../pages/FarmV4/idl/gamma.json'
import { useWalletBalance } from '@/context/walletBalanceContext'

interface IPrices {
  [x: string]: {
    current: number
  }
}
interface IChange {
  [x: string]: {
    change?: string
    volume?: string
    range?: {
      min: string
      max: string
    }
  }
}
interface IStats {
  tvl: number
  volume7dSum: number
  totalVolumeTrade?: number
}
interface IPriceFeedConfig {
  prices: IPrices
  tokenInfo?: IChange
  refreshTokenData: () => void
  priceFetched: boolean
  statsData: IStats
  setStatsData: Dispatch<IStats>
  stakeProgram: Program
  SSLProgram: Program
  stakeAccountKey: PublicKey
  solPrice: number
  GammaProgram: Program | undefined
}

const PriceFeedFarmContext = createContext<IPriceFeedConfig | null>(null)

export const PriceFeedFarmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<IPrices>({})
  const [priceFetched, setPriceFetched] = useState<boolean>(false)
  const [statsData, setStatsData] = useState<IStats | null>()
  const [stakeAccountKey, setAccountKey] = useState<PublicKey>()
  const wal = useWallet()
  const [solPrice, setSolPrice] = useState<number>(0)
  const { publicKey } = useWalletBalance()
  const { connection, network } = useConnectionConfig()
  const stakeProgram: Program = useMemo(
    () =>
     publicKey
        ? new Program(
            sslJson as any,
            SSL_PROGRAM_ID,
            new Provider(connection, wal as WalletContextState, { commitment: 'finalized' })
          )
        : undefined,
    [connection, publicKey, network]
  )
  useEffect(() => {
    if (publicKey) {
      if (stakeAccountKey === undefined) {
        getStakingAccountKey(wal, network).then((accountKey) => setAccountKey(accountKey))
      }
    } else {
      setAccountKey(undefined)
    }

    return null
  }, [publicKey, connection])

  const SSLProgram: Program = useMemo(
    () =>
      new Program(
        sslJson as any,
        SSL_PROGRAM_ID,
        new Provider(connection, wal as WalletContextState, { commitment: 'finalized' })
      ),
    [connection]
  )

  const GammaProgram: Program | undefined = useMemo(
    () =>
      new Program(
        GammaJson as any,
        GAMMA_PROGRAM_ID,
        new Provider(connection, wal as WalletContextState, { commitment: 'finalized' })
      ),
    [connection]
  )

  console.log("GammaProgram", GammaProgram, SSLProgram)

  const refreshTokenData = useCallback(async () => {
    ;(async () => {
      const { data } = await getFarmTokenPrices()
      if (data !== undefined && data !== null) {
        setPrices(data)
      }

      setPriceFetched(true)
    })()
  }, [])

  useEffect(() => {
    if (prices['SOL/USDC']) {
      setSolPrice(prices['SOL/USDC'].current)
    }
  }, [prices])

  return (
    <PriceFeedFarmContext.Provider
      value={{
        prices,
        refreshTokenData,
        priceFetched,
        statsData,
        setStatsData,
        stakeProgram,
        SSLProgram,
        stakeAccountKey,
        solPrice,
        GammaProgram
      }}
    >
      {children}
    </PriceFeedFarmContext.Provider>
  )
}

export const usePriceFeedFarm = (): IPriceFeedConfig => {
  const context = useContext(PriceFeedFarmContext)
  if (!context) {
    throw new Error('Missing crypto context')
  }

  return context
}
