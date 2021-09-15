import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useAccounts } from './accounts'
import { useRates } from './rates'
import { useConnectionConfig, useSlippageConfig } from './settings'
import { notify } from '../utils'
import { computePoolsPDAs, swap } from '../web3'

export interface ISwapToken {
  address: string
  amount: string
  decimals: number
  symbol: string
  uiAmount: number
  uiAmountString: string
}

interface ISwapConfig {
  tokenA: ISwapToken | null
  tokenB: ISwapToken | null
  inTokenAmount: number
  setInTokenAmount: Dispatch<SetStateAction<number>>
  outTokenAmount: number
  setOutTokenAmount: Dispatch<SetStateAction<number>>
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
  const { setRates, setRatesToFetch } = useRates()
  const wallet = useWallet()
  const [tokenA, setTokenA] = useState<ISwapToken | null>(null)
  const [tokenB, setTokenB] = useState<ISwapToken | null>(null)
  const [inTokenAmount, setInTokenAmount] = useState(0)
  const [outTokenAmount, setOutTokenAmount] = useState(0)

  const swapTokens = async () => {
    if (!wallet.publicKey || !tokenA || !tokenB) return

    notify({ message: 'Swap in progress...' })
    try {
      const signature = await swap(tokenA, tokenB, inTokenAmount, outTokenAmount, slippage, wallet, connection, network)
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
    if (tokenA) {
      setRatesToFetch(({ outToken }) => ({ inToken: tokenA, outToken }))
    }

    if (tokenB) {
      setRatesToFetch(({ inToken }) => ({ inToken, outToken: tokenB }))
    }

    (async () => {
      if (tokenA && tokenB) {
        const time = moment().format('MMMM DD, h:mm a')

        try {
          const { pool } = await computePoolsPDAs(tokenA.symbol, tokenB.symbol, network)
          const [aAccount, bAccount] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(tokenA.address) }),
            connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(tokenB.address) })
          ])

          const a = parseFloat(aAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          const b = parseFloat(bAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          const outTokenAmount = inTokenAmount > 0 ? b - (a * b) / (a + inTokenAmount) : 0
          const outValuePerIn = b - (a * b) / (a + 10 ** tokenA.decimals)

          setOutTokenAmount(outTokenAmount)
          setRates(({ inValue, outValue }) => ({ inValue, outValue, outValuePerIn, time }))
        } catch (e) {
          setOutTokenAmount(0)
          setRates(({ inValue, outValue }) => ({ inValue, outValue, outValuePerIn: 0, time }))
        }
      }
    })()
  }, [connection, inTokenAmount, network, setRates, setRatesToFetch, tokenA, tokenB])

  useEffect(() => {
    if (tokenA && accounts[tokenA.address]) {
      // @ts-ignore
      setTokenA(({ address, decimals, symbol }) => ({
        address,
        amount: accounts[tokenA.address].amount,
        decimals,
        symbol,
        uiAmount: accounts[tokenA.address].uiAmount,
        uiAmountString: accounts[tokenA.address].uiAmountString
      }))
    }

    if (tokenB && accounts[tokenB.address]) {
      // @ts-ignore
      setTokenB(({ address, decimals, symbol }) => ({
        address,
        amount: accounts[tokenB.address].amount,
        decimals,
        symbol,
        uiAmount: accounts[tokenB.address].uiAmount,
        uiAmountString: accounts[tokenB.address].uiAmountString
      }))
    }
  }, [accounts])

  return (
    <SwapContext.Provider
      value={{
        tokenA,
        tokenB,
        inTokenAmount,
        setInTokenAmount,
        outTokenAmount,
        setOutTokenAmount,
        setTokenA,
        setTokenB,
        swapTokens,
        switchTokens
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}

export const useSwap = (): ISwapConfig => {
  const context = useContext(SwapContext)
  if (!context) {
    throw new Error('Missing swap context')
  }

  return {
    tokenA: context.tokenA,
    tokenB: context.tokenB,
    inTokenAmount: context.inTokenAmount,
    setInTokenAmount: context.setInTokenAmount,
    outTokenAmount: context.outTokenAmount,
    setOutTokenAmount: context.setOutTokenAmount,
    setTokenA: context.setTokenA,
    setTokenB: context.setTokenB,
    swapTokens: context.swapTokens,
    switchTokens: context.switchTokens
  }
}
