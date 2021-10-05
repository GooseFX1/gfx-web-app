import React, { FC, ReactNode, createContext, useContext, Dispatch, SetStateAction } from 'react'
import { useLocalStorageState } from '../utils'

export enum HistoryPanel {
  Orders = 'Open Orders',
  Trades = 'Recent Trade History',
  Balances = 'Balances'
}

export const PANELS_FIELDS: { [x in HistoryPanel]: string[] } = {
  [HistoryPanel.Orders]: ['Market', 'Side', 'Price (USD)', 'Amount', 'Time'],
  [HistoryPanel.Trades]: ['Market', 'Buy/Sell', 'Amount', 'Price (USD)', 'Liquidity', 'Fees (USD)', 'Time'],
  [HistoryPanel.Balances]: ['Coin', 'Wallet Balance', 'Orders', 'Unsettled']
}

interface ITradeHistoryConfig {
  panel: HistoryPanel
  setPanel: Dispatch<SetStateAction<HistoryPanel>>
}

const TradeHistoryContext = createContext<ITradeHistoryConfig | null>(null)

export const TradeHistoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [panel, setPanel] = useLocalStorageState('historyPanel', HistoryPanel.Orders)

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
