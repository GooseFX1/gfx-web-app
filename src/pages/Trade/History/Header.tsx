import React, { Dispatch, FC, SetStateAction } from 'react'
import styled from 'styled-components'
import { Expand } from '../../../components'
import { HistoryPanel, PANELS_FIELDS, useTradeHistory } from '../../../context'
import { SpaceBetweenDiv } from '../../../styles'

const FIELD = styled.span`
  font-size: 12px;
`

const PANEL = styled.div<{ $active: boolean }>`
  flex: 1;
  
  &:first-child {
    display: flex;
    justify-content: flex-start;
  }

  &:last-child {
    display: flex;
    justify-content: flex-end;
  }

  > span {
    font-size: 14px;
    font-weight: bold;
    color: ${({ $active, theme }) => $active ? theme.text1 : theme.text1h};
    transition: color ${({ theme }) => theme.hapticTransitionTime} ease-in-out;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.text1};
    }
  }
`

const PANELS = styled(SpaceBetweenDiv)<{ $panel: HistoryPanel }>`
  position: relative;
  margin-bottom: ${({ theme }) => theme.margins['1x']};

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: ${({ $panel }) => ($panel === HistoryPanel.Orders ? '-4px' : $panel === HistoryPanel.Trades ? 'calc(50% - 84px)' : 'calc(100% - 72px)')};
    width: ${({ $panel }) => ($panel === HistoryPanel.Orders ? '102' : $panel === HistoryPanel.Trades ? '166' : '78')}px;
    height: 2px;
    background-color: ${({ theme }) => theme.text1};
    transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }
`

const WRAPPER = styled.div`
  position: relative;
  margin: -${({ theme }) => theme.margins['2x']};
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['5x']}
    ${({ theme }) => theme.margins['1.5x']};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${({ theme }) => theme.grey4};
  ${({ theme }) => theme.largeShadow}
`

export const Header: FC<{ setChartsVisible: Dispatch<SetStateAction<boolean>> }> = ({ setChartsVisible }) => {
  const { panel, setPanel } = useTradeHistory()

  return (
    <WRAPPER>
      <Expand onClick={() => setChartsVisible(prevState => !prevState)} />
      <PANELS $panel={panel}>
        {[HistoryPanel.Orders, HistoryPanel.Trades, HistoryPanel.Balances].map((p) => (
          <PANEL $active={p === panel}>
            <span onClick={() => setPanel(p)}>{p}</span>
          </PANEL>
        ))}
      </PANELS>
      <SpaceBetweenDiv>
        {PANELS_FIELDS[panel].map((p) => <FIELD>{p}</FIELD>)}
      </SpaceBetweenDiv>
    </WRAPPER>
  )
}
