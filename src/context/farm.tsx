import { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react'
import { FarmData } from '../constants'

interface IShowDeposited {
  showDeposited: boolean
  toggleDeposited: Dispatch<SetStateAction<boolean>>
  poolFilter: string
  setPoolFilter: Dispatch<SetStateAction<string>>
  searchFilter: string | null
  setSearchFilter: Dispatch<SetStateAction<string>>
  farmDataContext: IFarmData[]
  setFarmDataContext: Dispatch<SetStateAction<IFarmData[]>>
}

interface IFarmData {
  id: string
  image: string
  name: string
  earned: number
  apr: number
  rewards?: number
  liquidity: number
  type: string
  ptMinted?: number
  userLiablity?: number
  currentlyStaked: number
}

const FarmContext = createContext<IShowDeposited | null>(null)

export const FarmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<boolean>(false)
  const [filter, setFilter] = useState('All pools')
  const [searchFilter, setSearchFilter] = useState(null)
  const [farmDataContext, setFarmDataContext] = useState<IFarmData[]>(FarmData)

  return (
    <FarmContext.Provider
      value={{
        showDeposited: mode,
        toggleDeposited: setMode,
        poolFilter: filter,
        setPoolFilter: setFilter,
        searchFilter: searchFilter,
        setSearchFilter: setSearchFilter,
        farmDataContext: farmDataContext,
        setFarmDataContext: setFarmDataContext
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
    poolFilter,
    setPoolFilter,
    searchFilter,
    setSearchFilter,
    farmDataContext,
    setFarmDataContext
  } = context
  return {
    showDeposited,
    toggleDeposited,
    poolFilter,
    setPoolFilter,
    searchFilter,
    setSearchFilter,
    farmDataContext,
    setFarmDataContext
  }
}
