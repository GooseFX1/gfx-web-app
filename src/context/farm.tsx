import { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react'

interface IShowDeposited {
  showDeposited: boolean
  toggleDeposited: Dispatch<SetStateAction<boolean>>
}

const FarmContext = createContext<IShowDeposited | null>(null)

export const FarmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<boolean>(false)

  return (
    <FarmContext.Provider
      value={{
        showDeposited: mode,
        toggleDeposited: setMode
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

  const { showDeposited, toggleDeposited } = context
  return { showDeposited, toggleDeposited }
}
