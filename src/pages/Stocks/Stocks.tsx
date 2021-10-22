import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Pools } from './Pools'
import { Portfolio } from './Portfolio'
import { Positions } from './Positions'
import { ENDPOINTS, SynthsProvider, useConnectionConfig } from '../../context'
import { notify } from '../../utils'

const WRAPPER = styled.div`
  display: flex;
  width: 80vw;
  padding: ${({ theme }) => theme.margins['5x']} 0;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: column;
  `};

  > div:first-child {
    ${({ theme }) => theme.flexColumnNoWrap}

    ${({ theme }) => theme.mediaWidth.upToLarge`
      width: 100%;
    `};

    ${({ theme }) => theme.mediaWidth.fromLarge`
      width: 60%;
      margin-right: ${({ theme }) => theme.margins['3x']};
    `};
  }

  > div:last-child {
    ${({ theme }) => theme.mediaWidth.upToLarge`
      width: 100%;
      margin-top: ${({ theme }) => theme.margins['5x']};
    `};

    ${({ theme }) => theme.mediaWidth.fromLarge`
      width: 40%;
    `};
  }
`

export const StocksContext: FC = () => {
  const [poolsVisible, setPoolsVisible] = useState(true)

  return (
    <WRAPPER>
      <div>
        <Pools poolsVisible={poolsVisible} />
        <Positions poolsVisible={poolsVisible} setPoolsVisible={setPoolsVisible} />
      </div>
      <div>
        <Portfolio />
      </div>
    </WRAPPER>
  )
}

export const Stocks: FC = () => {
  const { endpoint, setEndpoint, setRoute } = useConnectionConfig()

  useEffect(() => {
    setRoute('/stocks')
    if (endpoint !== ENDPOINTS[1].endpoint) {
      notify({ message: 'Synths is in beta. Switched to devnet' })
      setEndpoint(ENDPOINTS[1].endpoint)
    }
  }, [endpoint, setEndpoint, setRoute])

  return (
    <SynthsProvider>
      <StocksContext />
    </SynthsProvider>
  )
}
