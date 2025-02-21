import React, { FC, ReactNode } from 'react'
import { MainNav } from './MainNav'
import { useDarkMode, useRewardToggle } from '../context'
import { Footer } from '@/layouts/Footer'
import { cn } from 'gfx-component-lib'

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { rewardModal } = useRewardToggle()
  const { mode } = useDarkMode()

  // To enable dark mode using tailwind - using dark:classname
  return (
    <>
      <MainNav />
      <div
        className={cn(
          `overflow-x-hidden min-w-vw min-h-[calc(100vh_-_56px)] max-sm:max-h-vh flex flex-col
          bg-background-lightmode-primary dark:bg-background-darkmode-primary
          `,
          rewardModal ? 'overflow-hidden' : '',
          mode === 'dark' ? 'dark' : ''
        )}
      >
        <div className={`min-2xl:w-[2500px] min-md:mb-[45px]`} id="gfx-app-layout">
          {children}
        </div>
        <Footer />
      </div>
    </>
  )
}
