import React, { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Connection } from '@solana/web3.js'
import { CenteredDiv, CenteredImg } from '../../styles'
import { serum } from '../../web3'

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

  const fetchPrice = useCallback(async () => {
    setPrice(
      await serum.getLatestBid(
        new Connection(
          'https://green-little-wind.solana-mainnet.quiknode.pro/0e3bb9a62cf850ee8a4cf68dbb92aef6d4c97d0b/',
          'recent'
        ),
        'GOFX/USDC'
      )
    )
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timer
    fetchPrice().then(() => (interval = setInterval(() => fetchPrice(), 3000)))

    return () => clearInterval(interval)
  }, [fetchPrice])

  return (
    <WRAPPER>
      <CenteredImg>
        <img src={`${process.env.PUBLIC_URL}/img/crypto/GOFX.svg`} alt="" />
      </CenteredImg>
      <span>${price}</span>
    </WRAPPER>
  )
}
