import React, { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react'
interface IRewardToggleConfig {
  rewardModal: boolean
  rewardToggle: Dispatch<SetStateAction<boolean>>
}
const RewardToggleContext = createContext<IRewardToggleConfig | null>(null)
export const RewardToggleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<boolean>(false)
  const closeModalBox = (val: boolean) => {
    if (val) {
      setMode(val)
      document.body.style.overflow = 'hidden'
    } else {
      setMode(false)
      document.body.style.overflow = 'auto'
    }
  }
  return (
    <RewardToggleContext.Provider
      value={{
        rewardModal: mode,
        rewardToggle: closeModalBox
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
  const { rewardModal, rewardToggle } = context
  return { rewardModal, rewardToggle }
}
