import React, { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react'

interface INavCollapseConfig {
  relaxPopup: boolean
  setRelaxPopup: Dispatch<SetStateAction<boolean>>
}

const NavCollapseContext = createContext<INavCollapseConfig | null>(null)

export const NavCollapseProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [relaxPopup, setRelaxPopup] = useState<boolean>(false)

  return (
    <NavCollapseContext.Provider
      value={{
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

  const { relaxPopup, setRelaxPopup } = context
  return { relaxPopup, setRelaxPopup }
}
