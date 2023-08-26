import { useWallet } from '@solana/wallet-adapter-react'
import { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction, useEffect } from 'react'
import { usePriceFeedFarm } from '.'
import { ADDRESSES, poolType, Pool, SSLToken } from '../pages/FarmV3/constants'
import { getLiquidityAccountKey, getPoolRegistryAccountKeys } from '../web3/sslV2'
import { useConnectionConfig } from './settings'

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
}

const SSLContext = createContext<SSLData | null>(null)

export const SSLProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { network } = useConnectionConfig()
  const { SSLProgram } = usePriceFeedFarm()
  const { wallet } = useWallet()
  const [sslData, setSslData] = useState<SSLToken[]>([])
  const [allPoolSslData, setAllPoolSslData] = useState<SSLToken[]>([])
  const [liquidityAccounts, setLiquidityAccounts] = useState([])
  const [filteredLiquidityAccounts, setFilteredLiquidityAccounts] = useState({})
  const [pool, setPool] = useState<Pool>(poolType.stable)
  const [operationPending, setOperationPending] = useState<boolean>(false)
  const [isTxnSuccessfull, setIsTxnSuccessfull] = useState<boolean>(false)

  //sslchange: formula work
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
                const sslToken = { ...token, token: farm.token, name: farm.name }
                allPoolentries.push(sslToken)
                if (token.assetType === pool.index) sslPoolEntries.push(sslToken)
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
            console.log(e)
          }
        }
        setLiquidityAccounts(liquidityData)
      }
    })()
  }, [wallet?.adapter?.publicKey, sslData, isTxnSuccessfull])

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
        setIsTxnSuccessfull: setIsTxnSuccessfull
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
