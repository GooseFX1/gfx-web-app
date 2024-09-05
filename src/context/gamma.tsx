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
  fetchGAMMAConfig,
  fetchLpPositions,
  fetchPools,
  fetchPortfolioStats,
  fetchUser
} from '../api/gamma'
import { GAMMAConfig, GAMMAProtocolStats, GAMMAUser, UserPortfolioLPPosition, UserPortfolioStats } from '../types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import {
  ADDRESSES,
  BASE_SLIPPAGE,
  GAMMA_SORT_CONFIG,
  GET_24_CHANGES,
  ModeOfOperation,
  Pool,
  poolType,
  SSLTableData,
  SSLToken,
  TOKEN_LIST_PAGE_SIZE,
  TOTAL_FEES,
  TOTAL_VOLUME
} from '../pages/FarmV4/constants'
import { getLiquidityAccountKey, getPoolRegistryAccountKeys, getsslPoolSignerKey } from '../web3/sslV2'
import { usePriceFeedFarm } from '.'
import { useConnectionConfig } from './settings'
import { httpClient } from '../api'
import { getpoolId } from '@/web3/Farm'
import { GAMMA_API_BASE, GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'

interface GAMMADataModel {
  gammaConfig: GAMMAConfig
  aggregateStats: GAMMAProtocolStats
  pools: any[]
  user: GAMMAUser
  portfolioStats: UserPortfolioStats
  lpPositions: UserPortfolioLPPosition[]
  GAMMA_SORT_CONFIG: { id: string, name: string }[]
  slippage: number
  setSlippage: Dispatch<SetStateAction<number>>
  isCustomSlippage: boolean
  selectedCard: any
  setSelectedCard: Dispatch<SetStateAction<any>>
  openDepositWithdrawSlider: boolean
  setOpenDepositWithdrawSlider: Dispatch<SetStateAction<boolean>>
  pool: Pool
  setPool: Dispatch<SetStateAction<Pool>>
  allPoolSslData: SSLToken[]
  sslData: SSLToken[]
  sslTableData: SSLTableData
  sslAllVolume: any
  sslTotalFees: string
  allPoolFilteredLiquidityAcc: any
  liquidityAmount: any
  filteredLiquidityAccounts: any
  setFilteredLiquidityAccounts: any
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
}
export type TokenListToken = {
  "address": string,
  "name": string,
  "symbol": string,
  "decimals": number,
  "logoURI": string,
  "tags": string[],
  "daily_volume": number|null,
  "freeze_authority": string|null,
  "mint_authority": string|null
}
const GAMMAContext = createContext<GAMMADataModel | null>(null)
export const GammaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey: publicKey } = useWalletBalance()
  const [gammaConfig, setGammaConfig] = useState<GAMMAConfig | null>(null)
  const [aggregateStats, setAggregateStats] = useState<GAMMAProtocolStats | null>(null)
  const [pools, setPools] = useState<any[] | null>(null)
  const [user, setUser] = useState<GAMMAUser | null>(null)
  const [portfolioStats, setPortfolioStats] = useState<UserPortfolioStats | null>(null)
  const [lpPositions, setLpPositions] = useState<UserPortfolioLPPosition[] | null>(null)
  const [slippage, setSlippage] = useState<number>(0.1)
  const [selectedCard, setSelectedCard] = useState<any>({})
  const [openDepositWithdrawSlider, setOpenDepositWithdrawSlider] = useState<boolean>(false)
  const [pool, setPool] = useState<Pool>(poolType.primary)
  const [sslData, setSslData] = useState<SSLToken[]>([])
  const [allPoolSslData, setAllPoolSslData] = useState<SSLToken[]>([])
  const { SSLProgram, GammaProgram } = usePriceFeedFarm()
  const { network, connection } = useConnectionConfig()
  const [sslTableData, setTableData] = useState<SSLTableData>(null)
  const [sslAllVolume, setSslAllVolume] = useState<any>(null)
  const [sslTotalFees, setSslTotalFees] = useState<string>(null)
  const [allPoolFilteredLiquidityAcc, setAllPoolFilteredLiquidityAcc] = useState({})
  const [liquidityAccounts, setLiquidityAccounts] = useState([])
  const [filteredLiquidityAccounts, setFilteredLiquidityAccounts] = useState({})
  const [allPoolLiquidityAcc, setAllPoolLiquidityAcc] = useState([])
  const [liquidityAmount, setLiquidityAmount] = useState({})
  const [selectedCardPool, setSelectedCardPool] = useState({})
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [maxTokensReached, setMaxTokensReached] = useState(false)
  const isCustomSlippage = useMemo(() =>
    !BASE_SLIPPAGE.includes(slippage)
    , [slippage])

  const [tokenList, setTokenList] = useState<TokenListToken[]>([])
  const [page, setPage] = useState(1)
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(false)
  useEffect(()=>{
    // first render only
    if (tokenList.length == 0) {
      setIsLoadingTokenList(true)
      updateTokenList(1, TOKEN_LIST_PAGE_SIZE)
    }
  },[])

  const fetchTokenList = async (page: number, pageSize: number) => {
    setIsLoadingTokenList(true)
    return fetch(`${GAMMA_API_BASE}${GAMMA_ENDPOINTS_V1.TOKEN_LIST}?pageSize=${pageSize}&page=${page}`)
      .then(async (res) => res.json()).catch((e) => {
        console.log('Error fetching token list', e)
        return null
      }).finally(()=>setIsLoadingTokenList(false))

  }
  const updateTokenList = async (page: number, pageSize: number) => {
    const response = await fetchTokenList(page, pageSize) as {
      data: {
        tokens: TokenListToken[],
        count: number,
        currentPage: number,
        pageSize: number,
        totalItems: number,
        totalPages
      },
      success: boolean
    }
    if (!response || !response.success) {
      return
    }
    setMaxTokensReached(response.data.totalPages <= response.data.currentPage)
    const currentTokenList = tokenList
    const hasSetOfTokens = new Set(tokenList.map((token) => token.address))
    for (const token of response.data.tokens) {
      if (hasSetOfTokens.has(token.address)){continue}
      hasSetOfTokens.add(token.address)
      currentTokenList.push(token)
    }
    console.log({ currentTokenList })
    setTokenList([...currentTokenList])
  }
  useLayoutEffect(()=>{
    updateTokenList(page,TOKEN_LIST_PAGE_SIZE)
  },[page])
  useEffect(() => {
    ; (async () => {
      if (SSLProgram) {
        const liquidityAmountsArray = {}
        for (const token of allPoolSslData) {
          try {
            const sslAccountKey = await getsslPoolSignerKey(token.mint)
            const response = await connection.getParsedTokenAccountsByOwner(sslAccountKey, {
              mint: token.mint
            })
            const liquidityAmount = response?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount
            liquidityAmountsArray[token?.mint?.toBase58()] = liquidityAmount
          } catch (e) {
            console.error('Error fetching liquidity values', e)
            liquidityAmountsArray[token?.mint?.toBase58()] = 0
          }
        }
        setLiquidityAmount(liquidityAmountsArray)
      }
    })()
  }, [allPoolSslData])

  //Call API to get ssl table data. Need to run only once
  useEffect(() => {
    const getSSLTableData = async () => {
      try {
        const res = await httpClient('api-services').post(`${GET_24_CHANGES}`, {
          devnet: false
        })
        const data = res.data
        setTableData(data)
      } catch (e) {
        setTableData(null)
      }
    }

    const getAllVolume = async () => {
      try {
        const res = await httpClient('api-services').post(`${TOTAL_VOLUME}`, {
          devnet: false
        })
        const data = res.data
        setSslAllVolume(data)
      } catch (e) {
        setSslAllVolume(null)
      }
    }

    const getTotalFees = async () => {
      try {
        const res = await httpClient('api-services').post(`${TOTAL_FEES}`, {
          devnet: false
        })
        const data = res.data
        setSslTotalFees(data)
      } catch (e) {
        setSslTotalFees(null)
      }
    }

    getSSLTableData(), getAllVolume(), getTotalFees()
  }, [])

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
    fetchPools().then((poolsData) => {
      if (poolsData) setPools(poolsData)
    })
  }, [fetchPools])

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

  useEffect(() => {
    ; (async () => {
      if (GammaProgram && Object.keys(selectedCard)?.length > 0) {
        try {
          const poolIdKey = getpoolId(selectedCard)
          const gammaPool = await GammaProgram?.account?.poolState?.fetch(poolIdKey)
          setSelectedCardPool(gammaPool)
        } catch (e) {
          console.log(e)
        }
      }
    })()
  }, [GammaProgram, selectedCard])

  useEffect(() => {
    ; (async () => {
      if (SSLProgram) {
        try {
          const sslPoolEntries = []
          const allPoolentries = []
          const poolRegistryAccountKey = await getPoolRegistryAccountKeys()
          const sslPool = await SSLProgram.account.poolRegistry.fetch(poolRegistryAccountKey)
          sslPool.entries.forEach((token: any) =>
            ADDRESSES[network].forEach((farm) => {
              if (token?.mint?.toBase58() === farm?.address?.toBase58()) {
                const sslToken = {
                  ...token,
                  token: farm.token,
                  name: farm.name,
                  cappedDeposit: farm.cappedDeposit
                }
                allPoolentries.push(sslToken)
                if (token.assetType === pool.index) sslPoolEntries.push(sslToken)
                else if (pool.index === 4) sslPoolEntries.push(sslToken)
              }
            })
          )
          setSslData(sslPoolEntries)
          setAllPoolSslData(allPoolentries)
        } catch (e) {
          console.log(e)
        }
      }
    })()
  }, [SSLProgram])

  useEffect(() => {
    const filteredPoolData = []
    allPoolSslData.forEach((token: any) => {
      if (token.assetType === pool.index) filteredPoolData.push(token)
      else if (pool.index === 4) filteredPoolData.push(token)
    })
    setSslData(filteredPoolData)
  }, [pool])

  useEffect(() => {
    ; (async () => {
      try {
        if (allPoolLiquidityAcc) {
          const filteredData = {}
          ADDRESSES[network].forEach((pool: any) => {
            let found = false
            for (let i = 0; i < allPoolLiquidityAcc.length; i++) {
              const account = allPoolLiquidityAcc[i]
              if (account?.mint?.toBase58() === pool?.address?.toBase58()) {
                filteredData[pool.address] = account
                found = true
              }
            }
            if (!found) filteredData[pool.address] = null
          })
          setAllPoolFilteredLiquidityAcc(filteredData)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [allPoolLiquidityAcc])

  useEffect(() => {
    ; (async () => {
      try {
        if (liquidityAccounts) {
          const filteredData = {}
          ADDRESSES[network].forEach((pool: any) => {
            let found = false
            for (let i = 0; i < liquidityAccounts.length; i++) {
              const account = liquidityAccounts[i]
              if (account?.mint?.toBase58() === pool?.address?.toBase58()) {
                filteredData[pool.address] = account
                found = true
              }
            }
            if (!found) filteredData[pool.address] = null
          })
          setFilteredLiquidityAccounts(filteredData)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [liquidityAccounts])

  useEffect(() => {
    ; (async () => {
      if (SSLProgram) {
        const liquidityData = []
        if (publicKey !== null) {
          for (const token of sslData) {
            try {
              const liquidityAccountKey = await getLiquidityAccountKey(publicKey, token?.mint)
              const liquidityAccount = await SSLProgram?.account?.liquidityAccount?.fetch(liquidityAccountKey)
              liquidityData.push(liquidityAccount)
            } catch (e) {
              console.error('SetLiquidityAccounts', e)
            }
          }
        }
        setLiquidityAccounts(liquidityData)
      }
    })()
  }, [publicKey, sslData])

  useEffect(() => {
    ; (async () => {
      if (SSLProgram) {
        const liquidityData = []
        if (publicKey !== null) {
          for (const token of allPoolSslData) {
            try {
              const liquidityAccountKey = await getLiquidityAccountKey(publicKey, token?.mint)
              const liquidityAccount = await SSLProgram?.account?.liquidityAccount?.fetch(liquidityAccountKey)
              liquidityData.push(liquidityAccount)
            } catch (e) {
              console.error('SetAllPoolLiquidityAcc', e)
            }
          }
        }
        setAllPoolLiquidityAcc(liquidityData)
      }
    })()
  }, [publicKey, allPoolSslData])

  return (
    <GAMMAContext.Provider
      value={{
        gammaConfig,
        aggregateStats,
        pools,
        user,
        portfolioStats,
        lpPositions,
        GAMMA_SORT_CONFIG,
        slippage,
        setSlippage,
        isCustomSlippage,
        selectedCard: selectedCard,
        setSelectedCard: setSelectedCard,
        openDepositWithdrawSlider: openDepositWithdrawSlider,
        setOpenDepositWithdrawSlider: setOpenDepositWithdrawSlider,
        sslData: sslData,
        setPool: setPool,
        pool: pool,
        allPoolSslData: allPoolSslData,
        sslTableData: sslTableData,
        sslAllVolume: sslAllVolume,
        sslTotalFees: sslTotalFees,
        allPoolFilteredLiquidityAcc: allPoolFilteredLiquidityAcc,
        liquidityAmount: liquidityAmount,
        filteredLiquidityAccounts: filteredLiquidityAccounts,
        setFilteredLiquidityAccounts: setFilteredLiquidityAccounts,
        selectedCardPool: selectedCardPool,
        modeOfOperation: modeOfOperation,
        setModeOfOperation: setModeOfOperation,
        setSelectedCardPool: setSelectedCardPool,
        page,
        setPage,
        tokenList,
        isLoadingTokenList,
        updateTokenList,
        maxTokensReached
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
