import { FC } from 'react'
import useBoolean from '@/hooks/useBoolean'
import RewardsClose from '@/assets/rewards_close.svg?react'

const DocsBanner: FC = () => {
  const [showBanner, setShowBanner] = useBoolean(true)
  return (
    showBanner && (
      <div
        className="flex items-center justify-center h-8.75 w-full rounded-[4px]
      border border-solid border-grey-1 dark:border-grey-8 mb-3.75 relative"
      >
        <RewardsClose
          className={`absolute right-3 h-3 w-3 min-md:h-5 min-md:w-5 min-md:stroke-border-lightmode-primary 
    min-md:stroke-border-darkmode-primary min-md:dark:stroke-border-darkmode-primary cursor-pointer`}
          onClick={setShowBanner.off}
        />
        <span className="font-poppins text-regular font-semibold text-purple-3 mr-2">New to GooseFX?</span>
        <span className="text-regular font-semibold dark:text-grey-8 text-grey-1">
          {' '}
          Follow our{' '}
          <a
            className="font-bold text-regular dark:text-white text-blue-1 underline hover:underline visited:text-blue-1"
            href="https://docs.goosefx.io/features/farm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Guide
          </a>{' '}
          to get started.
        </span>
      </div>
    )
  )
}

export default DocsBanner
