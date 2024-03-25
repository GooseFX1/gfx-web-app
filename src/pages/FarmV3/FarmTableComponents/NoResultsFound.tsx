import React, { FC } from 'react'
import { useDarkMode } from '@/context'
import { cn } from 'gfx-component-lib'
import Lottie from 'lottie-react'
import NoResultFarmdark from '@/animations/NoResultFarmdark.json'
import NoResultFarmlite from '@/animations/NoResultFarmlite.json'

const NoResultsFound: FC<{ str?: string; subText?: string; requestPool?: boolean }> = ({
  str,
  subText,
  requestPool
}) => {
  const { mode } = useDarkMode()
  return (
    <div css={cn(` flex flex-col mt-[30px] sm:mt-0`, requestPool ? `h-[258px]` : `h-[208px]`)}>
      <div
        tw="!h-[97px] sm:h-[81px]  flex flex-row justify-center items-center text-regular font-semibold
          dark:text-white text-black"
      >
        <Lottie
          animationData={mode === 'dark' ? NoResultFarmdark : NoResultFarmlite}
          className="h-[97px] sm:h-[81px] w-[168px] mx-auto"
        />
      </div>
      <div className="flex items-center flex-col">
        <div className="text-[20px] font-semibold text-black-4 dark:text-grey-5 mt-3"> {str}</div>
        <div className="text-regular w-[214px] text-center mt-[15px] text-grey-1 dark:text-grey-2">{subText}</div>
        {requestPool && (
          <address
            className="w-[219px] h-8.75 cursor-pointer flex items-center justify-center mt-4 text-regular
            rounded-[30px] font-semibold bg-gradient-1 text-white"
          >
            <a
              href="https://discord.gg/cDEPXpY26q"
              className="font-semibold text-white"
              target="_blank"
              rel="noreferrer"
            >
              Request Pool
            </a>
          </address>
        )}
      </div>
    </div>
  )
}
export default NoResultsFound
