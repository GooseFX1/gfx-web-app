import React, { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react'

interface INavCollapseConfig {
  isCollapsed: boolean
  toggleCollapse: Dispatch<SetStateAction<boolean>>
  relaxPopup: boolean
  setRelaxPopup: Dispatch<SetStateAction<boolean>>
}

const NavCollapseContext = createContext<INavCollapseConfig | null>(null)

export const NavCollapseProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<boolean>(false)
  const [relaxPopup, setRelaxPopup] = useState<boolean>(false)

  return (
    <NavCollapseContext.Provider
      value={{
        isCollapsed: mode,
        toggleCollapse: setMode,
        relaxPopup: relaxPopup,
        setRelaxPopup: setRelaxPopup
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

  const { isCollapsed, toggleCollapse, relaxPopup, setRelaxPopup } = context
  return { isCollapsed, toggleCollapse, relaxPopup, setRelaxPopup }
}
