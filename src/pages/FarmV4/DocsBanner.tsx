import { FC } from 'react'
import useBoolean from '@/hooks/useBoolean'
import RewardsClose from '@/assets/rewards_close.svg?react'

const DocsBanner: FC = () => {
  const [showBanner, setShowBanner] = useBoolean(true)
  return (
    showBanner && (
      <div
        className="relative flex max-sm:items-start max-sm:flex-col min-md:items-center min-md:justify-center 
        w-full p-1 mb-3.75 rounded-[4px] bg-white dark:bg-black-2
        border border-solid border-grey-1 dark:border-grey-8 "
      >
        <RewardsClose
          className={`absolute max-sm:top-2 right-2 top-[10px] h-[12px] w-[12px] stroke-border-lightmode-primary 
          dark:stroke-border-darkmode-primary cursor-pointer`}
          onClick={setShowBanner.off}
        />
        <span className="font-poppins text-regular font-semibold text-purple-3 mr-1">New to GooseFX?</span>
        <span className="text-regular font-semibold dark:text-grey-8 text-grey-1">
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
