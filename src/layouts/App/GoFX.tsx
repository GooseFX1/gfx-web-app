import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { CenteredDiv, CenteredImg } from '../../styles'
import { serum } from '../../web3'
import { Orderbook } from '@project-serum/serum'
import { useConnectionConfig } from '../../context'

const WRAPPER = styled(CenteredDiv)`
  padding: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(1)}
    ${({ theme }) => theme.margin(1)};
  ${({ theme }) => theme.largeBorderRadius}
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.primary2};

  > div {
    ${({ theme }) => theme.measurements(theme.margin(3))}
    margin-right: ${({ theme }) => theme.margin(1)};
  }

  > span {
    font-size: 12px;
    font-weight: bold;
  }
`

export const GoFX: FC = () => {
  const [price, setPrice] = useState(0)
  const { connection } = useConnectionConfig()

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    !cancelled &&
      (async () => {
        const market = await serum.getMarket(connection, 'GOFX/USDC')
        const [[latestBid]] = (await market.loadBids(connection)).getL2(1)
        setPrice(latestBid)

        subscriptions.push(
          await serum.subscribeToOrderBook(connection, market, 'bids', (account, market) => {
            const [[current]] = Orderbook.decode(market, account.data).getL2(20)
            setPrice(current)
          })
        )
      })()

    return () => {
      cancelled = true
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [setPrice])

  return (
    <WRAPPER>
      <CenteredImg>
        <img src={`/img/crypto/GOFX.svg`} alt="" />
      </CenteredImg>
      <span>${price}</span>
    </WRAPPER>
  )
}
