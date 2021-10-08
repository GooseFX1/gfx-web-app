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

        return (
          <WRAPPER key={index}>
            <Entry $entriesLength={PANELS_FIELDS[HistoryPanel.Balances].length}>
              <span>{getAskSymbolFromPair(pair)}</span>
              <span>{baseBalance}</span>
              <span>{baseAvailable}</span>
              <div>
                {!baseAvailable ? (
                  <span />
                ) : (
                  <MainButton
                    height="30px"
                    onClick={() => settleFunds(openOrder, baseAvailable, getAskSymbolFromPair(pair))}
                    status="action"
                    width="150px"
                  >
                    <span>Settle funds</span>
                  </MainButton>
                )}
              </div>
            </Entry>
            <Entry $entriesLength={PANELS_FIELDS[HistoryPanel.Balances].length}>
              <span>{getBidSymbolFromPair(pair)}</span>
              <span>{quoteBalance}</span>
              <span>{quoteAvailable}</span>
              <div>
                {!quoteAvailable ? (
                  <span />
                ) : (
                  <MainButton
                    height="30px"
                    onClick={() => settleFunds(openOrder, quoteAvailable, getBidSymbolFromPair(pair))}
                    status="action"
                    width="150px"
                  >
                    {' '}
                    <span>Settle funds</span>
                  </MainButton>
                )}
              </div>
            </Entry>
          </WRAPPER>
        )
      }),
    [getAskSymbolFromPair, getBidSymbolFromPair, getPairFromMarketAddress, openOrders, selectedCrypto, settleFunds]
  )

  return <>{!openOrders.length ? <span>No balances</span> : content}</>
}
