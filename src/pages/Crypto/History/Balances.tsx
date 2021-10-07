import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Entry } from './shared'
import { MainButton } from '../../../components'
import { HistoryPanel, PANELS_FIELDS, useCrypto, useTradeHistory } from '../../../context'

const WRAPPER = styled.div`
  width: 100%;

  > div:first-child {
    margin-bottom: ${({ theme }) => theme.margins['1x']};
  }
`

export const Balances: FC = () => {
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto: { market } } = useCrypto()
  const { getPairFromMarketAddress, openOrders, settleFunds } = useTradeHistory()

  const content = useMemo(() => openOrders.map((openOrder, index) => {
    const handleClick = () => settleFunds(openOrder, pair)
    const pair = getPairFromMarketAddress(openOrder.market)
    const baseOrdersAvailable = market!.baseSplSizeToNumber(openOrder.baseTokenFree)
    const baseOrdersBalance = market!.baseSplSizeToNumber(openOrder.baseTokenTotal.sub(openOrder.baseTokenFree))
    const quoteOrdersAvailable = market!.quoteSplSizeToNumber(openOrder.quoteTokenFree)
    const quoteOrdersBalance = market!.quoteSplSizeToNumber(openOrder.quoteTokenTotal.sub(openOrder.quoteTokenFree))

    return (
      <WRAPPER key={index}>
        <Entry $entriesLength={PANELS_FIELDS[HistoryPanel.Balances].length}>
          <span>{getAskSymbolFromPair(pair)}</span>
          <span>{baseOrdersBalance}</span>
          <span>{baseOrdersAvailable}</span>
          <div>
            <MainButton height="30px" onClick={handleClick} status="action" width="150px">
              <span>Settle funds</span>
            </MainButton>
          </div>
        </Entry>
        <Entry $entriesLength={PANELS_FIELDS[HistoryPanel.Balances].length}>
          <span>{getBidSymbolFromPair(pair)}</span>
          <span>{quoteOrdersBalance}</span>
          <span>{quoteOrdersAvailable}</span>
          <div>
            <MainButton height="30px" onClick={handleClick} status="action" width="150px">
              <span>Settle funds</span>
            </MainButton>
          </div>
        </Entry>
      </WRAPPER>
    )
  }), [getAskSymbolFromPair, getBidSymbolFromPair, getPairFromMarketAddress, market, openOrders, settleFunds])

  return <>{!openOrders.length ? <span>No balances</span> : content}</>
}
