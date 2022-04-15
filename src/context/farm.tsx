import { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react'

interface IShowDeposited {
  showDeposited: boolean
  toggleDeposited: Dispatch<SetStateAction<boolean>>
  poolFilter: string
  setPoolFilter: Dispatch<SetStateAction<string>>
  searchFilter: string | null
  setSearchFilter: Dispatch<SetStateAction<string>>
}

const FarmContext = createContext<IShowDeposited | null>(null)

export const FarmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<boolean>(false)
  const [filter, setFilter] = useState('All pools')
  const [searchFilter, setSearchFilter] = useState(null)

  return (
    <FarmContext.Provider
      value={{
        showDeposited: mode,
        toggleDeposited: setMode,
        poolFilter: filter,
        setPoolFilter: setFilter,
        searchFilter: searchFilter,
        setSearchFilter: setSearchFilter
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

  const { showDeposited, toggleDeposited, poolFilter, setPoolFilter, searchFilter, setSearchFilter } = context
  return { showDeposited, toggleDeposited, poolFilter, setPoolFilter, searchFilter, setSearchFilter }
}
