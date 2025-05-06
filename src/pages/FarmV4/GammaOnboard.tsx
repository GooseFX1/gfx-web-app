import { FC, useEffect, useRef, useState } from 'react'
import 'styled-components/macro'
import Slider from 'react-slick'
import { useConnectionConfig, useDarkMode } from '../../context'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay, DialogPortal
} from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'

const NextArrow: FC<{
  sliderRef: any
  currentSlide: number
  handleUserOnboading: any
}> = ({ sliderRef, currentSlide, handleUserOnboading }) => (
  <Button
    colorScheme={'blue'}
    variant={'secondary'}
    className={cn(
      `text-regular font-semibold cursor-pointer max-sm:w-2/5
      w-[130px] h-[35px] rounded-half bottom-1 bg-blue-1 z-10
      !flex flex-row items-center`,
      currentSlide > 3 && 'text-text-darkmode-tertiary'
    )}
    style={{
      justifySelf: 'anchor-center'
    }}
    onClick={() => {
      currentSlide !== 2 ? sliderRef.current.slickNext() : handleUserOnboading()
    }}
  >
    {currentSlide === 2 ? 'Start' : 'Next'}
  </Button>
)

const PrevArrow: FC<{
  sliderRef: any
  currentSlide: number
}> = ({ sliderRef, currentSlide }) => (
  <Button
    variant={'link'}
    className={cn(
      `dark:text-white text-blue-1 text-regular font-bold cursor-pointer 
     underline max-sm:w-auto opacity-100 transition-all duration-100 ease-in-out`,
      currentSlide == 0 && 'opacity-0 w-0 h-0 absolute'
    )}
    onClick={() => {
      sliderRef.current.slickPrev()
    }}
  >
    Previous
  </Button>
)

const GammaOnboard: FC<{
  container?: Element
}> = ({container}): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const sliderRef = useRef<any>()
  const { mode } = useDarkMode()
  const { userCache, updateUserCache } = useConnectionConfig()
  const { isMobile } = useBreakPoint()
  const handleUserOnboarding = () => {
    if (!userCache.gamma.hasGAMMAOnboarded) {
      updateUserCache({
        gamma: {
          ...userCache.gamma,
          hasGAMMAOnboarded: true
        }
      })
    }
  }

  //eslint-disable-next-line
  useEffect(() => {
    return () => handleUserOnboarding()
  }, [])

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    prevArrow: <></>,
    nextArrow: <></>,
    beforeChange: (_current, next) => {
      sliderRef && sliderRef.current && sliderRef.current.slickPause()
      setCurrentSlide(next)
    }
  }

  return (
    <Dialog
      open={!userCache.gamma.hasGAMMAOnboarded}
      onOpenChange={(v) => {
        if (!v) {
          handleUserOnboarding()
        }
      }}
    >
      <DialogPortal container={container}>
        <DialogOverlay className={'z-[52]'}/>
        <DialogContent
          onCloseAutoFocus={() => {
            handleUserOnboarding()
          }}
          className={cn(
            `rounded-2 border border-solid gap-0
          dark:border-black-4 border-grey-4 p-2.5 h-full dark:bg-black-2 bg-white flex-col flex z-[53]`,
            isMobile ? 'h-[353px] w-[95%]' : 'h-[320px] w-[400px]'
          )}
        >
          <DialogHeader className={'flex flex-row'}>
            <div className="text-regular font-semibold text-grey-9 mr-auto">
              <span className="text-purple-3 !font-semibold">Step {currentSlide + 1}</span> of 3
            </div>
            <DialogCloseDefault />
          </DialogHeader>
          <DialogBody>
            <Slider className={'h-full w-full'} {...settings} ref={sliderRef}>
              <div className="slide h-full">
                <img
                  src={`/img/assets/onboard_1_${mode}.svg`}
                  alt="welcome-icn"
                  className="mt-[22px] mb-3.75 mx-auto"
                />
                <p className="m-auto text-regular text-center font-semibold dark:text-grey-2 text-grey-1 max-w-[350px]">
                  Welcome to GooseFX's farm, where you can earn yield on your tokens by being a liquidity provider
                  (LP). Let’s get to know our main modes.
                </p>
              </div>
              <div className="slide">
                <img
                  src={`/img/assets/onboard_2_${mode}.svg`}
                  alt="welcome-icn"
                  className="mt-[22px] mb-3.75 mx-auto"
                />
                <p className="m-auto text-regular text-center font-semibold dark:text-grey-2 text-grey-1 max-w-[350px]">
                  Explore different pools or create your own, apply filters or change the layout.
                </p>
              </div>
              <div className="slide">
                <img
                  src={`/img/assets/onboard_3_${mode}.svg`}
                  alt="welcome-icn"
                  className="mt-[22px] mb-3.75 mx-auto"
                />
                <p className="m-auto text-regular text-center font-semibold dark:text-grey-2 text-grey-1 max-w-[350px]">
                  Visit the portfolio tab, to get a detail view about your deposits APR and more!
                </p>
              </div>
            </Slider>
          </DialogBody>
          <DialogFooter
            className={cn(
              'flex flex-row gap-4 justify-between transition-all duration-300',
              currentSlide == 0 && 'justify-center'
            )}
          >
            <PrevArrow sliderRef={sliderRef} currentSlide={currentSlide} />
            <NextArrow
              sliderRef={sliderRef}
              currentSlide={currentSlide}
              handleUserOnboading={handleUserOnboarding}
            />
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default GammaOnboard
