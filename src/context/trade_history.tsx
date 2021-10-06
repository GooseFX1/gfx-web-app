import React, { FC, ReactNode, createContext, useContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useCrypto } from './crypto'
import { useConnectionConfig } from './settings'
import { useLocalStorageState } from '../utils'
import { getSerumOpenOrders } from '../web3'
import { useWallet } from '@solana/wallet-adapter-react'

export enum HistoryPanel {
  Orders = 'Open Orders',
  Trades = 'Recent Trade History',
  Balances = 'Balances'
}

export const PANELS_FIELDS: { [x in HistoryPanel]: string[] } = {
  [HistoryPanel.Orders]: ['Market', 'Side', 'Size', 'Price (USD)'],
  [HistoryPanel.Trades]: ['Market', 'Side', 'Size', 'Price (USD)', 'Liquidity', 'Fees (USD)'],
  [HistoryPanel.Balances]: ['Coin', 'Orders', 'Unsettled', 'Action']
}

interface ITradeHistoryConfig {
  balances: number[]
  openOrders: number[]
  panel: HistoryPanel
  setPanel: Dispatch<SetStateAction<HistoryPanel>>
  tradeHistory: number[]
}

const TradeHistoryContext = createContext<ITradeHistoryConfig | null>(null)

export const TradeHistoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const { selectedCrypto } = useCrypto()
  const { publicKey } = useWallet()
  const [balances, setBalances] = useState([])
  const [openOrders, setOpenOrders] = useState([])
  const [tradeHistory, setTradeHistory] = useState([])
  const [panel, setPanel] = useLocalStorageState('historyPanel', HistoryPanel.Orders)

  useEffect(() => {
    if (publicKey) {
      (async() => {
        try {
          const l = await getSerumOpenOrders(connection, selectedCrypto.pair, publicKey)
          console.log(l)
        } catch (e: any) {
          console.error(e)
        }
      })()
    }
  }, [connection, publicKey, selectedCrypto.pair])

  return (
    <TradeHistoryContext.Provider
      value={{
        balances,
        openOrders,
        panel,
        setPanel,
        tradeHistory
      }}
    >
      {children}
    </TradeHistoryContext.Provider>
  )
}

export const useTradeHistory = (): ITradeHistoryConfig => {
  const context = useContext(TradeHistoryContext)
  if (!context) {
    throw new Error('Missing trade history context')
  }

  const { balances, openOrders, panel, setPanel, tradeHistory } = context
  return { balances, openOrders, panel, setPanel, tradeHistory }
}
