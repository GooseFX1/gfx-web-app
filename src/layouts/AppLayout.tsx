import React, { FC, ReactNode } from 'react'
import { MainNav } from './MainNav'
import { useRewardToggle, useDarkMode } from '../context'
import { TermsOfService } from './TermsOfService'
import { Footer } from '@/layouts/Footer'
import { cn } from 'gfx-component-lib'

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { rewardModal } = useRewardToggle()
  const { mode } = useDarkMode()
  // To enable dark mode using tailwind - using dark:classname
  return (
    <div
      className={cn(
        `overflow-x-hidden min-w-vw min-h-vh max-sm:max-h-vh bg-background-lightmode-primary
     dark:bg-background-darkmode-primary`,
        rewardModal ? 'overflow-hidden' : '',
        mode === 'dark' ? 'dark' : ''
      )}
    >
      <MainNav />
      <TermsOfService />
      <div
        className={cn(`min-2xl:w-[2500px] m-auto min-md:mb-[45px] mt-[102px]`)}
        id="gfx-app-layout"
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}
