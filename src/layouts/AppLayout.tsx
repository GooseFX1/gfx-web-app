import React, { FC, ReactNode } from 'react'
// import { MainNav } from './MainNav'  
import { useDarkMode, useRewardToggle } from '../context'
// import { Footer } from '@/layouts/Footer'
import { cn } from 'gfx-component-lib'

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { rewardModal } = useRewardToggle()
  const { mode } = useDarkMode()
  // To enable dark mode using tailwind - using dark:classname
  return (
    <>
      {/* <MainNav /> */}
      <div
        className={cn(
          `overflow-hidden min-w-vw flex flex-col h-[100vh]
          bg-background-lightmode-primary dark:bg-background-darkmode-primary h-svh
          `,
          rewardModal ? 'overflow-hidden' : '',
          mode === 'dark' ? 'dark' : ''
        )}
      >
        <div className={`min-2xl:w-[2500px] overflow-scroll py-4 no-scrollbar`} id="gfx-app-layout">
          {children}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  )
}
