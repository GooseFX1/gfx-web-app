import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import {
  fetchAggregateStats,
  fetchAllPools,
  fetchGAMMAConfig,
  fetchLpPositions,
  fetchPortfolioStats,
  fetchTokenList,
  fetchUser,
  sortAndFilterPools
} from '../api/gamma'
import {
  GAMMAConfig,
  GAMMAListTokenResponse,
  GAMMAPool,
  GAMMAPoolsResponse,
  GAMMAProtocolStats,
  GAMMAUser,
  UserPortfolioLPPosition,
  UserPortfolioStats
} from '../types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import {
  BASE_SLIPPAGE,
  GAMMA_SORT_CONFIG,
  GAMMA_SORT_CONFIG_MAP,
  ModeOfOperation,
  Pool,
  POOL_LIST_PAGE_SIZE,
  POOL_TYPE,
  TOKEN_LIST_PAGE_SIZE
} from '../pages/FarmV4/constants'
import { usePriceFeedFarm } from '.'
import { useConnectionConfig } from './settings'
import { getpoolId } from '@/web3/Farm'
import useBoolean, { UseBooleanSetter } from '@/hooks/useBoolean'

interface GAMMADataModel {
  gammaConfig: GAMMAConfig
  aggregateStats: GAMMAProtocolStats
  pools: GAMMAPool[]
  user: GAMMAUser
  portfolioStats: UserPortfolioStats
  lpPositions: UserPortfolioLPPosition[]
  slippage: number
  setSlippage: Dispatch<SetStateAction<number>>
  isCustomSlippage: boolean
  selectedCard: any
  setSelectedCard: Dispatch<SetStateAction<any>>
  openDepositWithdrawSlider: boolean
  setOpenDepositWithdrawSlider: Dispatch<SetStateAction<boolean>>
  currentPoolType: Pool
  setCurrentPoolType: Dispatch<SetStateAction<Pool>>
  selectedCardPool: any
  setSelectedCardPool: Dispatch<SetStateAction<any>>
  modeOfOperation: string
  setModeOfOperation: Dispatch<SetStateAction<string>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  tokenList: TokenListToken[]
  isLoadingTokenList: boolean
  updateTokenList: (page: number, pageSize: number) => Promise<void>
  maxTokensReached: boolean
  sendingTransaction: boolean
  setSendingTransaction: Dispatch<SetStateAction<boolean>>
  searchTokens: string
  setSearchTokens: Dispatch<SetStateAction<string>>
  showCreatedPools: boolean
  setShowCreatedPools: UseBooleanSetter
  currentSort: string
  setCurrentSort: Dispatch<SetStateAction<string>>
  showDeposited: boolean
  setShowDeposited: Dispatch<SetStateAction<boolean>>
  poolPage: number
  isLoadingPools: boolean
  setPoolPage: Dispatch<SetStateAction<number>>
  isSearchActive: boolean
  filteredPools: GAMMAPool[]
  updatePools: (page: number, pageSize: number, poolType: Pool['type'] | 'all') => void
  poolsHasMoreData: boolean
}

export type TokenListToken = {
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
  tags: string[]
  daily_volume: number | null
  freeze_authority: string | null
  mint_authority: string | null
}

const GAMMAContext = createContext<GAMMADataModel | null>(null)
export const GammaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { userCache } = useConnectionConfig()
  const { publicKey: publicKey } = useWalletBalance()
  const [gammaConfig, setGammaConfig] = useState<GAMMAConfig | null>(null)
  const [aggregateStats, setAggregateStats] = useState<GAMMAProtocolStats | null>(null)
  const [pools, setPools] = useState<GAMMAPool[]>([])
  const [user, setUser] = useState<GAMMAUser | null>(null)
  const [portfolioStats, setPortfolioStats] = useState<UserPortfolioStats | null>(null)
  const [lpPositions, setLpPositions] = useState<UserPortfolioLPPosition[] | null>(null)
  const [slippage, setSlippage] = useState<number>(0.1)
  const [selectedCard, setSelectedCard] = useState<any>({})
  const [openDepositWithdrawSlider, setOpenDepositWithdrawSlider] = useState<boolean>(false)
  const [currentPoolType, setCurrentPoolType] = useState<Pool>(POOL_TYPE.primary)
  const { GammaProgram } = usePriceFeedFarm()
  const [selectedCardPool, setSelectedCardPool] = useState({})
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [maxTokensReached, setMaxTokensReached] = useState(false)
  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false)
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [showCreatedPools, setShowCreatedPools] = useBoolean(false)
  const [currentSort, setCurrentSort] = useState<string>('1')
  const [showDeposited, setShowDeposited] = useState<boolean>(userCache.gamma.showDepositedFilter)
  const isCustomSlippage = useMemo(() => !BASE_SLIPPAGE.includes(slippage), [slippage])
  const [tokenList, setTokenList] = useState<TokenListToken[]>([])
  const [page, setPage] = useState(1)
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(false)
  const [isLoadingPools, setIsLoadingPools] = useBoolean(false)
  const [poolPage, setPoolPage] = useState(1)
  const [poolsHasMoreData, setPoolsHasMoreData] = useState(true)
  const sortConfig = useMemo(() => GAMMA_SORT_CONFIG_MAP.get(currentSort) ?? GAMMA_SORT_CONFIG[0], [currentSort])

  useEffect(() => {
    // first render only
    if (tokenList.length == 0) {
      updateTokenList(1, TOKEN_LIST_PAGE_SIZE)
    }
    if (pools.length == 0) {
      updatePools(1, POOL_LIST_PAGE_SIZE, currentPoolType.type)
    }
  }, [])

  const updateTokenList = async (page: number, pageSize: number) => {
    setIsLoadingTokenList(true)
    const response = (await fetchTokenList(page, pageSize)) as GAMMAListTokenResponse | null
    setIsLoadingTokenList(false)
    console.log(response)
    if (!response || !response.success) {
      return
    }
    setMaxTokensReached(response.data.totalPages <= response.data.currentPage)
    const currentTokenList = tokenList
    const hasSetOfTokens = new Set(tokenList.map((token) => token.address))
    for (const token of response.data.tokens) {
      if (hasSetOfTokens.has(token.address)) {
        continue
      }
      hasSetOfTokens.add(token.address)
      currentTokenList.push(token)
    }
    console.log({ currentTokenList })
    setTokenList([...currentTokenList])
  }

  const updatePools = (page: number, pageSize: number, poolType: Pool['type'] | 'all' = 'all') => {
    if (poolType === 'migrate') {
      return
    }
    setIsLoadingPools.on()
    fetchAllPools(page, pageSize, poolType, sortConfig.direction.toLowerCase(), sortConfig.key.toLowerCase())
      .then((poolsData: GAMMAPoolsResponse) => {
        if (poolsData && poolsData.success) {
          setPoolsHasMoreData(poolsData.data.totalPages > poolsData.data.currentPage)
          const existingPools = pools
          const hasSetOfPools = new Set(pools.map((pool) => `${pool.mintA.address}_${pool.mintB.address}`))
          for (const pool of poolsData.data.pools) {
            if (hasSetOfPools.has(`${pool.mintA.address}_${pool.mintB.address}`)) {
              continue
            }
            hasSetOfPools.add(`${pool.mintA.address}_${pool.mintB.address}`)
            existingPools.push(pool)
          }
          setPools([...existingPools])
        }
      })
      .finally(() => setIsLoadingPools.off())
  }
  useLayoutEffect(() => {
    updateTokenList(page, TOKEN_LIST_PAGE_SIZE)
  }, [page])

  useLayoutEffect(() => {
    updatePools(poolPage, POOL_LIST_PAGE_SIZE, currentPoolType.type)
  }, [poolPage, currentPoolType, sortConfig])

  useEffect(() => {
    fetchGAMMAConfig().then((config) => {
      if (config) setGammaConfig(config)
    })
  }, [fetchGAMMAConfig])

  useEffect(() => {
    fetchAggregateStats().then((stats) => {
      if (stats) setAggregateStats(stats)
    })
  }, [fetchAggregateStats])

  useEffect(() => {
    if (publicKey !== null) {
      fetchUser(publicKey.toBase58()).then((userData) => {
        if (userData) setUser(userData)
      })
    }
  }, [fetchUser, user])

  useEffect(() => {
    if (user) {
      fetchPortfolioStats(user.id).then((stats) => {
        if (stats) setPortfolioStats(stats)
      })
    }
  }, [fetchPortfolioStats, user])

  useEffect(() => {
    if (user) {
      fetchLpPositions(user.id).then((positions) => {
        if (positions) setLpPositions(positions)
      })
    }
  }, [fetchLpPositions, user])

  //TODO: remove this check (Object.keys(selectedCard)?.length > 0
  //& make sure it's there at contract level)

  useEffect(() => {
    ;(async () => {
      if (GammaProgram && Object.keys(selectedCard)?.length > 0) {
        try {
          const poolIdKey = await getpoolId(selectedCard)
          const gammaPool = await GammaProgram?.account?.poolState?.fetch(poolIdKey)
          setSelectedCardPool(gammaPool)
        } catch (e) {
          console.log(e)
        }
      }
    })()
  }, [GammaProgram, selectedCard])

  const filteredPools = useMemo(
    () => sortAndFilterPools(pools, searchTokens, currentPoolType, sortConfig),
    [pools, searchTokens, sortConfig, currentPoolType]
  )

  const isSearchActive = searchTokens.trim().length > 0

  return (
    <GAMMAContext.Provider
      value={{
        gammaConfig,
        aggregateStats,
        pools,
        user,
        portfolioStats,
        lpPositions,
        slippage,
        setSlippage,
        isCustomSlippage,
        selectedCard: selectedCard,
        setSelectedCard: setSelectedCard,
        openDepositWithdrawSlider: openDepositWithdrawSlider,
        setOpenDepositWithdrawSlider: setOpenDepositWithdrawSlider,
        currentPoolType: currentPoolType,
        setCurrentPoolType: setCurrentPoolType,
        selectedCardPool: selectedCardPool,
        modeOfOperation: modeOfOperation,
        setModeOfOperation: setModeOfOperation,
        setSelectedCardPool: setSelectedCardPool,
        page,
        setPage,
        tokenList,
        isLoadingTokenList,
        updateTokenList,
        maxTokensReached,
        sendingTransaction: sendingTransaction,
        setSendingTransaction: setSendingTransaction,
        searchTokens,
        setSearchTokens,
        showCreatedPools,
        setShowCreatedPools,
        currentSort,
        setCurrentSort,
        showDeposited,
        setShowDeposited,
        isLoadingPools,
        poolPage,
        setPoolPage,
        isSearchActive,
        filteredPools,
        updatePools,
        poolsHasMoreData
      }}
    >
      {children}
    </GAMMAContext.Provider>
  )
}

export const useGamma = (): GAMMADataModel => {
  const context = useContext(GAMMAContext)
  if (!context) {
    throw new Error('Missing gamma context')
  }

  return context
}
