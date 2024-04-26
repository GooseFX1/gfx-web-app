import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import Lottie from 'lottie-react'
import { Dialog, DialogBody, DialogCloseDefault, DialogContent, DialogOverlay } from 'gfx-component-lib'
import GeoRestrictedDark from '../animations/GeorestrictedDark.json'
import GeoRestrictedLite from '../animations/GeorestrictedLite.json'
import { useDarkMode } from '@/context'
import useBreakPoint from '@/hooks/useBreakPoint'

export const GeorestrictionModal: FC<{
  geoBlocked: boolean
  setGeoBlocked: Dispatch<SetStateAction<boolean>>
}> = ({ geoBlocked, setGeoBlocked }) => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()

  const Content = useMemo(
    () => (
      <>
        <h5 className="dark:text-grey-8 text-black-4 text-lg font-semibold mb-2.5 sm:ml-1">Georestricted</h5>
        <Lottie
          animationData={mode === 'dark' ? GeoRestrictedDark : GeoRestrictedLite}
          className="h-[118px] w-[170px] mx-auto"
        />
        <div className="px-5">
          <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold mt-3.75 mb-6 font-nunito">
            Oops, It looks like you're trying to use GooseFX from a location where access is restricted according
            to our{' '}
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
    ),
    [breakpoint, mode]
  )
  return (
    <Dialog open={geoBlocked} onOpenChange={setGeoBlocked}>
      <DialogOverlay />
      <DialogContent
        className={'p-3 w-[400px] h-[336px] sm:rounded-b-none sm:rounded-t-small sm:w-full'}
        placement={breakpoint.isMobile ? 'bottom' : 'default'}
      >
        <DialogCloseDefault />
        <DialogBody className={'w-full mx-auto flex-col'}>{Content}</DialogBody>
      </DialogContent>
    </Dialog>
  )
}
