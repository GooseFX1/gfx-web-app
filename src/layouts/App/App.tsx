import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'
import { Footer } from './Footer'
import { Header } from './Header'

const Wrapper = styled.div`
  background: ${({ theme }) => theme.bg2};
`

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Wrapper>
      <div className="App">
        <Header />
        {children}
        <Footer />
      </div>
    </Wrapper>
  )
}
