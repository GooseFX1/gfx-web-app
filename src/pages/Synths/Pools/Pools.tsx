import React, { FC, ReactNode, useState } from 'react'
import styled from 'styled-components'
import { Claim } from './Claim'
import { DepositWithdraw } from './DepositWithdraw'
import { MintBurn } from './MintBurn'
import { PoolSelector } from './PoolSelector'
import { SpaceBetweenDiv } from '../../../styles'

import { SwapView } from './SwapView'

const HEADER = styled(SpaceBetweenDiv)<{ $tab: number }>`
  ${({ theme }) => theme.largeBorderRadius}
  background-color: ${({ theme }) => theme.grey4};

  span {
    font-size: 12px;
    font-weight: bold;
    color: ${({ theme }) => theme.text1h};

    &:hover {
      color: white;

      &:not(:nth-child(${({ $tab }) => $tab + 1})) {
        cursor: pointer;
      }
    }

    &:nth-child(${({ $tab }) => $tab + 1}) {
      color: white;
    }
  }
`

const TAB = styled.div`
  padding: ${({ theme }) => theme.margins['5x']} ${({ theme }) => theme.margins['3x']}
    ${({ theme }) => theme.margins['3x']};
`

const TABS = styled(SpaceBetweenDiv)`
  flex: 1;
  padding: ${({ theme }) => theme.margins['3x']} ${({ theme }) => theme.margins['4x']};
`

const WRAPPER = styled.div`
  height: 100%;
  ${({ theme }) => theme.largeBorderRadius}
  ${({ theme }) => theme.largeShadow}
  background-color: ${({ theme }) => theme.bg3};
`

export const Pools: FC = () => {
  const [tab, setTab] = useState(0)

  const tabs = [
    { component: <DepositWithdraw action="deposit" />, display: 'Deposit' },
    { component: <MintBurn action="mint" />, display: 'Mint' },
    { component: <SwapView />, display: 'Swap' },
    { component: <MintBurn action="burn" />, display: 'Burn' },
    { component: <DepositWithdraw action="withdraw" />, display: 'Withdraw' },
    { component: <Claim />, display: 'Rewards' }
  ] as { component: ReactNode; display: string }[]

  return (
    <WRAPPER>
      <HEADER $tab={tab}>
        <PoolSelector />
        <TABS>
          {tabs.map(({ component, display }, index) => (
            <span key={index} onClick={() => setTab(index)}>
              {display}
            </span>
          ))}
        </TABS>
      </HEADER>
      <TAB>{tabs[tab].component}</TAB>
    </WRAPPER>
  )
}
