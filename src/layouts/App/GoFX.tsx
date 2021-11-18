import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Connection } from '@solana/web3.js'
import { CenteredDiv, CenteredImg } from '../../styles'
import { serum } from '../../web3'
import { Orderbook } from '@project-serum/serum'
import { ENDPOINTS } from '../../context'

const WRAPPER = styled(CenteredDiv)`
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2x']}
    ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['1x']};
  ${({ theme }) => theme.largeBorderRadius}
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.primary2};

  > div {
    ${({ theme }) => theme.measurements(theme.margins['3x'])}
    margin-right: ${({ theme }) => theme.margins['1x']};
  }

  > span {
    font-size: 12px;
    font-weight: bold;
  }
`

export const GoFX: FC = () => {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []
    const connection = new Connection(ENDPOINTS[1].endpoint, 'recent')

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
        <img src={`${process.env.PUBLIC_URL}/img/crypto/GOFX.svg`} alt="" />
      </CenteredImg>
      <span>${price}</span>
    </WRAPPER>
  )
}
