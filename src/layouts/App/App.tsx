import React, { FC, ReactNode } from 'react'
import { useRewardToggle } from '../../context'
import styled from 'styled-components'
import { Footer } from './Footer'
import { Header } from './Header'
import tw from "twin.macro"

const Wrapper = styled.div<{ $rewardModal: boolean }>`
  ${tw`overflow-x-hidden min-w-vw min-h-vh sm:max-h-vh`}
  overflow: ${({ $rewardModal }) => ($rewardModal ? 'hidden' : 'auto')};
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
