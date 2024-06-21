import React, { FC } from 'react'
import { useDarkMode } from '@/context'
import { Button, cn } from 'gfx-component-lib'
import Lottie from 'lottie-react'
import NoResultFarmdark from '@/animations/NoResultFarmdark.json'
import NoResultFarmlite from '@/animations/NoResultFarmlite.json'
import { navigateToCurried } from '@/utils/requests'
import { SOCIAL_MEDIAS } from '@/constants'

const NoResultsFound: FC<{ str?: string; subText?: string; requestPool?: boolean }> = ({
  str,
  subText,
  requestPool
}) => {
  const { mode } = useDarkMode()
  return (
    <div css={cn(` flex flex-col mt-[30px] max-sm:mt-0`, requestPool ? `h-[258px]` : `h-[208px]`)}>
      <div
        className="!h-[97px] max-sm:h-[81px]  flex flex-row justify-center items-center text-regular font-semibold
          dark:text-white text-black"
      >
        <Lottie
          animationData={mode === 'dark' ? NoResultFarmdark : NoResultFarmlite}
          className="h-[97px] max-sm:h-[81px] w-[168px] mx-auto"
        />
      </div>
      <div className="flex items-center flex-col">
        <div className="text-[20px] font-semibold text-black-4 dark:text-grey-5 mt-3"> {str}</div>
        <div className="text-regular w-[214px] text-center mt-[15px] text-grey-1 dark:text-grey-2">{subText}</div>
        {requestPool && (
          <Button
            colorScheme={'blue'}
            className={'w-[219px] mt-3.75'}
            onClick={navigateToCurried(SOCIAL_MEDIAS.discord, '_blank')}
          >
            Request Pool
          </Button>
        )}
      </div>
    </div>
  )
}
export default NoResultsFound
