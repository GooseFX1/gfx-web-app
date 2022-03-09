import React, { FC, ReactNode } from 'react'
import { useRewardToggle } from '../../context'
import styled from 'styled-components'
import { Footer } from './Footer'
import { Header } from './Header'

const Wrapper = styled.div<{ $rewardModal: boolean }>`
  overflow: ${({ $rewardModal }) => ($rewardModal ? 'hidden' : 'auto')}
  min-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  background: ${({ theme }) => theme.bg2};
`

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { rewardModal } = useRewardToggle()
  return (
    <Wrapper $rewardModal={rewardModal}>
      <Header />
      {children}
      <Footer />
    </Wrapper>
  )
}
