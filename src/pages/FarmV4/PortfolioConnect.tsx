import React, { FC } from 'react'
import { useDarkMode } from '../../context'
import { Connect } from '@/layouts'
import Lottie from 'lottie-react'
import ProfileLockedDark from '@/animations/profile_locked_dark.json'
import ProfileLockedLite from '@/animations/profile_locked_lite.json'

const PortfolioConnect: FC = (): JSX.Element => {
    const { isDarkMode } = useDarkMode()
    return(
        <div className="flex flex-col items-center justify-center h-[calc(100vh-278px)]">
            <Lottie
              animationData={isDarkMode ? ProfileLockedDark : ProfileLockedLite}
              className="h-[97px] max-sm:h-[81px] w-[168px] mx-auto"
            />
        <div className="font-semibold text-lg font-poppins dark:text-grey-8 text-black-4 mt-3.75">Portfolio</div>
        <div className="font-semibold text-regular dark:text-grey-2 text-grey-1 text-center mb-3.75 mt-1">
          Connect your wallet to view your portfolio, <br /> track pool, token value and more.
        </div>
        <Connect />
      </div>
    )
}

export default PortfolioConnect