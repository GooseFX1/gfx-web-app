import { memo } from 'react'
import { useDarkMode } from '@/context'
import Lottie from 'lottie-react'
import GeoRestrictedDark from '../../animations/GeorestrictedDark.json'
import GeoRestrictedLite from '../../animations/GeorestrictedLite.json'

export const GeorestrictionBodyContent = memo(() => {
  const { isDarkMode } = useDarkMode()
  return (
    <>
      <h5 className="dark:text-grey-8 text-black-4 text-lg font-semibold mb-2.5 sm:ml-1">Georestricted</h5>
      <Lottie
        animationData={isDarkMode ? GeoRestrictedDark : GeoRestrictedLite}
        className="h-[118px] w-[170px] mx-auto"
      />
      <div className="px-5">
        <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold mt-3.75 mb-6 font-nunito">
          Oops, It looks like you're trying to use GooseFX from a location where access is restricted according to
          our{' '}
          <a
            href="https://www.goosefx.io/terms"
            target={'_blank'}
            rel="noreferrer"
            className="font-bold dark:text-white text-blue-1 underline 
            hover:dark:text-white hover:text-blue-1 hover:underline"
          >
            Terms and Conditions
          </a>
          .
        </div>
        <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold font-nunito">
          We are sorry but you won't be able to connect your wallet or use the platform.
        </div>
      </div>
    </>
  )
})

GeorestrictionBodyContent.displayName = "GeorestrictionBodyContent"
