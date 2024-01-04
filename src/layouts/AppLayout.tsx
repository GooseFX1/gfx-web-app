import React, { FC, ReactNode } from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'
import { MainNav } from './MainNav'
import { Footer } from './Footer'
import { useRewardToggle, useDarkMode } from '../context'
import { TermsOfService } from './TermsOfService'
import 'styled-components/macro'

const Wrapper = styled.div<{ $rewardModal: boolean }>`
  ${tw`overflow-x-hidden min-w-vw min-h-vh sm:max-h-vh`}
  overflow: ${({ $rewardModal }) => ($rewardModal ? 'hidden' : 'auto')};
  background: ${({ theme }) => theme.bg2};
`

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { rewardModal } = useRewardToggle()
  const { mode } = useDarkMode()
  return (
    <Wrapper $rewardModal={rewardModal} className={mode === 'dark' ? 'dark' : ''}>
      {/*To enable dark mode using tailwind - using dark:classname*/}
      <MainNav />
      <TermsOfService />
      <div css={[tw`min-2xl:w-[2500px] m-auto mt-14`]} id="gfx-app-layout">
        {children}
      </div>
      <Footer />
    </Wrapper>
  )
}
