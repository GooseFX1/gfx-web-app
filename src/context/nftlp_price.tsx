import React, { FC, ReactNode, createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

interface ISOLToggle {
  isUSDC: boolean
  setIsUSDC: any
}

const SolPriceContext = createContext<ISOLToggle | null>(null)

export const SolPriceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isUSDC, setIsUSDCToggle] = useState<boolean>(false)

  const setIsUSDC = (value) => {
    setIsUSDCToggle(value)
  }

  return (
    <SolPriceContext.Provider
      value={{
        isUSDC,
        setIsUSDC
      }}
    >
      {children}
    </SolPriceContext.Provider>
  )
}

export const useSolToggle = (): ISOLToggle => {
  const context = useContext(SolPriceContext)
  if (!context) {
    throw new Error('Missing NFTLP context')
  }

  const { isUSDC, setIsUSDC } = context
  return { isUSDC, setIsUSDC }
}
