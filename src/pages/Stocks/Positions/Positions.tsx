import React, { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react'
import { Debt } from './Debt'
import { Tokens } from './Tokens'
import { Panel } from '../../../components'

export const Positions: FC<{
  poolsVisible: boolean
  setPoolsVisible: Dispatch<SetStateAction<boolean>>
}> = ({ poolsVisible, setPoolsVisible }) => {
  const [panel, setPanel] = useState<'gTokens' | 'Debt'>('gTokens')

  const panels = [
    { component: <Tokens />, display: 'gTokens' },
    { component: <Debt />, display: 'Debt' }
  ] as { component: ReactNode; display: string }[]

  const fields = {
    gTokens: ['Market', 'Current Price', 'Amount', 'Debt', 'Debt (gUSD)', 'Delta'],
    Debt: ['Pool debt structure']
  }

  return (
    <Panel
      activePanel={panel}
      centerLabels
      coverVisible={poolsVisible}
      expand={() => setPoolsVisible((prevState) => !prevState)}
      fields={fields}
      justify="space-evenly"
      minHeight={'350px'}
      panels={[panels[0].display, panels[1].display]}
      setPanel={setPanel}
      underlinePositions={['calc(33% - 34px)', 'calc(66% - 2px)']}
      underlineWidths={['68px', '42px']}
    >
      {panels.find(({ display }) => display === panel)!.component}
    </Panel>
  )
}
