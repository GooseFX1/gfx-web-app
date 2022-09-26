//import { bool } from '@metaplex-foundation/beet'
import { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction, useEffect } from 'react'
import { stakeTokens, generateListOfSSLTokens } from '../constants'
import { IFarmData } from '../pages/Farm/CustomTableList'
import { useConnectionConfig } from './settings'
interface IShowDeposited {
  showDeposited: boolean
  toggleDeposited: Dispatch<SetStateAction<boolean>>
  poolFilter: string
  counter: number
  setCounter: Dispatch<SetStateAction<number>>
  setPoolFilter: Dispatch<SetStateAction<string>>
  searchFilter: string | null
  setSearchFilter: Dispatch<SetStateAction<string>>
  farmDataContext: IFarmData[]
  farmDataSSLContext: IFarmData[]
  setFarmDataContext: Dispatch<SetStateAction<IFarmData[]>>
  setFarmDataSSLContext: Dispatch<SetStateAction<IFarmData[]>>
  operationPending: boolean
  setOperationPending: Dispatch<SetStateAction<boolean>>
  refreshClass: string
  setRefreshClass: Dispatch<SetStateAction<string>>
}

const FarmContext = createContext<IShowDeposited | null>(null)

export const FarmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<boolean>(false)
  const [filter, setFilter] = useState('All pools')
  const [searchFilter, setSearchFilter] = useState(null)
  const { network } = useConnectionConfig()
  const [farmDataContext, setFarmDataContext] = useState<IFarmData[]>(stakeTokens)
  const [farmDataSSLContext, setFarmDataSSLContext] = useState<IFarmData[]>(generateListOfSSLTokens(network))
  const [counter, setCounter] = useState<number>(0)
  const [operationPending, setOperationPending] = useState<boolean>(false)
  const [refreshClass, setRefreshClass] = useState<string>('')

  useEffect(() => {
    setFarmDataSSLContext(generateListOfSSLTokens(network))
  }, [network])

  return (
    <FarmContext.Provider
      value={{
        showDeposited: mode,
        counter: counter,
        operationPending: operationPending,
        setOperationPending: setOperationPending,
        setCounter: setCounter,
        toggleDeposited: setMode,
        poolFilter: filter,
        setPoolFilter: setFilter,
        searchFilter: searchFilter,
        setSearchFilter: setSearchFilter,
        farmDataContext: farmDataContext,
        farmDataSSLContext: farmDataSSLContext,
        setFarmDataContext: setFarmDataContext,
        setFarmDataSSLContext: setFarmDataSSLContext,
        refreshClass: refreshClass,
        setRefreshClass: setRefreshClass
      }}
    >
      {children}
    </FarmContext.Provider>
  )
}

export const useFarmContext = (): IShowDeposited => {
  const context = useContext(FarmContext)
  if (!context) {
    throw new Error('Missing Farm Context')
  }

  const {
    showDeposited,
    toggleDeposited,
    counter,
    setCounter,
    poolFilter,
    setPoolFilter,
    operationPending,
    setOperationPending,
    searchFilter,
    setSearchFilter,
    farmDataContext,
    farmDataSSLContext,
    setFarmDataContext,
    setFarmDataSSLContext,
    refreshClass,
    setRefreshClass
  } = context
  return {
    showDeposited,
    toggleDeposited,
    operationPending,
    setOperationPending,
    poolFilter,
    counter,
    setCounter,
    setPoolFilter,
    searchFilter,
    setSearchFilter,
    farmDataContext,
    farmDataSSLContext,
    setFarmDataContext,
    setFarmDataSSLContext,
    refreshClass,
    setRefreshClass
  }
}
