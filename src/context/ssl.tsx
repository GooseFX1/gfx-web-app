import { useWallet } from '@solana/wallet-adapter-react'
import { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction, useEffect } from 'react'
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
}

const SSLContext = createContext<SSLData | null>(null)

export const SSLProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { network, connection } = useConnectionConfig()
  const { SSLProgram } = usePriceFeedFarm()
  const { wallet } = useWallet()
  const [sslData, setSslData] = useState<SSLToken[]>([])
  const [allPoolSslData, setAllPoolSslData] = useState<SSLToken[]>([])
  const [liquidityAccounts, setLiquidityAccounts] = useState([])
  const [filteredLiquidityAccounts, setFilteredLiquidityAccounts] = useState({})
  const [rewards, setRewards] = useState({})
  const [liquidityAmount, setLiquidityAmount] = useState({})
  const [pool, setPool] = useState<Pool>(poolType.all)
  const [operationPending, setOperationPending] = useState<boolean>(false)
  const [isTxnSuccessfull, setIsTxnSuccessfull] = useState<boolean>(false)
  const [sslTableData, setTableData] = useState<SSLTableData>(null)
  const [sslAllVolume, setSslAllVolume] = useState<any>(null)
  const [sslTotalFees, setSslTotalFees] = useState<string>(null)
  // const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false)

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
      const data = res?.data?.data
      setSslTotalFees(data)
    } catch (e) {
      setSslTotalFees(null)
    }
  }

  // const isWhitelistApi = async () => {
  //   try {
  //     const walletAddress = wallet?.adapter?.publicKey
  //     if (walletAddress) {
  //       const res = await httpClient('api-services').post(`${IS_WHITELIST}`, {
  //         walletAddress: walletAddress?.toBase58()
  //       })
  //       const data = res.data
  //       setIsWhitelisted(data)
  //     }
  //   } catch (e) {
  //     setIsWhitelisted(false)
  //   }
  // }

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
              if (token?.mint.toBase58() === farm.address.toBase58()) {
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
        for (const token of sslData) {
          try {
            const liquidityAccountKey = await getLiquidityAccountKey(wallet?.adapter?.publicKey, token?.mint)
            const liquidityAccount = await SSLProgram?.account?.liquidityAccount?.fetch(liquidityAccountKey)
            liquidityData.push(liquidityAccount)
          } catch (e) {
            console.error(e)
          }
        }
        setLiquidityAccounts(liquidityData)
      }
    })()
  }, [wallet?.adapter?.publicKey, sslData, isTxnSuccessfull])

  // useEffect(() => {
  //   if (wallet?.adapter?.publicKey) isWhitelistApi()
  // }, [wallet?.adapter?.publicKey])

  useEffect(() => {
    ;(async () => {
      try {
        if (liquidityAccounts) {
          const filteredData = {}
          ADDRESSES[network].forEach((pool: any) => {
            let found = false
            for (let i = 0; i < liquidityAccounts.length; i++) {
              const account = liquidityAccounts[i]
              if (account?.mint.toBase58() === pool.address.toBase58()) {
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

  function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false
      }
    }
    return true
  }

  useEffect(() => {
    if (filteredLiquidityAccounts && !isEmpty(filteredLiquidityAccounts) && sslData && sslData.length) {
      const tempRewards = {}
      for (let i = 0; i < sslData.length; i++) {
        const mint = sslData[i].mint.toBase58()
        const liqForMint = filteredLiquidityAccounts[mint]
        if (!filteredLiquidityAccounts[mint]) {
          tempRewards[mint] = null
        } else {
          const diff = sslData[i].totalAccumulatedLpReward.sub(liqForMint.lastObservedTap)
          const numerator = diff.mul(liqForMint.amountDeposited)
          const answer = numerator.div(sslData[i].totalLiquidityDeposits)
          tempRewards[mint] = answer
        }
      }
      setRewards(tempRewards)
    } else setRewards({})
  }, [filteredLiquidityAccounts])

  //Call API to get ssl table data. Need to run only once
  useEffect(() => {
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
            console.log(e)
          }
        }
        setLiquidityAmount(liquidityAmountsArray)
      }
    })()
  }, [allPoolSslData, isTxnSuccessfull])

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
        rewards: rewards
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
