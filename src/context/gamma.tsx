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
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
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
import useBoolean from '@/hooks/useBoolean'
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
  setSelectedCard: Dispatch<SetStateAction<any>>
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
  setIsPortfolio: { toggle: () => void; on: () => void; off: () => void; set: (value: boolean) => void }
  isCardMode: string
  setIsCardMode: Dispatch<SetStateAction<string>>
  poolsQuery: UsePoolQueryResponse
  referralCode: string | null
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
  const prevCard = usePrevious(selectedCard)
  const [openDepositWithdrawSlider, setOpenDepositWithdrawSlider] = useState<boolean>(false)
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false)
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [showCreatedPools, setShowCreatedPools] = useState<boolean>(userCache.gamma.showCreatedFilter)
  const [currentSort, setCurrentSortState] = useState<string>(userCache.gamma.currentSort)
  const [showDeposited, setShowDeposited] = useState<boolean>(userCache.gamma.showDepositedFilter)
  const isCustomSlippage = useMemo(() => !BASE_SLIPPAGE.includes(slippage), [slippage])
  const [isPortfolio, setIsPortfolio] = useBoolean(false)

  const [calculatePoolType, setCalculatePoolType] = useState<Set<string>>(new Set())

  const userLiqQuery = useUserLiquidityQuery()
  const [deepLink] = usePoolDeepLink()

  const selectPoolByDeeplinkQuery = useSelectPoolBySymbols({
    symbolA: deepLink.symbolA,
    symbolB: deepLink.symbolB
  })
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
  useEffect(() => {
    if (selectPoolByDeeplinkQuery.isSuccess && selectPoolByDeeplinkQuery.data) {
      // only set if the prev card and current card is empty - first mount - prevent cyclic setting of state
      if (
        selectedCard == null ||
          (selectedCard && !Object.keys(selectedCard).length && prevCard && !Object.keys(prevCard).length)
        ) {
        setSelectedCard(selectPoolByDeeplinkQuery.data)
      }
    }

    if (
      selectedCard.mintA != undefined &&
      selectedCard.mintB != undefined &&
      selectedCard.mintA?.symbol?.trim() !== '' &&
      selectedCard.mintB?.symbol?.trim() !== '' &&
      (selectedCard.mintA.symbol !== deepLink.symbolA ||
        selectedCard.mintB.symbol !== deepLink.symbolB ||
        selectedCard.mintA.symbol !== deepLink.symbolB ||
        selectedCard.mintB.symbol !== deepLink.symbolA)
    ) {
      if (
        `${ROUTES.GAMMA}/${selectedCard.mintA.symbol}-${selectedCard.mintB.symbol}` !== history.location.pathname
      ) {
        history.replace({
          pathname: `${ROUTES.GAMMA}/${selectedCard.mintA.symbol}-${selectedCard.mintB.symbol}`,
          search: ''
        })
      }
    }
  }, [prevCard, selectedCard, selectPoolByDeeplinkQuery, deepLink])

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

  return (
    <GAMMAContext.Provider
      value={{
        slippage,
        setSlippage,
        isCustomSlippage,
        selectedCard,
        setSelectedCard,
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
        referralCode
      }}
    >
      {children}
    </GAMMAContext.Provider>
  )
}

export const useGamma = (): GAMMADataModel => useContext(GAMMAContext)
