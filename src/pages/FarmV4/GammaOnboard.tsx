import { FC, useEffect, useRef, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { PopupCustom } from '../../components'
import 'styled-components/macro'
import Slider from 'react-slick'
import { checkMobile } from '../../utils'
import { useConnectionConfig, useDarkMode } from '../../context'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Button } from 'gfx-component-lib'

const STYLED_POPUP = styled(PopupCustom) <{
  currentSlide: number
  mode: string
}>`
  .ant-modal-content {
    ${tw`h-full dark:bg-black-2 bg-white rounded-[8px] z-[10] border border-solid dark:border-black-4 border-grey-4`}
  }
  .ant-modal-close {
    ${tw`top-3 right-3`}
  }
  .ant-modal-close-x {
    > img {
      ${tw`h-4 w-4 opacity-60`}
    }
  }
  .ant-modal-body {
    ${tw`p-2.5`}
  }
  .next-btn {
    ${tw`text-regular font-semibold cursor-pointer max-sm:w-2/5
      w-[130px] h-[35px] rounded-half bottom-1 bg-blue-1 z-10
      !flex flex-row justify-center items-center absolute`}
    right: ${({ currentSlide }) => (currentSlide === 0 ? 'calc(50% - 65px)' : '10px')};
    color: ${({ currentSlide }) =>
    currentSlide === 1
      ? '#FFFFFF'
      : currentSlide === 2
        ? '#FFFFFF'
        : currentSlide === 3
          ? '#FFFFFF'
          : currentSlide === 0
            ? '#FFFFFF'
            : '#636363'};
  }
  .prev-btn {
    ${tw`dark:text-white text-blue-1 text-regular font-bold cursor-pointer 
    left-2.5 bottom-2 underline absolute max-sm:bottom-5 max-sm:w-auto`}
  }
  .slick-slider{
    ${tw`h-full`}
  }
  .lite-mode-txt{
    font-size: 15px;
    font-weight: bold;
    background: -webkit-linear-gradient(90deg, #2BC7F2 13.68%, #30E19E 33.53%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .pro-mode-txt{
    font-size: 15px;
    font-weight: bold;
    background: -webkit-linear-gradient(90deg, #724FFF 13.68%, #C121F0 33.53%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const NextArrow: FC<{
  sliderRef: any
  currentSlide: number
  handleUserOnboading: any
}> = ({ sliderRef, currentSlide, handleUserOnboading }) => (
  <Button
    colorScheme={'blue'}
    variant={'secondary'}
    className="next-btn !font-bold"
    onClick={() => {
      currentSlide !== 2 ?
        sliderRef.current.slickNext() :
        handleUserOnboading()
    }}
  >
    {currentSlide === 2 ? 'Start' : 'Next'}
  </Button>
)

const PrevArrow: FC<{
  sliderRef: any
  currentSlide: number
}> = ({ sliderRef, currentSlide }) =>
    currentSlide !== 0 && (
      <Button
        variant={'link'}
        className={'prev-btn'}
        onClick={() => {
          sliderRef.current.slickPrev()
        }}
      >
        Previous
      </Button>
    )

const GammaOnboard: FC = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const sliderRef = useRef<any>()
  const { mode } = useDarkMode()
  const { userCache, updateUserCache } = useConnectionConfig();

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
    return () => handleUserOnboarding();
  }, [])

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    nextArrow: (
      <NextArrow
        sliderRef={sliderRef}
        currentSlide={currentSlide}
        handleUserOnboading={handleUserOnboarding}
      />
    ),
    prevArrow: <PrevArrow sliderRef={sliderRef} currentSlide={currentSlide} />,
    beforeChange: (_current, next) => {
      sliderRef && sliderRef.current && sliderRef.current.slickPause()
      setCurrentSlide(next)
    }
  }

  return (
    <STYLED_POPUP
      height={checkMobile() ? '353px' : '320px'}
      width={checkMobile() ? '95%' : '400px'}
      title={null}
      centered={true}
      open={!userCache.gamma.hasGAMMAOnboarded}
      onCancel={handleUserOnboarding}
      footer={null}
      currentSlide={currentSlide}
      mode={mode}
    >
      <Slider {...settings} ref={sliderRef}>
        <div className="slide">
          <div className="text-regular font-semibold text-grey-9">
            <span className="text-purple-3 !font-semibold">Step 1</span> of 3
          </div>
          <img
            src={`img/assets/welcome_${mode}.svg`}
            alt="welcome-icn"
            className='mt-[22px] mb-3.75 mx-auto'
          />
          <p className='m-auto text-regular text-center font-semibold dark:text-grey-2 text-grey-1 max-w-[350px]'>
            Welcome to GooseFX's farm, where you can earn yield on your tokens by being a liquidity provider (LP).
            Let’s get to know our main modes.
          </p>
        </div>
        <div className="slide">
          <div className="text-regular font-semibold text-grey-9">
            <span className="text-purple-3 !font-semibold">Step 2</span> of 3
          </div>
          <img
            src={`img/assets/welcome_lite_${mode}.svg`}
            alt="welcome-icn"
            className='mt-[22px] mb-3.75 mx-auto'
          />
          <div className='text-regular text-center font-semibold dark:text-grey-2 text-grey-1 mb-1.5'>
            <span className='lite-mode-txt'>Lite Mode:&nbsp;</span>
            A more simple experience if you are<br/>new to liquidity providing on DEXs!
          </div>
          <div className='text-regular text-center text-tiny dark:text-grey-1 text-grey-9'>
            Remember you can switch back at any time :)
          </div>
        </div>
        <div className="slide">
          <div className="text-regular font-semibold text-grey-9">
            <span className="text-purple-3 !font-semibold">Step 3</span> of 3
          </div>
          <img
            src={`img/assets/welcome_pro_${mode}.svg`}
            alt="welcome-icn"
            className='mt-[22px] mb-3.75 mx-auto'
          />
          <div className='text-regular text-center font-semibold dark:text-grey-2 text-grey-1 mb-1.5'>
            <span className='pro-mode-txt'>Pro Mode:&nbsp;</span>
            Unlock advanced features, portfolio tracking, stats & more! For experienced users.
          </div>
          <div className='text-regular text-center text-tiny dark:text-grey-1 text-grey-9'>
            Remember you can switch back at any time :)
          </div>
        </div>
      </Slider>
    </STYLED_POPUP>
  )
}

export default GammaOnboard
