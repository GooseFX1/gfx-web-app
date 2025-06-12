import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { getFarmTokenPrices } from '../api/SSL'
import { Program, Provider } from '@project-serum/anchor'
import { Program as coralProgram, AnchorProvider, IdlAccounts } from '@coral-xyz/anchor'
import { useWallet } from '@/hooks/useWallet'
import { getStakingAccountKey, SSL_PROGRAM_ID } from '../web3'
import { useConnectionConfig } from './settings'
import { AccountInfo, PublicKey } from '@solana/web3.js'
import sslJson from '../pages/FarmV3/idl/sslv2.json'
import GammaJson from '../pages/FarmV4/idl/gamma.json'
import { Gamma } from '../pages/FarmV4/idl/gamma.type'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { useMutation, useQuery } from '@tanstack/react-query'

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
  GammaProgram: coralProgram<Gamma>
}

export type UserRewardInfo = IdlAccounts<Gamma>['userRewardInfo']
export type RewardInfo = IdlAccounts<Gamma>['rewardInfo']
export type GammaPoolState = IdlAccounts<Gamma>['poolState']
export type GammaAmmConfig = IdlAccounts<Gamma>['ammConfig']
export type GammaObservationState = IdlAccounts<Gamma>['observationState']

export type GammaAccountWithInfo<T> = {
  accountInfo: AccountInfo<Buffer>
  account: T
}

const PriceFeedFarmContext = createContext<IPriceFeedConfig | null>(null)

export const PriceFeedFarmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<IPrices>({})
  const [priceFetched, setPriceFetched] = useState<boolean>(false)
  const [statsData, setStatsData] = useState<IStats | null>()
  const { walletProvider } = useWallet()
  const [solPrice, setSolPrice] = useState<number>(0)
  const { publicKey } = useWalletBalance()
  const { connection, network } = useConnectionConfig()
  const stakeProgram: Program = useMemo(
    () =>
      publicKey
        ? new Program(
            sslJson as any,
            SSL_PROGRAM_ID,
            new Provider(connection, walletProvider, { commitment: 'finalized' })
          )
        : undefined,
    [connection, publicKey, network]
  )
  const accountKeyQuery = useQuery({
    queryKey: ['stakeAccountKey', publicKey, connection.rpcEndpoint],
    queryFn: async () => {
      if (!publicKey) return undefined
      return await getStakingAccountKey(walletProvider, network)
    },
    enabled: !!publicKey && !!connection,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const SSLProgram: Program = useMemo(
    () =>
      new Program(
        sslJson as any,
        SSL_PROGRAM_ID,
        new Provider(connection, walletProvider, { commitment: 'finalized' })
      ),
    [connection]
  )

  const GammaProgram: any = useMemo(
    () =>
      new coralProgram(
        GammaJson as Gamma,
        new AnchorProvider(connection, walletProvider, { commitment: 'finalized' })
      ),
    [connection]
  )
  const refreshTokenDataMutation = useMutation({
    mutationFn: async () => {
      const { data } = await getFarmTokenPrices()
      if (data !== undefined && data !== null) {
        setPrices(data)
      }
    },
    onSuccess: () => setPriceFetched(true)
  })

  useEffect(() => {
    if (prices['SOL/USDC']) {
      setSolPrice(prices['SOL/USDC'].current)
    }
  }, [prices])

  return (
    <PriceFeedFarmContext.Provider
      value={{
        prices,
        refreshTokenData: refreshTokenDataMutation.mutate,
        priceFetched,
        statsData,
        setStatsData,
        stakeProgram,
        SSLProgram,
        stakeAccountKey: accountKeyQuery.data,
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
