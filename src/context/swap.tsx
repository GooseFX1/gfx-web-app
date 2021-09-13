import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig, useSlippageConfig } from './settings'
import { notify } from '../utils'
import { swap } from '../web3'
import { useRates } from './rates'
import { useAccounts } from './accounts'

export interface ISwapToken {
  address: string
  amount: string
  decimals: number
  symbol: string
  toSwapAmount: number
  uiAmount: number
  uiAmountString: string
}

interface ISwapConfig {
  tokenA: ISwapToken | null
  tokenB: ISwapToken | null
  setTokenA: Dispatch<SetStateAction<ISwapToken | null>>
  setTokenB: Dispatch<SetStateAction<ISwapToken | null>>
  swapTokens: () => void
  switchTokens: () => void
}

const SwapContext = createContext<ISwapConfig | null>(null)

export const SwapProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { accounts } = useAccounts()
  const { connection, network } = useConnectionConfig()
  const { slippage } = useSlippageConfig()
  const { setRatesToFetch } = useRates()
  const wallet = useWallet()
  const [tokenA, setTokenA] = useState<ISwapToken | null>(null)
  const [tokenB, setTokenB] = useState<ISwapToken | null>(null)

  const swapTokens = async () => {
    if (!wallet.publicKey || !tokenA || !tokenB) return

    notify({ message: 'Swap in progress...' })
    try {
      const signature = await swap(tokenA, tokenB, slippage, wallet, connection, network)
      notify({ type: 'success', message: 'Swap successful!', txid: signature })
    } catch (e: any) {
      notify({ type: 'error', message: 'Swap failed', icon: 'error', description: e.message })
    }
  }

  const switchTokens = () => {
    if (!tokenA || !tokenB) return

    setTokenA(tokenB)
    setTokenB(tokenA)
  }

  useEffect(() => {
    setTokenA(null)
    setTokenB(null)
  }, [connection])

  useEffect(() => {
    if (tokenA) setRatesToFetch(({ outToken }) => ({ inToken: tokenA, outToken }))
    if (tokenB) setRatesToFetch(({ inToken }) => ({ inToken, outToken: tokenB }))
  }, [setRatesToFetch, tokenA, tokenB])

  useEffect(() => {
    if (tokenA && accounts[tokenA.address]) {
      // @ts-ignore
      setTokenA(({ address, decimals, symbol, toSwapAmount }) => ({
        address,
        amount: accounts[tokenA.address].amount,
        decimals,
        symbol,
        toSwapAmount,
        uiAmount: accounts[tokenA.address].uiAmount,
        uiAmountString: accounts[tokenA.address].uiAmountString
      }))
    }

    if (tokenB && accounts[tokenB.address]) {
      // @ts-ignore
      setTokenB(({ address, decimals, symbol, toSwapAmount }) => ({
        address,
        amount: accounts[tokenB.address].amount,
        decimals,
        symbol,
        toSwapAmount,
        uiAmount: accounts[tokenB.address].uiAmount,
        uiAmountString: accounts[tokenB.address].uiAmountString
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts])

  return (
    <SwapContext.Provider value={{ tokenA, tokenB, setTokenA, setTokenB, swapTokens, switchTokens }}>
      {children}
    </SwapContext.Provider>
  )
}

export const useSwap = (): ISwapConfig => {
  const context = useContext(SwapContext)
  if (!context) {
    throw new Error('Missing swap context')
  }

  const { tokenA, tokenB, setTokenA, setTokenB, swapTokens, switchTokens } = context
  return { tokenA, tokenB, setTokenA, setTokenB, swapTokens, switchTokens }
}
