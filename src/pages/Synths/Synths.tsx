import React, { FC } from 'react'
import styled from 'styled-components'
import { Pools } from './Pools'
import { Portfolio } from './Portfolio'
import { BottomContainer } from './LeftBottomView/Container'
import { SynthsProvider } from '../../context'

const WRAPPER = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.margins['5x']} 0;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: column;
  `};

  > div:first-child {
    display: flex;
    flex-direction: column;

    ${({ theme }) => theme.mediaWidth.upToLarge`
      width: 100%;
    `};
    ${({ theme }) => theme.mediaWidth.fromLarge`
      width: 60%;
      margin-right: ${({ theme }) => theme.margins['5x']};
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

export const SynthsContent: FC = () => {
  return (
    <WRAPPER>
      <div>
        <Pools />
        <BottomContainer />
      </div>
      <div>
        <Portfolio />
      </div>
    </WRAPPER>
  )
}

export const Synths: FC = () => {
  return (
    <SynthsProvider>
      <SynthsContent />
    </SynthsProvider>
  )
}
