import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchAggregateStats,
  fetchAllPools,
  fetchGAMMAConfig,
  fetchLpPositions,
  fetchPortfolioStats,
  fetchTokenList,
  fetchTokensByPublicKey,
  fetchUser
} from '@/api/gamma'
import {
  GAMMAConfig,
  GAMMAListTokenResponse,
  GAMMAPool,
  GAMMAPoolsResponse,
  GAMMAPoolWithUserLiquidity,
  GAMMAStats,
  GAMMAUser,
  GAMMAUserLPPositionWithPrice,
  UserPortfolioLPPosition,
  UserPortfolioStats
} from '@/types/gamma'
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
} from '@/pages/FarmV4/constants'
import { usePriceFeedFarm } from '.'
import { useConnectionConfig } from './settings'
import { getLiquidityPoolKey, getpoolId } from '@/web3/Farm'
import useBoolean from '@/hooks/useBoolean'
import Decimal from 'decimal.js-light'
import { aborter } from '@/utils'

interface GAMMADataModel {
  gammaConfig: GAMMAConfig
  /**
   * @deprecated use filteredPools instead - this is the raw response and should ideally not be used
   */
  pools: GAMMAPool[]
  user: GAMMAUser
  portfolioStats: UserPortfolioStats
  lpPositions: GAMMAUserLPPositionWithPrice[]
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
  setShowCreatedPools: Dispatch<SetStateAction<boolean>>
  currentSort: string
  setCurrentSort: Dispatch<SetStateAction<string>>
  showDeposited: boolean
  setShowDeposited: Dispatch<SetStateAction<boolean>>
  poolPage: number
  isLoadingPools: boolean
  setPoolPage: Dispatch<SetStateAction<number>>
  isSearchActive: boolean
  filteredPools: GAMMAPoolWithUserLiquidity[]
  updatePools: (
    data: {
      page: number
      pageSize: number
      poolType?: Pool['type'] | 'primary'
      searchTokens?: string
    },
    append?: boolean
  ) => void
  poolsHasMoreData: boolean
  sortConfig: { id: string; name: string; direction: string; key: string }
  selectedCardLiquidityAcc: any
  setSelectedCardLiquidityAcc: Dispatch<SetStateAction<any>>
  createPoolType: string
  setCreatePoolType: Dispatch<SetStateAction<string>>
  stats: GAMMAStats
  isConfettiVisible: boolean
  setIsConfettiVisible: Dispatch<SetStateAction<boolean>>
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
  price: number
}

const GAMMAContext = createContext<GAMMADataModel | null>(null)
export const GammaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { userCache } = useConnectionConfig()
  const { base58PublicKey, publicKey } = useWalletBalance()
  const [gammaConfig, setGammaConfig] = useState<GAMMAConfig | null>(null)
  const [pools, setPools] = useState<GAMMAPool[]>([])
  const [user, setUser] = useState<GAMMAUser | null>(null)
  const [portfolioStats, setPortfolioStats] = useState<UserPortfolioStats | null>(null)
  const [lpPositions, setLpPositions] = useState<GAMMAUserLPPositionWithPrice[]>([])
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
  const [showCreatedPools, setShowCreatedPools] = useState<boolean>(userCache.gamma.showCreatedFilter)
  const [currentSort, setCurrentSort] = useState<string>(userCache.gamma.currentSort)
  const [showDeposited, setShowDeposited] = useState<boolean>(userCache.gamma.showDepositedFilter)
  const isCustomSlippage = useMemo(() => !BASE_SLIPPAGE.includes(slippage), [slippage])
  const [tokenList, setTokenList] = useState<TokenListToken[]>([])
  const [page, setPage] = useState(1)
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(false)
  const [isLoadingPools, setIsLoadingPools] = useBoolean(false)
  const [poolPage, setPoolPage] = useState(1)
  const [poolsHasMoreData, setPoolsHasMoreData] = useState(true)
  const sortConfig = useMemo(() => GAMMA_SORT_CONFIG_MAP.get(currentSort) ?? GAMMA_SORT_CONFIG[0], [currentSort])
  const [selectedCardLiquidityAcc, setSelectedCardLiquidityAcc] = useState<any>({})
  const [stats, setStats] = useState<GAMMAStats>({
    tvl: '0',
    stats24h: {
      volume: '0',
      fees: '0'
    },
    stats7d: {
      volume: '0',
      fees: '0'
    },
    stats30d: {
      volume: '0',
      fees: '0'
    }
  })
  const [createPoolType, setCreatePoolType] = useState<string>('')
  const [isConfettiVisible, setIsConfettiVisible] = useState<boolean>(false)

  // TODO:
  useEffect(() => {
    // first render only
    if (tokenList.length == 0) {
      updateTokenList(1, TOKEN_LIST_PAGE_SIZE, false)
    }
    if (pools.length == 0) {
      updatePools({ page: 1, pageSize: POOL_LIST_PAGE_SIZE, poolType: currentPoolType.type })
    }
    if (!gammaConfig) {
      fetchGAMMAConfig().then((config) => {
        if (config) setGammaConfig(config)
      })
    }
    fetchAggregateStats().then((stats) => {
      if (stats) setStats(stats)
    })
    const statsInterval = setInterval(() => {
      fetchAggregateStats().then((stats) => {
        if (stats) setStats(stats)
      })
    }, 60000)
    return () => clearInterval(statsInterval)
  }, [])

  const updateTokenList = async (page: number, pageSize: number, append = true) => {
    setIsLoadingTokenList(true)
    const response = (await fetchTokenList(
      page,
      pageSize,
      createPoolType.toLowerCase()
    )) as GAMMAListTokenResponse | null
    setIsLoadingTokenList(false)
    if (!response || !response.success) {
      return
    }
    setMaxTokensReached(response.data.totalPages <= response.data.currentPage)
    const currentTokenList = append ? tokenList : []
    const hasSetOfTokens = new Set(tokenList.map((token) => token.address))
    for (const token of response.data.tokens) {
      if (hasSetOfTokens.has(token.address)) {
        continue
      }
      hasSetOfTokens.add(token.address)
      currentTokenList.push(token)
    }

    setTokenList([...currentTokenList])
  }

  const updatePools = (
    {
      page,
      pageSize,
      poolType = 'all',
      searchTokens = '',
      signal
    }: {
      page: number
      pageSize: number
      poolType?: Pool['type'] | 'all'
      searchTokens?: string
      signal?: AbortSignal
    },
    append = true
  ) => {
    if (poolType === 'migrate') {
      return
    }
    setIsLoadingPools.on()
    fetchAllPools(
      page,
      pageSize,
      poolType,
      sortConfig.direction.toLowerCase() as 'desc' | 'asc',
      sortConfig.key.toLowerCase(),
      searchTokens,
      signal
    )
      .then((poolsData: GAMMAPoolsResponse) => {
        if (poolsData && poolsData.success) {
          setPoolsHasMoreData(poolsData.data.totalPages > poolsData.data.currentPage)
          const existingPools = append ? pools : []
          const hasSetOfPools = new Set(pools.map((pool) => `${pool.mintA.address}_${pool.mintB.address}`))
          for (const pool of poolsData.data.pools) {
            if (hasSetOfPools.has(`${pool.mintA.address}_${pool.mintB.address}`) && append) {
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

  useEffect(() => {
    //update token on next pagination
    updateTokenList(page, TOKEN_LIST_PAGE_SIZE)
  }, [page])

  useEffect(() => {
    // on create pool request new data
    // will trigger above useEffect
    setTokenList([])
    setPage(1)
    if (page == 1) {
      updateTokenList(1, TOKEN_LIST_PAGE_SIZE, false)
    }
  }, [createPoolType])

  useEffect(() => {
    setPoolPage(1)
    // same page
    if (poolPage == 1) {
      updatePools({ page: 1, pageSize: POOL_LIST_PAGE_SIZE, poolType: currentPoolType.type }, false)
    }
  }, [currentPoolType])
  useEffect(() => {
    updatePools({ page: poolPage, pageSize: POOL_LIST_PAGE_SIZE, poolType: currentPoolType.type })
  }, [poolPage, sortConfig])

  useEffect(() => {
    const timeout = setTimeout(() => {
      //debounced search
      setPoolPage(1)
      updatePools(
        {
          page: 1,
          pageSize: POOL_LIST_PAGE_SIZE,
          poolType: currentPoolType.type,
          searchTokens,
          signal: aborter.addSignal('update-gamma-pools')
        },
        false
      )
    }, 233)

    return () => {
      aborter.abortSignal('update-gamma-pools')
      clearTimeout(timeout)
    }
  }, [searchTokens])

  useEffect(() => {
    if (base58PublicKey) {
      // user data and portfolio stat fetching
      fetchUser(base58PublicKey).then((userData) => {
        if (userData) {
          setUser(userData)

          fetchPortfolioStats(userData.id).then((stats) => {
            if (stats) setPortfolioStats(stats)
          })
        }
      })
      // lp position fet
      fetchLpPositions(base58PublicKey).then(async (positions: UserPortfolioLPPosition[] | null) => {
        if (positions) {
          let positionsToSet = []
          const tokenListResponse = await fetchTokensByPublicKey(
            positions
              .reduce((acc, icc) => acc + icc.mintA.address + ',' + icc.mintB.address + ',', '')
              .slice(0, -1)
          )
          if (tokenListResponse && tokenListResponse.success) {
            const priceMap = new Map(tokenListResponse.data.tokens.map((token) => [token.address, token.price]))
            positionsToSet = positions.map((position) => {
              const tokenAPrice = priceMap.get(position.mintA.address)
              const tokenBPrice = priceMap.get(position.mintB.address)
              const valueA = new Decimal(position.tokenADeposited).mul(tokenAPrice)
              const valueB = new Decimal(position.tokenBDeposited).mul(tokenBPrice)
              const totalValue = valueA.add(valueB)
              return {
                ...position,
                totalValue: totalValue.toString(),
                valueA: valueA.toString(),
                valueB: valueB.toString()
              }
            })
          } else {
            positionsToSet = positions.map((position) => ({
              ...position,
              totalValue: '0.0',
              valueA: '0.0',
              valueB: '0.0'
            }))
          }
          setLpPositions(positionsToSet)
        }
      })
    } else {
      setUser(null)
      setPortfolioStats(null)
      setLpPositions([])
    }
  }, [base58PublicKey])

  useEffect(() => {
    ;(async () => {
      if (GammaProgram && Object.keys(selectedCard)?.length > 0) {
        try {
          const poolIdKey = await getpoolId(selectedCard)
          const gammaPool = await GammaProgram.account.poolState.fetch(poolIdKey)
          setSelectedCardPool(gammaPool)
        } catch (e) {
          console.log(e)
        }
      }
    })()
  }, [GammaProgram, selectedCard])

  useEffect(() => {
    ;(async () => {
      if (GammaProgram && Object.keys(selectedCard)?.length > 0) {
        try {
          const poolIdKey = await getpoolId(selectedCard)
          const liquidityAccountKey = await getLiquidityPoolKey(poolIdKey, publicKey)
          const liquidityAccount = await GammaProgram?.account?.userPoolLiquidity?.fetch(liquidityAccountKey)
          setSelectedCardLiquidityAcc(liquidityAccount)
        } catch (e) {
          console.log(e)
        }
      }
    })()
  }, [GammaProgram, selectedCard])

  const filteredPools = useMemo(() => {
    const userLpPositions = new Map(lpPositions.map((lp) => [lp.poolStatePublicKey, lp]))
    return pools
      .map((pool) => {
        const userLpPosition = userLpPositions.get(pool.id)
        return {
          ...pool,
          userLpPosition: userLpPosition,
          hasDeposit: userLpPosition
            ? new Decimal(userLpPosition.tokenADeposited).gt(0) ||
            new Decimal(userLpPosition.tokenBDeposited).gt(0)
            : false
        }
      })
      .filter((pool) => {
        if (showDeposited) {
          return pool.hasDeposit
        }
        return true
      })
  }, [pools, lpPositions, showDeposited])

  const isSearchActive = searchTokens.trim().length > 0

  return (
    <GAMMAContext.Provider
      value={{
        gammaConfig,
        stats,
        pools,
        user,
        portfolioStats,
        lpPositions,
        slippage,
        setSlippage,
        isCustomSlippage,
        selectedCard,
        setSelectedCard,
        openDepositWithdrawSlider,
        setOpenDepositWithdrawSlider,
        currentPoolType,
        setCurrentPoolType,
        selectedCardPool,
        modeOfOperation,
        setModeOfOperation,
        setSelectedCardPool,
        page,
        setPage,
        tokenList,
        isLoadingTokenList,
        updateTokenList,
        maxTokensReached,
        sendingTransaction,
        setSendingTransaction,
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
        poolsHasMoreData,
        sortConfig,
        selectedCardLiquidityAcc,
        setSelectedCardLiquidityAcc,
        createPoolType,
        setCreatePoolType,
        isConfettiVisible,
        setIsConfettiVisible
      }}
    >
      {children}
    </GAMMAContext.Provider>
  )
}

export const useGamma = (): GAMMADataModel => useContext(GAMMAContext)
