import React, { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { notify } from '../utils'
import { ADDRESSES, Mint, Pool, pool } from '../web3'

interface IUserAccount {
  collateral: number
  debt: number
  value: number
}

interface ISynthsConfig {
  amount: number
  availableMints: [string, Mint][]
  availablePools: [string, Pool][]
  burn: () => Promise<void>
  claim: () => Promise<void>
  deposit: () => Promise<void>
  mint: () => Promise<void>
  poolName: string
  setAmount: Dispatch<SetStateAction<number>>
  setPoolName: Dispatch<SetStateAction<string>>
  setSynth: Dispatch<SetStateAction<string>>
  setUserAccount: Dispatch<SetStateAction<IUserAccount>>
  synth: string
  userAccount: IUserAccount
  withdraw: () => Promise<void>
}

const SynthsContext = createContext<ISynthsConfig | null>(null)

export const SynthsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection, network } = useConnectionConfig()
  const wallet = useWallet()
  const { mints, pools } = ADDRESSES[network]

  const availableMints = useMemo(() => Object.entries(mints).filter(([_, { type }]) => type === 'synth'), [mints])
  const availablePools = useMemo(() => Object.entries(pools).filter(([_, { type }]) => type === 'synth'), [pools])

  const [amount, setAmount] = useState<number>(0)
  const [poolName, setPoolName] = useState<string>(availablePools[0][0])
  const [synth, setSynth] = useState<string>(availableMints[0][0])
  const [userAccount, setUserAccount] = useState<IUserAccount>({ collateral: 150000, debt: 27000, value: 420000 })

  const burn = async () => {
    try {
      const signature = await pool.burn(amount, poolName, synth, wallet, connection, network)
      notify({
        type: 'success',
        message: 'Burn successful!',
        description: `Burnt ${amount} ${synth}`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      notify({ type: 'error', message: `Error burning`, icon: 'error' }, e)
    }
  }

  const claim = async () => {
    if (wallet.publicKey && wallet.signTransaction) {
      try {
        const [signature, amount] = await pool.claim(poolName, wallet, connection, network)
        notify({
          type: 'success',
          message: 'Claim successful!',
          description: `Claimed ${amount} gUSD`,
          icon: 'success',
          txid: signature
        })
      } catch (e: any) {
        notify({ type: 'error', message: `Error claiming`, icon: 'error' }, e)
      }
    }
  }

  const deposit = async () => {
    try {
      const signature = await pool.deposit(amount, poolName, wallet, connection, network)
      notify({
        type: 'success',
        message: 'Deposit successful!',
        description: `Deposited ${amount} GOFX`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      notify({ type: 'error', message: `Error depositing`, icon: 'error' }, e)
    }
  }

  const mint = async () => {
    try {
      const signature = await pool.mint(amount, poolName, synth, wallet, connection, network)
      notify({
        type: 'success',
        message: 'Mint successful!',
        description: `Minted ${amount} ${synth}`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      notify({ type: 'error', message: `Error minting`, icon: 'error' }, e)
    }
  }

  const withdraw = async () => {
    try {
      const signature = await pool.withdraw(amount, poolName, wallet, connection, network)
      notify({
        type: 'success',
        message: 'Withdrawal successful!',
        description: `Withdrew ${amount} ${synth}`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      notify({ type: 'error', message: `Error withdrawing`, icon: 'error' }, e)
    }
  }

  return (
    <SynthsContext.Provider
      value={{
        amount,
        availableMints,
        availablePools,
        burn,
        claim,
        deposit,
        mint,
        poolName,
        setAmount,
        setPoolName,
        setSynth,
        setUserAccount,
        synth,
        userAccount,
        withdraw
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
    amount: context.amount,
    availableMints: context.availableMints,
    availablePools: context.availablePools,
    burn: context.burn,
    claim: context.claim,
    deposit: context.deposit,
    mint: context.mint,
    poolName: context.poolName,
    setAmount: context.setAmount,
    setPoolName: context.setPoolName,
    setSynth: context.setSynth,
    setUserAccount: context.setUserAccount,
    synth: context.synth,
    userAccount: context.userAccount,
    withdraw: context.withdraw
  }
}
