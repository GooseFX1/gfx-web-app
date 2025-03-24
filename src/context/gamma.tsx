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
  GAMMA_SORT_CONFIG,
  GAMMA_SORT_CONFIG_BLACKLIST,
  GAMMA_SORT_CONFIG_MAP,
  GAMMA_SORT_CONFIG_PUBKEY_REQUIRED,
  GAMMA_SORT_PORTFOLIO_BLACKLIST,
  GAMMASortConfig,
  JupToken,
  ModeOfOperation,
  Pool,
  POOL_TYPE
} from '@/pages/FarmV4/constants'
import { usePriceFeedFarm } from '.'
import { useConnectionConfig } from './settings'
import { getLiquidityPoolKey, getpoolId } from '@/web3/Farm'
import useBoolean from '@/hooks/useBoolean'
import { aborter, clamp } from '@/utils'
import usePrevious from '@/hooks/usePrevious'
import useMultiSelect from '@/hooks/useMultiSelect'
import useUserLiquidityQuery from '@/queries/GAMMA/user/useUserLiquidityQuery'
import usePoolsQuery, { UsePoolQueryResponse } from '@/queries/GAMMA/pools/usePoolsQuery'
import { getSortKey } from '@/queries/GAMMA/gammaQueries.helpers'
import useGetAMMConfigIdQuery from '@/queries/GAMMA/pools/useGetGammaConfigIdQuery'
import useUserPortfolioPools from '@/queries/GAMMA/pools/useUserPortfolioPools'

type ViewRange = 0 | 1 | 2

interface GAMMADataModel {
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
  selectedCardLiquidityAcc: any
  setSelectedCardLiquidityAcc: Dispatch<SetStateAction<any>>
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
  const { base58PublicKey, publicKey } = useWalletBalance()

  const [slippage, setSlippage] = useState<number>(0.1)
  const [selectedCard, setSelectedCard] = useState<any>({})
  const [openDepositWithdrawSlider, setOpenDepositWithdrawSlider] = useState<boolean>(false)
  const [currentPoolType, setCurrentPoolType] = useState<Pool>(POOL_TYPE.all)
  const { GammaProgram } = usePriceFeedFarm()
  const [selectedCardPool, setSelectedCardPool] = useState<any>({})
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [sendingTransaction, setSendingTransaction] = useState<boolean>(false)
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [showCreatedPools, setShowCreatedPools] = useState<boolean>(userCache.gamma.showCreatedFilter)
  const [currentSort, setCurrentSortState] = useState<string>(userCache.gamma.currentSort)
  const [showDeposited, setShowDeposited] = useState<boolean>(userCache.gamma.showDepositedFilter)
  const isCustomSlippage = useMemo(() => !BASE_SLIPPAGE.includes(slippage), [slippage])
  const [isPortfolio, setIsPortfolio] = useBoolean(false)

  const [selectedCardLiquidityAcc, setSelectedCardLiquidityAcc] = useState<any>({})
  const [calculatePoolType, setCalculatePoolType] = useState<Set<string>>(new Set())

  const userLiqQuery = useUserLiquidityQuery()
  const ammConfigQuery = useGetAMMConfigIdQuery(0)

  const setCurrentSort = useCallback(
    (value: string) => {
      let sortValue = value;
      if (!publicKey && isPortfolio && GAMMA_SORT_PORTFOLIO_BLACKLIST.includes(value)) {
        sortValue = '9';
      } else if (!isPortfolio && GAMMA_SORT_CONFIG_BLACKLIST.includes(value)) {
        sortValue = '1';
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
    },
    [isPortfolio, publicKey]
  )
  useLayoutEffect(() => {
    if (!publicKey) {
      if (GAMMA_SORT_CONFIG_PUBKEY_REQUIRED.includes(userCache.gamma.currentSort)) {
        setCurrentSort('1')
      }
    }
  }, [publicKey, userCache])
  const [createPoolType, setCreatePoolType] = useState<string>('')
  const [isConfettiVisible, setIsConfettiVisible] = useState<boolean>(false)
  const [viewRange, setViewRange] = useState<ViewRange>(0)
  const sortConfig = useMemo(() => {
    const key = isPortfolio ? '9' : '1' // defaulting as per config
    return (
      GAMMA_SORT_CONFIG_MAP.get(key) ??
      GAMMA_SORT_CONFIG[clamp(parseInt(key) - 1, 0, GAMMA_SORT_CONFIG.length - 1)]
    )
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
    poolType: currentPoolType.type,
    enabled: !isPortfolio && sortBy != 'portfolio'
  })
  const portfolioPoolsQuery = useUserPortfolioPools({
    mintA: selectedTokens[0]?.address,
    mintB: selectedTokens[1]?.address,
    poolType: currentPoolType.type,
    sortBy: getSortKey(sortConfig, isPortfolio, viewRange),
    sortDirection: sortConfig.direction.toLowerCase(),
    showCreated: showCreatedPools,
    enabled: isPortfolio
  });
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
      if (currentSort != '1') {
        setCurrentSort('1')
      }
    }
  }, [isCardMode, viewRange, currentSort, prevIsCardMode])
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

  useEffect(() => {
    if (!isPortfolio) {
      setShowDeposited(false)
    }
  }, [isPortfolio])

  useEffect(() => {
    ;(async () => {
      if (GammaProgram && Object.keys(selectedCard)?.length > 0) {
        try {
          const poolIdKey = await getpoolId(selectedCard, ammConfigQuery.data)
          const gammaPool = await GammaProgram.account.poolState.fetch(poolIdKey)
          setSelectedCardPool(gammaPool)
        } catch (e) {
          console.log(e)
        }
      }
    })()
  }, [GammaProgram, selectedCard, ammConfigQuery.data])

  useEffect(() => {
    ;(async () => {
      if (GammaProgram && publicKey && Object.keys(selectedCard)?.length > 0) {
        try {
          const poolIdKey = await getpoolId(selectedCard, ammConfigQuery.data)
          const liquidityAccountKey = await getLiquidityPoolKey(poolIdKey, publicKey)
          const liquidityAccount = await GammaProgram?.account?.userPoolLiquidity?.fetch(liquidityAccountKey)
          setSelectedCardLiquidityAcc(liquidityAccount)
        } catch (e) {
          console.log(e)
        }
      }
    })()
  }, [GammaProgram, selectedCard, publicKey, ammConfigQuery.data])

  useEffect(() => {
    if (!base58PublicKey || poolsQuery.data?.allPages?.length == 0 || !selectedCard?.id) return
    const pool = poolsQuery.data.allPages.filter((pool) => pool.id === selectedCard.id)
    if (pool.length == 0) return
    setSelectedCard(pool[0])
  }, [base58PublicKey, poolsQuery.data])

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
        currentPoolType,
        setCurrentPoolType,
        selectedCardPool,
        modeOfOperation,
        setModeOfOperation,
        setSelectedCardPool,
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
        selectedCardLiquidityAcc,
        setSelectedCardLiquidityAcc,
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
        poolsQuery
      }}
    >
      {children}
    </GAMMAContext.Provider>
  )
}

export const useGamma = (): GAMMADataModel => useContext(GAMMAContext)
