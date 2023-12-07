import React, { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react'
interface IRewardToggleConfig {
  rewardModal: boolean
  rewardToggle: Dispatch<SetStateAction<boolean>>
  panelIndex: number
  changePanel: (index: number) => void
}
const RewardToggleContext = createContext<IRewardToggleConfig | null>(null)
export const RewardToggleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<boolean>(false)
  const [panelIndex, setPanelIndex] = useState<number>(0)
  const closeModalBox = (val: boolean) => {
    if (val) {
      setMode(val)
      document.body.style.overflow = 'hidden'
    } else {
      setMode(false)
      document.body.style.overflow = 'auto'
    }
  }
  const changePanel = (index: number) => setPanelIndex(index)
  return (
    <RewardToggleContext.Provider
      value={{
        rewardModal: mode,
        rewardToggle: closeModalBox,
        panelIndex: panelIndex,
        changePanel: changePanel
      }}
    >
      {children}
    </RewardToggleContext.Provider>
  )
}
export const useRewardToggle = (): IRewardToggleConfig => {
  const context = useContext(RewardToggleContext)

  if (!context) {
    throw new Error('Missing nav collapse context')
  }
  return context
}
