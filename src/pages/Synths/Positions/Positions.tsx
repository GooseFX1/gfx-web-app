import React, { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react'
import { Collateral } from './Collateral'
import { Tokens } from './Tokens'
import { Panel } from '../../../components'

export const Positions: FC<{
  poolsVisible: boolean
  setPoolsVisible: Dispatch<SetStateAction<boolean>>
}> = ({ poolsVisible, setPoolsVisible }) => {
  const [panel, setPanel] = useState<'gTokens' | 'Collateral'>('gTokens')

  const panels = [
    { component: <Tokens />, display: 'gTokens' },
    { component: <Collateral />, display: 'Collateral' }
  ] as { component: ReactNode; display: string }[]

  const fields = {
    gTokens: ['Market', 'Current Price', 'Average Price', 'Amount', 'Profit/Loss', 'Debt'],
    Collateral: []
  }

  return (
    <Panel
      activePanel={panel}
      centerLabels
      coverVisible={poolsVisible}
      expand={() => setPoolsVisible((prevState) => !prevState)}
      fields={fields}
      justify="space-evenly"
      panels={[panels[0].display, panels[1].display]}
      setPanel={setPanel}
      underlinePositions={['103px', '375px']}
      underlineWidths={['70px', '78px']}
    >
      {panels.find(({ display }) => display === panel)!.component}
    </Panel>
  )
}
