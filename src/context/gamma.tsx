import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect, useLayoutEffect,
  useMemo,
  useState
} from 'react'
import {
  fetchAggregateStats,
  fetchAllPools,
  fetchGAMMAConfig,
  fetchLpPositions,
  fetchPoolsByMints,
  fetchPortfolioStats,
  fetchTokenList,
  fetchTokensByPublicKey,
  fetchUser,
  forceCronUpdate, forceCronUpdateWithConnectionAndTxSig
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
  GAMMA_SORT_CONFIG_MAP, GAMMA_SORT_CONFIG_PUBKEY_REQUIRED,
  JupToken,
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
import BN from 'bn.js'
import usePrevious from '@/hooks/usePrevious'
import useMultiSelect from '@/hooks/useMultiSelect'
import useFirstRender from '@/hooks/useFirstRender'

type ViewRange = 0 | 1 | 2

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
  totalPoolCount: number,
  tokenList: TokenListToken[]
  isLoadingTokenList: boolean
  updateTokenList: ({ page, pageSize, searchValue }: {
    page: number
    pageSize: number
    searchValue?: string,
    signal?: AbortSignal
  }, append?: boolean) => Promise<void>
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
  forceCronAndUpdateLocalData: (txSig?: string) => Promise<void>
  updateUserLpPositions: () => Promise<void>
  viewRange: ViewRange
  setViewRange: Dispatch<SetStateAction<ViewRange>>
  computedViewRange: '24H' | '7D' | '30D'
  handlePoolSort: (id: string) => void
  topBalancesWithTokenList: JupToken[]
  calculatePoolType: Set<string>
  selectedTokens: JupToken[]
  addSelectedToken: (token: JupToken) => void
  removeSelectedToken: (token: JupToken) => void
  hasSelectedToken: (token: JupToken) => boolean
  clearAllSelectedTokens: () => void
  setTokenList: Dispatch<SetStateAction<TokenListToken[]>>
  isPortfolio: boolean
  setIsPortfolio: { toggle: () => void; on: () => void; off: () => void; set: (value: boolean) => void }
  isCardMode: string
  setIsCardMode: Dispatch<SetStateAction<string>>
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
export const tokenListAbortTokenGamma = 'tokenList-gamma' as const

const GAMMAContext = createContext<GAMMADataModel | null>(null)
export const GammaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { userCache, connection, updateUserCache } = useConnectionConfig()
  const { base58PublicKey, publicKey, balance, topBalances } = useWalletBalance()
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
  const [selectedCardPool, setSelectedCardPool] = useState<any>({})
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
  const [isLoadingTokenList, setIsLoadingTokenList] = useBoolean(false)
  const [isLoadingPools, setIsLoadingPools] = useBoolean(false)
  const [poolPage, setPoolPage] = useState(1)
  const [totalPoolCount, setTotalPoolCount] = useState(0)
  const [poolsHasMoreData, setPoolsHasMoreData] = useState(true)
  const sortConfig = useMemo(() => GAMMA_SORT_CONFIG_MAP.get(currentSort) ?? GAMMA_SORT_CONFIG[0], [currentSort])
  const [selectedCardLiquidityAcc, setSelectedCardLiquidityAcc] = useState<any>({})
  const [calculatePoolType, setCalculatePoolType] = useState<Set<string>>(new Set())
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
  useLayoutEffect(() => {
    if (!publicKey) {
      if (GAMMA_SORT_CONFIG_PUBKEY_REQUIRED.includes(userCache.gamma.currentSort)) {
        setCurrentSort(() => {
          updateUserCache({
            ...userCache,
            gamma: {
              ...userCache.gamma,
              currentSort: '1'
            }
          })
          return '1'
        })
      }
    }
  }, [publicKey, userCache])
  const [createPoolType, setCreatePoolType] = useState<string>('')
  const [isConfettiVisible, setIsConfettiVisible] = useState<boolean>(false)
  const [viewRange, setViewRange] = useState<ViewRange>(0)
  const [isPortfolio, setIsPortfolio] = useBoolean(false)
  const [isCardMode, setIsCardMode] = useState<string>(userCache.gamma.viewMode)
  const prevIsCardMode = usePrevious(isCardMode)
  const {
    choices: selectedTokens,
    addChoice: addSelectedToken,
    removeChoice: removeSelectedToken,
    hasChoice: hasSelectedToken,
    clearAllChoices: clearAllSelectedTokens
  } = useMultiSelect<JupToken, string>({
    uniqueValueSelector: (token) => token.address
  })
  const isFirstRender = useFirstRender()

  const handlePoolSort = useCallback(
    (id: string) => {
      // persists current sort in local storage
      setCurrentSort((prevState) => {
        if (prevState === id) {
          return prevState
        }
        updateUserCache({
          gamma: {
            ...userCache.gamma,
            currentSort: id
          }
        })
        // sets value to context
        return id
      })
    },
    [setCurrentSort, userCache]
  )
  useEffect(() => {
    if (!publicKey) {
      setTokenList([])
      setPage(1)
    }
  }, [publicKey])
  useEffect(() => {
    if (!isCardMode && prevIsCardMode !== isCardMode) {
      // reset based on mode
      if (viewRange != 0) {
        setViewRange(0)
      }
      if (currentSort != '1') {
        setCurrentSort('1')
      }
    }
  }, [isCardMode, viewRange, currentSort, prevIsCardMode])
  useEffect(() => {
    if (pools.length == 0) {
      updatePools({ page: 1, pageSize: POOL_LIST_PAGE_SIZE })
    }
    if (!gammaConfig) {
      fetchGAMMAConfig().then((config) => {
        if (config) setGammaConfig(config)
      })
    }
    fetchAggregateStats().then((s) => {
      if (s) setStats(s)
    })
    const statsInterval = setInterval(() => {
      fetchAggregateStats().then((s) => {
        if (s) setStats(s)
      })
    }, 60000)

    if (calculatePoolType.size == 0) {
      const abortSig = 'tokenListCalcPoolTypeGamma'
      const signal = aborter.addSignal(abortSig)
      // fetch primary tokens for type calculation on create pool
      fetchTokenList(1, 250, 'primary', '', signal).then((t) => {
        if (t.success) {
          const primaryTokensMap = new Set(t.data.tokens.map((token) => token.address))
          setCalculatePoolType(primaryTokensMap)
        }
      })
    }

    return () => clearInterval(statsInterval)
  }, [])

  const updateTokenList = async (
    {
      page,
      pageSize,
      tokenType = 'all',
      searchValue = ''
    }: {
      page: number
      pageSize: number
      tokenType?: Pool['type']
      searchValue?: string
    }, append = true) => {
    setIsLoadingTokenList.on()
    if (aborter.getSignal(tokenListAbortTokenGamma)) {
      aborter.abortSignal(tokenListAbortTokenGamma)
    }
    const signal = aborter.addSignal(tokenListAbortTokenGamma)

    const response = (await fetchTokenList(
      page,
      pageSize,
      tokenType,
      searchValue,
      signal
    )) as GAMMAListTokenResponse | null
    if (!response.success && response.data == null) {
      return
    }
    setIsLoadingTokenList.off()
    if (!response || !response.success) {
      return
    }
    setMaxTokensReached(
      (response.data.totalPages == 0 || response.data.tokens.length == 0)
      || response.data.totalPages == response.data.currentPage)
    const currentTokenList = append ? [...tokenList] : []
    const hasSetOfTokens = new Set(currentTokenList.map((token) => token.address))
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
      searchTokens = '',
      signal
    }: {
      page: number
      pageSize: number
      searchTokens?: string
      signal?: AbortSignal
    },
    append = true
  ) => {
    if (currentPoolType.type === 'migrate') {
      return
    }
    let key = `${sortConfig.key.toLowerCase()}`
    if (sortConfig.id == '9' || sortConfig.id == '10') {
      return;
    }
    if (sortConfig.id !== '1' && sortConfig.id !== '2') {
      key = `${key}${computedViewRange.toLowerCase()}`
    }
    setIsLoadingPools.on();

    (selectedTokens.length > 0 ?
      fetchPoolsByMints(
        {
          mintA: selectedTokens[0]?.address,
          mintB: selectedTokens[1]?.address,
          poolType: currentPoolType.type,
          sortOrder: sortConfig.direction.toLowerCase() as 'desc' | 'asc',
          sortKey: key,
          page: page,
          pageSize: POOL_LIST_PAGE_SIZE,
          signal: signal,
          userPublicKey: base58PublicKey,
          showDeposited,
          showCreated: showCreatedPools
        }
      )
      : fetchAllPools(
        {
          page,
          pageSize,
          poolType: currentPoolType.type,
          sortOrder: sortConfig.direction.toLowerCase() as 'desc' | 'asc',
          sortKey: key,
          searchTokens,
          abortSignal: signal,
          userPublicKey: base58PublicKey,
          showDeposited,
          showCreated: showCreatedPools
        }
      ))
      .then((poolsData: GAMMAPoolsResponse) => {
        if (poolsData && poolsData.success) {
          setPoolsHasMoreData(poolsData.data.totalPages > poolsData.data.currentPage)
          setPoolPage(poolsData.data.currentPage)
          setTotalPoolCount(poolsData.data.totalItems)
          const existingPools = append ? pools : []
          const existingPoolsMap = new Map(
            existingPools.map((pool) => [`${pool.mintA.address}_${pool.mintB.address}`, pool])
          )

          // Process new pools, overwriting existing entries to maintain sort order
          const updatedPools = poolsData.data.pools.map((pool) => {
            const key = `${pool.mintA.address}_${pool.mintB.address}`
            // If pool exists and we're appending, use existing data
            if (existingPoolsMap.has(key) && append) {
              existingPoolsMap.delete(key) // Remove from map since we've handled it
              return pool // Use new pool to maintain sort order
            }
            return pool
          })

          // Add any remaining existing pools that weren't in the new data
          if (append) {
            updatedPools.unshift(...Array.from(existingPoolsMap.values()))
          }

          setPools(updatedPools)
        }
      })
      .finally(() => setIsLoadingPools.off())
  }

  useEffect(() => {
    if (isFirstRender) return
    console.log('pageTrigger')
    //update token on next pagination
    updateTokenList({ page, pageSize: TOKEN_LIST_PAGE_SIZE })
  }, [page])

  useEffect(() => {
    if (isFirstRender) return
    console.log('createPoolTrigger')
    // on create pool request new data
    // will trigger above useEffect
    setTokenList([])
    setPage(1)
    if (page == 1) {
      updateTokenList({ page: 1, pageSize: TOKEN_LIST_PAGE_SIZE }, false)
    }
  }, [createPoolType])

  useEffect(() => {
    if (isFirstRender) return
    if (!isPortfolio) {
      setShowDeposited(false)
    }
    updatePools({ page: 1, pageSize: POOL_LIST_PAGE_SIZE }, false)

  }, [isPortfolio, currentPoolType, showDeposited, showCreatedPools,sortConfig, viewRange])

  useEffect(() => {

    const timeout = setTimeout(() => {
      //debounced search
      setPoolPage(1)
      updatePools(
        {
          page: 1,
          pageSize: POOL_LIST_PAGE_SIZE,
          signal: aborter.addSignal('update-gamma-pools')
        },
        false
      )
    }, 500)

    return () => {
      aborter.abortSignal('update-gamma-pools')
      clearTimeout(timeout)
    }
  }, [selectedTokens])

  const getUserLpPositions = async () =>
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
            const uiValueA = new Decimal(position.tokenADeposited).sub(position.tokenAWithdrawn)
              .div(Math.pow(10, parseInt(position.mintA.decimals)))
            const valueA = uiValueA.mul(tokenAPrice)
            const uiValueB = new Decimal(position.tokenBDeposited).sub(position.tokenBWithdrawn)
              .div(Math.pow(10, parseInt(position.mintB.decimals)))
            const valueB = uiValueB.mul(tokenBPrice)
            const totalValue = valueA.add(valueB)
            return {
              ...position,
              totalValue: totalValue.toString(),
              valueA: valueA.toString(),
              valueB: valueB.toString(),
              uiValueA: uiValueA.toString(),
              uiValueB: uiValueB.toString()
            }
          })
        } else {
          positionsToSet = positions.map((position) => ({
            ...position,
            totalValue: '0.0',
            valueA: '0.0',
            valueB: '0.0',
            uiValueA: '0.0',
            uiValueB: '0.0'
          }))
        }
        setLpPositions(prev => {
          console.log('setLpPositions', { positionsToSet, prev })

          if (JSON.stringify(prev) !== JSON.stringify(positionsToSet)) {
            console.log('setting new lp positions')
            return positionsToSet
          }
          return prev
        })
      }
    })


  useEffect(() => {
    if (base58PublicKey) {
      // user data and portfolio stat fetching
      fetchUser(base58PublicKey).then((userData) => {
        if (userData) {
          setUser(userData)

          fetchPortfolioStats(userData.id).then((s) => {
            if (s) setPortfolioStats(s)
          })
        }
      })
      // lp position fet
      getUserLpPositions()
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
      if (GammaProgram && publicKey && Object.keys(selectedCard)?.length > 0) {
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
  }, [GammaProgram, selectedCard, publicKey])

  const { filteredPools } = useMemo(() => {
    const userLpPositions = new Map(lpPositions.map((lp) => [lp.poolStatePublicKey, lp]))
    const mintA = selectedTokens[0]?.address
    const mintB = selectedTokens[1]?.address
    const newPools = pools
      .map((pool) => {
        const userLpPosition = userLpPositions.get(pool.id)
        return {
          ...pool,
          userLpPosition: userLpPosition ? structuredClone(userLpPosition) : undefined,
          hasDeposit: userLpPosition
            ? new BN(userLpPosition?.lpTokensOwned)?.gt(new BN(0))
            : false
        }
      }).sort((a, b) => {
        if (sortConfig.id === '9' || sortConfig.id === '10') {
          const aValue = new Decimal(a.userLpPosition.totalValue)
          const bValue = new Decimal(b.userLpPosition.totalValue)

          if (sortConfig.direction === 'ASC') {
            return aValue.gte(bValue) ? -1 : 1
          }
          return aValue.lte(bValue) ? -1 : 1
        }
        if (mintA && mintB) { // don't have both so keep current sort
          if ((a.mintA.address === mintA && a.mintB.address === mintB) ||
            (a.mintB.address === mintA && a.mintA.address === mintB)) {
            return -1
          } else if ((b.mintA.address === mintA && b.mintB.address === mintB) ||
            (b.mintB.address === mintA && b.mintA.address === mintB)) {
            return 1
          }
        }
        return 0
      })
    return { filteredPools: newPools }
  }, [pools, lpPositions, showDeposited, base58PublicKey, showCreatedPools, selectedTokens, sortConfig])

  useEffect(() => {
    if (!base58PublicKey || filteredPools.length == 0 || !selectedCard?.id) return
    const pool = filteredPools.filter((pool) => pool.id === selectedCard.id)
    if (pool.length == 0) return
    setSelectedCard(pool[0])
  }, [base58PublicKey, filteredPools])

  const isSearchActive = searchTokens.trim().length > 0
  const forceCronAndUpdateLocalData = async (txSig?: string) => {
    const result = txSig ? await forceCronUpdateWithConnectionAndTxSig(connection, txSig) : await forceCronUpdate();

    if (!result) return
    getUserLpPositions()
    // will trigger updatePool useEffect
    updatePools({ page: 1, pageSize: POOL_LIST_PAGE_SIZE }, false)
    setPoolPage(1)
  }
  const computedViewRange = viewRange == 0 ? '24H' : viewRange == 1 ? '7D' : '30D'

  const topBalancesWithTokenList: JupToken[] = useMemo(() => {
    const data = []
    const hasTokenSet = new Set()
    for (const tokenBalance of topBalances) {
      if (!hasTokenSet.has(tokenBalance.mint)) {
        hasTokenSet.add(tokenBalance.mint)
        data.push({
          ...tokenBalance,
          address: tokenBalance.mint
        })
      }
    }
    for (const token of tokenList) {
      if (!hasTokenSet.has(token.address)) {
        data.push(token)
      }
    }
    return data.sort((a, b) => (balance[a.address].value.gt(balance[b.address].value) ? -1 : 1))
  }, [topBalances, tokenList, balance])

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
        totalPoolCount,
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
        setIsConfettiVisible,
        forceCronAndUpdateLocalData,
        updateUserLpPositions: getUserLpPositions,
        setViewRange,
        viewRange,
        computedViewRange,
        handlePoolSort,
        topBalancesWithTokenList,
        calculatePoolType,
        selectedTokens,
        addSelectedToken,
        removeSelectedToken,
        hasSelectedToken,
        clearAllSelectedTokens,
        setTokenList,
        isPortfolio,
        setIsPortfolio,
        isCardMode,
        setIsCardMode
      }}
    >
      {children}
    </GAMMAContext.Provider>
  )
}

export const useGamma = (): GAMMADataModel => useContext(GAMMAContext)
