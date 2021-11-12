import React, { Dispatch, FC, SetStateAction } from 'react'
import { Balances } from './Balances'
import { Orders } from './Orders'
import { Trades } from './Trades'
import { Panel } from '../../../components'
import { HistoryPanel, PANELS_FIELDS, useTradeHistory } from '../../../context'

export const History: FC<{
  chartsVisible: boolean
  setChartsVisible: Dispatch<SetStateAction<boolean>>
}> = ({ chartsVisible, setChartsVisible }) => {
  const { panel, setPanel } = useTradeHistory()

  const content = panel === HistoryPanel.Orders ? <Orders /> : panel === HistoryPanel.Trades ? <Trades /> : <Balances />

  return (
    <Panel
      activePanel={panel}
      coverVisible={chartsVisible}
      expand={() => setChartsVisible((prevState) => !prevState)}
      fields={PANELS_FIELDS}
      justify="space-evenly"
      // justify="space-between"
      panels={[HistoryPanel.Orders, HistoryPanel.Balances]}
      // panels={[HistoryPanel.Orders, HistoryPanel.Trades, HistoryPanel.Balances]}
      setPanel={setPanel}
      underlinePositions={['calc(33% - 54px)', 'calc(67% - 19px)']}
      // underlinePositions={['-4px', 'calc(50% - 70px)', 'calc(100% - 72px)']}
      underlineWidths={['102px', '72px']}
      // underlineWidths={['102px', '166px', '78px']}
    >
      {content}
    </Panel>
  )
}
