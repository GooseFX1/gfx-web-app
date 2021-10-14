import React, { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'
import { ADDRESSES } from '../web3'
import { useConnectionConfig } from './settings'

type SynthAction = 'burn' | 'claim' | 'deposit' | 'mint' | 'swap' | 'withdraw'

interface ISynthsConfig {
  action: SynthAction
  amount: number
  pool: string
  setAction: Dispatch<SetStateAction<SynthAction>>
  setAmount: Dispatch<SetStateAction<number>>
  setPool: Dispatch<SetStateAction<string>>
  setSynth: Dispatch<SetStateAction<string>>
  synth: string
}

const SynthsContext = createContext<ISynthsConfig | null>(null)

export const SynthsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { network } = useConnectionConfig()
  const { mints, pools } = ADDRESSES[network]
  const [action, setAction] = useState<SynthAction>('deposit')
  const [amount, setAmount] = useState<number>(0)
  const [pool, setPool] = useState<string>(Object.entries(pools).filter(([k, { type }]) => type === 'synth')[0][0])
  const [synth, setSynth] = useState<string>(Object.entries(mints).filter(([k, { type }]) => type === 'synth')[0][0])

  return (
    <SynthsContext.Provider
      value={{
        action,
        amount,
        pool,
        setAction,
        setAmount,
        setPool,
        setSynth,
        synth
      }}
    >
      {children}
    </SynthsContext.Provider>
  )
}

export const useSynths = (): ISynthsConfig => {
  const context = useContext(SynthsContext)
  if (!context) {
    throw new Error('Missing synths context')
  }

  const { action, amount, pool, setAction, setAmount, setPool, setSynth, synth } = context
  return { action, amount, pool, setAction, setAmount, setPool, setSynth, synth }
}
