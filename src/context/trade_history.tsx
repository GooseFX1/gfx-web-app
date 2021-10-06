import React, { FC, ReactNode, createContext, useContext, Dispatch, SetStateAction, useEffect } from 'react'
import { useLocalStorageState } from '../utils'
import { getSerumOpenOrders } from '../web3'
import { useConnectionConfig } from './settings'
import { useCrypto } from './crypto'
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
  panel: HistoryPanel
  setPanel: Dispatch<SetStateAction<HistoryPanel>>
}

const TradeHistoryContext = createContext<ITradeHistoryConfig | null>(null)

export const TradeHistoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const { selectedCrypto } = useCrypto()
  const { publicKey } = useWallet()
  const [panel, setPanel] = useLocalStorageState('historyPanel', HistoryPanel.Orders)

  useEffect(() => {
    if (publicKey) {
      getSerumOpenOrders(connection, selectedCrypto.pair, publicKey)
    }
  }, [connection, publicKey, selectedCrypto.pair])

  return (
    <TradeHistoryContext.Provider
      value={{
        panel,
        setPanel
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

  const { panel, setPanel } = context
  return { panel, setPanel }
}
