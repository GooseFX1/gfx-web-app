import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Entry } from './shared'
import { MainButton } from '../../../components'
import { HistoryPanel, PANELS_FIELDS, useCrypto, useTradeHistory } from '../../../context'
import { CenteredDiv } from '../../../styles'

const WRAPPER = styled(CenteredDiv)`
  flex-direction: column;
  width: 100%;

  > div:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.margins['1.5x']};
  }
`

export const Balances: FC = () => {
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { getPairFromMarketAddress, openOrders, settleFunds } = useTradeHistory()

  const content = useMemo(
    () =>
      openOrders.map((openOrder, index) => {
        const { market } = selectedCrypto
        const pair = getPairFromMarketAddress(openOrder.market)
        const baseAvailable = market?.baseSplSizeToNumber(openOrder.baseTokenFree)
        const baseBalance = market?.baseSplSizeToNumber(openOrder.baseTokenTotal.sub(openOrder.baseTokenFree))
        const quoteAvailable = market?.quoteSplSizeToNumber(openOrder.quoteTokenFree)
        const quoteBalance = market?.quoteSplSizeToNumber(openOrder.quoteTokenTotal.sub(openOrder.quoteTokenFree))

        const settleButton = (baseAvailable ?? 0) > 0 || (quoteAvailable ?? 0) > 0 ? (
          <MainButton
            height="30px"
            onClick={() =>
              settleFunds(
                openOrder,
                baseAvailable,
                quoteAvailable,
                getAskSymbolFromPair(pair),
                getBidSymbolFromPair(pair)
              )
            }
            status="action"
            width="150px"
          >
            {' '}
            <span>Settle balances</span>
          </MainButton>
        ) : <div />

        return (
          <WRAPPER key={index}>
            <Entry $entriesLength={PANELS_FIELDS[HistoryPanel.Balances].length}>
              <span>{getAskSymbolFromPair(pair)}</span>
              <span>{baseBalance}</span>
              <span>{baseAvailable}</span>
            </Entry>
            <Entry $entriesLength={PANELS_FIELDS[HistoryPanel.Balances].length}>
              <span>{getBidSymbolFromPair(pair)}</span>
              <span>{quoteBalance}</span>
              <span>{quoteAvailable}</span>
            </Entry>
            {settleButton}
          </WRAPPER>
        )
      }),
    [getAskSymbolFromPair, getBidSymbolFromPair, getPairFromMarketAddress, openOrders, selectedCrypto, settleFunds]
  )

  return <>{!openOrders.length ? <span>No balances</span> : content}</>
}
