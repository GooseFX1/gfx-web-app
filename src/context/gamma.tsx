import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import { fetchTokenList, forceCronUpdate, forceCronUpdateWithConnectionAndTxSig } from '@/api/gamma'
import { GAMMAPool, GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import {
  BASE_SLIPPAGE,
  GAMMA_MAIN_SORT_CONFIG_DEFAULT,
  GAMMA_MAIN_SORT_CONFIG_MAP,
  GAMMA_PORTFOLIO_SORT_CONFIG_DEFAULT,
  GAMMA_PORTFOLIO_SORT_CONFIG_MAP,
  GAMMA_SORT_CONFIG_PUBKEY_REQUIRED,
  GAMMASortConfig,
  JupToken,
  ModeOfOperation
} from '@/pages/FarmV4/constants'
import { useConnectionConfig } from './settings'
import { aborter } from '@/utils'
import usePrevious from '@/hooks/usePrevious'
import useMultiSelect from '@/hooks/useMultiSelect'
import useUserLiquidityQuery from '@/queries/GAMMA/user/useUserLiquidityQuery'
import usePoolsQuery, { UsePoolQueryResponse } from '@/queries/GAMMA/pools/usePoolsQuery'
import { getSortKey } from '@/queries/GAMMA/gammaQueries.helpers'
import useUserPortfolioPools from '@/queries/GAMMA/pools/useUserPortfolioPools'
import usePoolDeepLink from '@/hooks/gamma/usePoolDeepLink'
import useSelectPoolBySymbols from '@/queries/GAMMA/pools/useSelectPoolBySymbols'
import useSearchParams from '@/hooks/useSearchParams'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '@/Router'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'

type ViewRange = 0 | 1 | 2

interface GAMMADataModel {
  slippage: number
  setSlippage: Dispatch<SetStateAction<number>>
  isCustomSlippage: boolean
  selectedCard: any
  openDepositWithdrawSlider: boolean
  setOpenDepositWithdrawSlider: Dispatch<SetStateAction<boolean>>
  modeOfOperation: string
  setModeOfOperation: Dispatch<SetStateAction<string>>
  totalPoolCount: number
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
  isLoadingPools: boolean
  isSearchActive: boolean
  filteredPools: GAMMAPoolWithUserLiquidity[]
  maxPoolsReached: boolean
  sortConfig: GAMMASortConfig
  createPoolType: string
  setCreatePoolType: Dispatch<SetStateAction<string>>
  isConfettiVisible: boolean
  setIsConfettiVisible: Dispatch<SetStateAction<boolean>>
  forceCronAndUpdateLocalData: (txSig?: string) => Promise<void>
  viewRange: ViewRange
  setViewRange: Dispatch<SetStateAction<ViewRange>>
  computedViewRange: '24H' | '7D' | '30D'
  handlePoolSort: (id: string) => void
  calculatePoolType: Set<string>
  selectedTokens: TokenListToken[]
  addSelectedToken: (token: JupToken) => void
  removeSelectedToken: (token: JupToken) => void
  hasSelectedToken: (token: JupToken) => boolean
  clearAllSelectedTokens: () => void
  isPortfolio: boolean
  setIsPortfolio: (val: boolean) => void
  isCardMode: string
  setIsCardMode: Dispatch<SetStateAction<string>>
  poolsQuery: UsePoolQueryResponse
  referralCode: string | null
  updateGammaRoute: (pool?: GAMMAPool) => void
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
  isLST: boolean
  isPrimary: boolean
}

const GAMMAContext = createContext<GAMMADataModel | null>(null)
export const GammaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { userCache, connection, updateUserCache } = useConnectionConfig()
  const { publicKey } = useWalletBalance()
  const history = useHistory()

  const [slippage, setSlippage] = useState<number>(0.1)
  const [selectedCard, setSelectedCard] = useState<any>({})

  const [openDepositWithdrawSlider, setOpenDepositWithdrawSlider] = useState<boolean>(false)
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false)
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [showCreatedPools, setShowCreatedPools] = useState<boolean>(userCache.gamma.showCreatedFilter)
  const [currentSort, setCurrentSortState] = useState<string>(userCache.gamma.currentSort)
  const [showDeposited, setShowDeposited] = useState<boolean>(userCache.gamma.showDepositedFilter)
  const isCustomSlippage = useMemo(() => !BASE_SLIPPAGE.includes(slippage), [slippage])

  const isPortfolio = useMemo(
    () => history.location.pathname.includes(ROUTES.GAMMA_PORTFOLIO),
    [history.location.pathname.includes(ROUTES.GAMMA_PORTFOLIO)]
  )
  const setIsPortfolio = useCallback((v: boolean) => {
    const route = v ? ROUTES.GAMMA_PORTFOLIO : ROUTES.GAMMA
    history.replace({
      pathname: route
    })
  }, [])

  const [calculatePoolType, setCalculatePoolType] = useState<Set<string>>(new Set())

  const userLiqQuery = useUserLiquidityQuery()

  const {
    searchParams,
    operators: { getByPartialKey }
  } = useSearchParams<{
    ref?: string
    referralCode?: string
    referral_code?: string
    REFERRAL_CODE?: string
    REF?: string
  }>()

  const supportedReferralCodes = useQuery({
    queryKey: [QUERY_KEY, 'gamma-ref-codes', searchParams],
    queryFn: async () => {
      console.log('THIS PROCESSES AND GETS APPLICABLE REF CODES')

      return []
    },
    staleTime: Infinity
  })
  const referralCode = useMemo(() => {
    const ref = getByPartialKey('ref')
    console.log('REF', ref)
    if (!ref) return null
    const code = ref.toString().trim().toLowerCase() // empty string
    if (!code) return null
    if (
      supportedReferralCodes.isSuccess &&
      supportedReferralCodes.data &&
      supportedReferralCodes.data.includes(code)
    ) {
      return code
    }
    return null
  }, [searchParams, supportedReferralCodes])

  useLayoutEffect(() => setOpenDepositWithdrawSlider(Object.keys(selectedCard).length > 0), [selectedCard])

  const setCurrentSort = (value: string) => {
    let sortValue = value
    if (!publicKey && isPortfolio && !GAMMA_PORTFOLIO_SORT_CONFIG_MAP.has(value)) {
      sortValue = GAMMA_PORTFOLIO_SORT_CONFIG_DEFAULT
    } else if (!isPortfolio && !GAMMA_MAIN_SORT_CONFIG_MAP.has(value)) {
      sortValue = GAMMA_MAIN_SORT_CONFIG_DEFAULT
    }

    setCurrentSortState((prevState) => {
      if (prevState === sortValue) {
        return prevState
      }
      updateUserCache({
        gamma: {
          ...userCache.gamma,
          currentSort: sortValue
        }
      })
      // sets value to context
      return sortValue
    })
  }
  useLayoutEffect(() => {
    if (!publicKey) {
      if (GAMMA_SORT_CONFIG_PUBKEY_REQUIRED.includes(userCache.gamma.currentSort)) {
        setCurrentSort(GAMMA_MAIN_SORT_CONFIG_DEFAULT)
      }
    }
  }, [publicKey, userCache])
  const [createPoolType, setCreatePoolType] = useState<string>('')
  const [isConfettiVisible, setIsConfettiVisible] = useState<boolean>(false)
  const [viewRange, setViewRange] = useState<ViewRange>(0)
  const sortConfig = useMemo(() => {
    const choice = isPortfolio
      ? GAMMA_PORTFOLIO_SORT_CONFIG_MAP.get(currentSort)
      : GAMMA_MAIN_SORT_CONFIG_MAP.get(currentSort)
    if (!choice) {
      return isPortfolio
        ? GAMMA_PORTFOLIO_SORT_CONFIG_MAP.get(GAMMA_PORTFOLIO_SORT_CONFIG_DEFAULT)
        : GAMMA_MAIN_SORT_CONFIG_MAP.get(GAMMA_MAIN_SORT_CONFIG_DEFAULT)
    }
    return choice
  }, [currentSort, isPortfolio])
  const [isCardMode, setIsCardMode] = useState<string>(userCache.gamma.viewMode)
  const prevIsCardMode = usePrevious(isCardMode)
  const {
    choices: selectedTokens,
    addChoice: addSelectedToken,
    removeChoice: removeSelectedToken,
    hasChoice: hasSelectedToken,
    clearAllChoices: clearAllSelectedTokens
  } = useMultiSelect<TokenListToken, string>({
    uniqueValueSelector: (token) => token.address
  })
  const sortBy = getSortKey(sortConfig, isPortfolio, viewRange)

  const poolsQuery = usePoolsQuery({
    mintA: selectedTokens[0]?.address,
    mintB: selectedTokens[1]?.address,
    sortBy: sortBy,
    sortDirection: sortConfig.direction.toLowerCase(),
    showCreated: showCreatedPools,
    showDeposited,
    enabled: !isPortfolio && sortBy != 'portfolio'
  })
  const portfolioPoolsQuery = useUserPortfolioPools({
    mintA: selectedTokens[0]?.address,
    mintB: selectedTokens[1]?.address,
    sortBy: getSortKey(sortConfig, isPortfolio, viewRange),
    sortDirection: sortConfig.direction.toLowerCase(),
    showCreated: showCreatedPools,
    enabled: isPortfolio
  })
  const totalPoolCount = poolsQuery.data.totalItems
  const isLoadingPools =
    poolsQuery.isFetching ||
    poolsQuery.isLoading ||
    poolsQuery.isFetchingPreviousPage ||
    poolsQuery.isFetchingNextPage
  const maxPoolsReached = poolsQuery?.data.maxPagesReached

  const handlePoolSort = useCallback(
    (id: string) => {
      // persists current sort in local storage
      setCurrentSort(id)
    },
    [setCurrentSort, userCache]
  )

  const [deepLink] = usePoolDeepLink()
  // monitor incase we don't have the pool in local cache
  const localPool: GAMMAPoolWithUserLiquidity = useMemo(() => {
    const data = isPortfolio ? portfolioPoolsQuery : poolsQuery
    for (const p of data.data?.allPages ?? []) {
      if (!p) continue
      if (p.mintA.symbol == deepLink.symbolA && p.mintB.symbol == deepLink.symbolB) {
        return p
      }
    }
    // guarding against unneeded requests
    if (data.isLoading) return { id: 'LOADING' } as GAMMAPoolWithUserLiquidity
    return { id: 'NOT_FOUND' } as GAMMAPoolWithUserLiquidity
  }, [isPortfolio, poolsQuery, portfolioPoolsQuery, selectedCard])

  const selectPoolByDeeplinkQuery = useSelectPoolBySymbols({
    symbolA: deepLink.symbolA,
    symbolB: deepLink.symbolB,
    enabled: localPool?.id == 'NOT_FOUND'
  })
  useLayoutEffect(() => {
    // if local pool exists
    if (localPool.id != selectedCard?.id && localPool.id != 'NOT_FOUND' && localPool.id != 'LOADING') {
      setSelectedCard(localPool)
      return
    }
    // if URL params
    if (deepLink.symbolA && deepLink.symbolB) {
      // if we have a result set pool
      if (selectPoolByDeeplinkQuery.isSuccess && selectPoolByDeeplinkQuery.data) {
        // if is portfolio & liq data
        if (!isPortfolio || selectPoolByDeeplinkQuery.data.userLpPosition != undefined) {
          setSelectedCard(selectPoolByDeeplinkQuery.data)
        } else if (userLiqQuery.isSuccess && selectedCard?.id != '' && selectedCard?.id != undefined) {
          // no user liquidity data for this pool
          updateGammaRoute()
        }
      }
    } else if (selectedCard?.id != '' && selectedCard?.id != undefined) {
      // if no URL params, but we have card unset
      setSelectedCard({})
    }
  }, [
    selectPoolByDeeplinkQuery,
    deepLink,
    isPortfolio,
    userLiqQuery,
    localPool,
    portfolioPoolsQuery,
    poolsQuery,
    selectedCard
  ])
  useEffect(() => {
    if (!isCardMode && prevIsCardMode !== isCardMode) {
      // reset based on mode
      if (viewRange != 0) {
        setViewRange(0)
      }
    }
  }, [isCardMode, viewRange, currentSort, prevIsCardMode, isPortfolio])
  useEffect(() => {
    if (calculatePoolType.size == 0) {
      const abortSig = 'tokenListCalcPoolTypeGamma'
      const signal = aborter.addSignal(abortSig)
      // fetch primary tokens for type calculation on create pool
      fetchTokenList(1, 200, 'primary', undefined, signal).then((t) => {
        if (t.success) {
          const primaryTokensMap = new Set(t.data.tokens.map((token) => token.address))
          setCalculatePoolType(primaryTokensMap)
        }
      })
    }
  }, [])

  const isSearchActive = searchTokens.trim().length > 0
  const forceCronAndUpdateLocalData = async (txSig?: string) => {
    const result = txSig ? await forceCronUpdateWithConnectionAndTxSig(connection, txSig) : await forceCronUpdate()

    if (!result) return
    userLiqQuery.refetch()
    // will trigger updatePool useEffect
    if (!isPortfolio) {
      poolsQuery.refetch()
    } else {
      portfolioPoolsQuery.refetch()
    }
  }
  useEffect(() => {
    if (isPortfolio && !GAMMA_PORTFOLIO_SORT_CONFIG_MAP.has(currentSort)) {
      setCurrentSort(GAMMA_PORTFOLIO_SORT_CONFIG_DEFAULT)
    } else if (!isPortfolio && !GAMMA_MAIN_SORT_CONFIG_MAP.has(currentSort)) {
      setCurrentSort(GAMMA_MAIN_SORT_CONFIG_DEFAULT)
    }
  }, [isPortfolio, currentSort])
  const computedViewRange = viewRange == 0 ? '24H' : viewRange == 1 ? '7D' : '30D'
  const updateGammaRoute = useCallback(
    (pool?: GAMMAPool) => {
      const baseRoute = isPortfolio ? ROUTES.GAMMA_PORTFOLIO : ROUTES.GAMMA
      const route = !pool ? baseRoute : `${baseRoute}/${pool.mintA.symbol}-${pool.mintB.symbol}`

      if (route != history.location.pathname) {
        history.replace({
          pathname: route
        })
      }
    },
    [history, isPortfolio]
  )
  return (
    <GAMMAContext.Provider
      value={{
        slippage,
        setSlippage,
        isCustomSlippage,
        selectedCard,
        openDepositWithdrawSlider,
        setOpenDepositWithdrawSlider,
        modeOfOperation,
        setModeOfOperation,
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
        totalPoolCount,
        isSearchActive,
        maxPoolsReached,
        sortConfig,
        createPoolType,
        setCreatePoolType,
        isConfettiVisible,
        setIsConfettiVisible,
        forceCronAndUpdateLocalData,
        setViewRange,
        viewRange,
        computedViewRange,
        handlePoolSort,
        calculatePoolType,
        selectedTokens,
        addSelectedToken,
        removeSelectedToken,
        hasSelectedToken,
        clearAllSelectedTokens,
        isPortfolio,
        setIsPortfolio,
        isCardMode,
        setIsCardMode,
        filteredPools: poolsQuery.data?.allPages ?? [],
        poolsQuery,
        referralCode,
        updateGammaRoute
      }}
    >
      {children}
    </GAMMAContext.Provider>
  )
}

export const useGamma = (): GAMMADataModel => useContext(GAMMAContext)
