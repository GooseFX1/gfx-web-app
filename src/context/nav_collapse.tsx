import React, { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react'

interface INavCollapseConfig {
  isCollapsed: boolean
  toggleCollapse: Dispatch<SetStateAction<boolean>>
}

const NavCollapseContext = createContext<INavCollapseConfig | null>(null)

export const NavCollapseProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<boolean>(false)

  return (
    <NavCollapseContext.Provider
      value={{
        isCollapsed: mode,
        toggleCollapse: setMode
      }}
    >
      {children}
    </NavCollapseContext.Provider>
  )
}

export const useNavCollapse = (): INavCollapseConfig => {
  const context = useContext(NavCollapseContext)
  if (!context) {
    throw new Error('Missing nav collapse context')
  }

  const { isCollapsed, toggleCollapse } = context
  return { isCollapsed, toggleCollapse }
}
