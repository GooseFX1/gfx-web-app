import {
  FC,
  useState,
  ReactNode,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback
} from 'react'
import { usePriceFeedFarm } from '.'
import {
  ADDRESSES,
  poolType,
  Pool,
  SSLToken,
  SSLTableData,
  GET_24_CHANGES,
  // IS_WHITELIST,
  TOTAL_VOLUME,
  TOTAL_FEES
} from '../pages/FarmV3/constants'
import { getLiquidityAccountKey, getPoolRegistryAccountKeys, getsslPoolSignerKey } from '../web3/sslV2'
import { useConnectionConfig } from './settings'
import { httpClient } from '../api'
import { PublicKey } from '@solana/web3.js'
import useSolSub, { SubType } from '../hooks/useSolSub'
import { useWalletBalance } from '@/context/walletBalanceContext'

interface SSLData {
  pool: Pool
  setPool: Dispatch<SetStateAction<Pool>>
  sslData: SSLToken[]
  setSslData: Dispatch<SetStateAction<SSLToken[]>>
  filteredLiquidityAccounts: any
  setFilteredLiquidityAccounts: any
  operationPending: boolean
  setOperationPending: Dispatch<SetStateAction<boolean>>
  isTxnSuccessfull: boolean
  setIsTxnSuccessfull: Dispatch<SetStateAction<boolean>>
  liquidityAmount: any
  setLiquidityAmount: any
  allPoolSslData: SSLToken[]
  setAllPoolSslData: Dispatch<SetStateAction<SSLToken[]>>
  sslTableData: SSLTableData
  sslAllVolume: any
  sslTotalFees: string
  // isWhitelisted: boolean
  rewards: any
  isFirstPoolOpen: boolean
  setIsFirstPoolOpen: Dispatch<SetStateAction<boolean>>
  allPoolFilteredLiquidityAcc: any
  depositedBalanceConnection: any
  connectionId: string
}

const SSLContext = createContext<SSLData | null>(null)

export const SSLProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { network, connection } = useConnectionConfig()
  const { SSLProgram } = usePriceFeedFarm()
  const {publicKey:publicKey} = useWalletBalance()
  const [sslData, setSslData] = useState<SSLToken[]>([])
  const [allPoolSslData, setAllPoolSslData] = useState<SSLToken[]>([])
  const [liquidityAccounts, setLiquidityAccounts] = useState([])
  const [allPoolLiquidityAcc, setAllPoolLiquidityAcc] = useState([])
  const [allPoolFilteredLiquidityAcc, setAllPoolFilteredLiquidityAcc] = useState({})
  const [filteredLiquidityAccounts, setFilteredLiquidityAccounts] = useState({})
  const [rewards, setRewards] = useState({})
  const [liquidityAmount, setLiquidityAmount] = useState({})
  const [pool, setPool] = useState<Pool>(poolType.all)
  const [operationPending, setOperationPending] = useState<boolean>(false)
  const [isTxnSuccessfull, setIsTxnSuccessfull] = useState<boolean>(false)
  const [sslTableData, setTableData] = useState<SSLTableData>(null)
  const [sslAllVolume, setSslAllVolume] = useState<any>(null)
  const [sslTotalFees, setSslTotalFees] = useState<string>(null)
  const [isFirstPoolOpen, setIsFirstPoolOpen] = useState<boolean>(false)
  const [connectionId, setConnectionId] = useState<string>()
  const { on, off } = useSolSub()

  useEffect(() => {
    ;(async () => {
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
    ;(async () => {
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
    ;(async () => {
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
  }, [publicKey, allPoolSslData, isTxnSuccessfull])

  useEffect(() => {
    ;(async () => {
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

  // useEffect(() => {
  //   if (publicKey) isWhitelistApi()
  // }, [publicKey])

  useEffect(() => {
    ;(async () => {
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

  function isEmpty(obj: Record<string, unknown>) {
    if (!obj) return true
    return Object.keys(obj).length == 0
  }

  useEffect(() => {
    if (
      allPoolFilteredLiquidityAcc &&
      !isEmpty(allPoolFilteredLiquidityAcc) &&
      allPoolSslData &&
      allPoolSslData.length
    ) {
      const tempRewards = {}
      for (let i = 0; i < allPoolSslData.length; i++) {
        const mint = allPoolSslData[i]?.mint?.toBase58()
        if (!allPoolFilteredLiquidityAcc[mint]) {
          tempRewards[mint] = null
        } else {
          const liqForMint = allPoolFilteredLiquidityAcc[mint]
          const diff = allPoolSslData[i].totalAccumulatedLpReward.sub(liqForMint.lastObservedTap)
          const numerator = diff.mul(liqForMint.amountDeposited)
          const answer = numerator.div(allPoolSslData[i].totalLiquidityDeposits)
          tempRewards[mint] = answer
        }
      }
      setRewards(tempRewards)
    } else setRewards({})
  }, [allPoolFilteredLiquidityAcc])

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
    ;(async () => {
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
  }, [allPoolSslData, isTxnSuccessfull])

  const depositedBalanceConnection = useCallback(
    async (userPublicKey: PublicKey, coin: SSLToken) => {
      const id = `deposit-${coin?.name}`
      const liquidityAcc = await getLiquidityAccountKey(userPublicKey, coin?.mint)
      on({
        SubType: SubType.AccountChange,
        id,
        callback: async (info) => {
          const updatedLiqAcc = await SSLProgram.coder.accounts.decode('LiquidityAccount', info.data)
          const mintAddress = coin.mint.toBase58()
          setConnectionId(id)
          const updatedFilteredLiqAcc = {
            ...filteredLiquidityAccounts,
            [mintAddress]: updatedLiqAcc
          }
          setFilteredLiquidityAccounts(updatedFilteredLiqAcc)
          off(id)
        },
        publicKey: liquidityAcc
      })
    },
    [on, SSLProgram, filteredLiquidityAccounts, getLiquidityAccountKey]
  )

  return (
    <SSLContext.Provider
      value={{
        pool: pool,
        sslData: sslData,
        setSslData: setSslData,
        setPool: setPool,
        filteredLiquidityAccounts: filteredLiquidityAccounts,
        setFilteredLiquidityAccounts: setFilteredLiquidityAccounts,
        operationPending: operationPending,
        setOperationPending: setOperationPending,
        isTxnSuccessfull: isTxnSuccessfull,
        setIsTxnSuccessfull: setIsTxnSuccessfull,
        liquidityAmount: liquidityAmount,
        setLiquidityAmount: setLiquidityAmount,
        allPoolSslData: allPoolSslData,
        setAllPoolSslData: setAllPoolSslData,
        sslTableData: sslTableData,
        sslAllVolume: sslAllVolume,
        sslTotalFees: sslTotalFees,
        // isWhitelisted: isWhitelisted,
        rewards: rewards,
        isFirstPoolOpen: isFirstPoolOpen,
        setIsFirstPoolOpen: setIsFirstPoolOpen,
        allPoolFilteredLiquidityAcc: allPoolFilteredLiquidityAcc,
        depositedBalanceConnection: depositedBalanceConnection,
        connectionId: connectionId
      }}
    >
      {children}
    </SSLContext.Provider>
  )
}

export const useSSLContext = (): SSLData => {
  const context = useContext(SSLContext)
  if (!context) {
    throw new Error('Missing SSL Context')
  }
  return context
}
