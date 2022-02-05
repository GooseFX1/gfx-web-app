import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'
import { Footer } from './Footer'
import { Header } from './Header'

const Wrapper = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  background: ${({ theme }) => theme.bg2};
`

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Wrapper>
      <Header />
      {children}
      <Footer />
    </Wrapper>
  )
}
