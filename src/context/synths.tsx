import React, { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'
import { useConnectionConfig } from './settings'
import { ADDRESSES, pool } from '../web3'
import { useWallet } from '@solana/wallet-adapter-react'
import { notify } from '../utils'

type SynthAction = 'burn' | 'claim' | 'deposit' | 'mint' | 'swap' | 'withdraw'

interface ISynthsConfig {
  action: SynthAction
  amount: number
  deposit: () => Promise<void>
  poolName: string
  setAction: Dispatch<SetStateAction<SynthAction>>
  setAmount: Dispatch<SetStateAction<number>>
  setPoolName: Dispatch<SetStateAction<string>>
  setSynth: Dispatch<SetStateAction<string>>
  synth: string
}

const SynthsContext = createContext<ISynthsConfig | null>(null)

export const SynthsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection, network } = useConnectionConfig()
  const wallet = useWallet()
  const { mints, pools } = ADDRESSES[network]
  const [action, setAction] = useState<SynthAction>('deposit')
  const [amount, setAmount] = useState<number>(0)
  const [poolName, setPoolName] = useState<string>(Object.entries(pools).filter(([k, { type }]) => type === 'synth')[0][0])
  const [synth, setSynth] = useState<string>(Object.entries(mints).filter(([k, { type }]) => type === 'synth')[0][0])

  const deposit = async () => {
      await pool.deposit(amount, poolName, wallet, connection, network)
  }

  return (
    <SynthsContext.Provider
      value={{
        action,
        amount,
        deposit,
        poolName,
        setAction,
        setAmount,
        setPoolName,
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

  return {
    action: context.action,
    amount: context.amount,
    deposit: context.deposit,
    poolName: context.poolName,
    setAction: context.setAction,
    setAmount: context.setAmount,
    setPoolName: context.setPoolName,
    setSynth: context.setSynth,
    synth: context.synth,
  }
}
