import { FC, useState, Dispatch, SetStateAction, useRef } from 'react'
import tw, { styled } from 'twin.macro'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'
import 'styled-components/macro'
import Slider from 'react-slick'
import { checkMobile } from '../../utils'

const STYLED_POPUP = styled(PopupCustom)<{
  currentSlide: number
  isStableOne: boolean
  isStableTwo: boolean
  isStableThree: boolean
}>`
  .ant-modal-content {
    ${tw`h-full dark:bg-black-2 bg-grey-5 rounded-bigger`}
  }
  .ant-modal-close-x {
    > img {
      ${tw`sm:!h-4 sm:!w-4 absolute bottom-2 opacity-60`}
    }
  }
  .ant-modal-body {
    ${tw`p-5 sm:p-[15px]`}
  }
  .slick-prev {
    ${tw`text-white text-regular font-semibold cursor-pointer bg-blue-1 w-[152px] h-[50px] 
      rounded-half left-2.5 top-[330px] text-regular font-semibold cursor-pointer z-10
      sm:top-[470px] sm:left-0 !flex flex-row justify-center items-center`}
    &:before {
      display: none;
    }
  }
  .next-btn {
    ${tw`text-white text-regular font-semibold cursor-pointer bg-black-4 
        w-[152px] h-[50px] rounded-half bottom-2.5 text-regular font-semibold 
        cursor-pointer z-10 !flex flex-row justify-center items-center absolute`}
    right: ${({ currentSlide }) => (currentSlide === 0 ? 'calc(50% - 76px)' : '10px')};
    background: ${({ currentSlide, isStableOne, isStableTwo, isStableThree }) =>
      currentSlide === 1 && isStableOne === null
        ? '#131313'
        : currentSlide === 2 && isStableTwo === null
        ? '#131313'
        : currentSlide === 3 && isStableThree === null
        ? '#131313'
        : '#5855FF'};
    cursor: ${({ currentSlide, isStableOne, isStableTwo, isStableThree }) =>
      currentSlide === 1 && isStableOne === null
        ? 'not-allowed'
        : currentSlide === 2 && isStableTwo === null
        ? 'not-allowed'
        : currentSlide === 3 && isStableThree === null
        ? 'not-allowed'
        : 'pointer'};
  }
  .prev-btn {
    ${tw`text-white text-regular font-semibold cursor-pointer bg-blue-1 w-[152px] h-[50px] 
    rounded-half left-2.5 bottom-2.5 text-regular font-semibold cursor-pointer z-10
    !flex flex-row justify-center items-center absolute`}
  }
  .slide {
    * {
      ${tw`font-semibold text-center`}
    }
    h2 {
      ${tw`text-lg font-semibold dark:text-grey-5 text-black-4 mb-5 sm:mt-10`}
    }
    .subText {
      ${tw`font-medium text-regular dark:text-grey-2 text-grey-1 sm:w-[292px] sm:text-[13px]`}
    }
    .question {
      ${tw`font-semibold text-lg dark:text-grey-5 text-black-4 text-left mt-9 mb-[30px] sm:w-[292px] sm:text-[13px]`}
    }
    .cta {
      ${tw`text-white text-regular font-semibold cursor-pointer w-[152px] h-[50px] rounded-half
        mx-auto flex flex-row justify-center items-center mt-5 mb-3 sm:mt-[30px]`}
      background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
    }
    .disable {
    }
    .active {
      ${tw`text-white`}
      background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
    }
    .error {
      ${tw`border border-solid border-red-2`}
    }
  }
`

const OPTION = styled.div`
  ${tw`w-[460px] h-[60px] cursor-pointer rounded-average dark:bg-black-1 bg-grey-4 
  !text-left px-3.75 py-5 text-average font-semibold dark:text-grey-2 text-grey-1 mb-5`}
`
const Error = () => (
  <div tw="!text-left !font-medium text-tiny text-red-2">Oh, We need an answer in order to continue.</div>
)

const NextArrow: FC<{
  sliderRef: any
  currentSlide: number
  isStableOne: boolean
  isStableTwo: boolean
  isStableThree: boolean
  setIsError: Dispatch<SetStateAction<boolean>>
}> = ({ sliderRef, currentSlide, isStableOne, isStableTwo, isStableThree, setIsError }) =>
  currentSlide !== 4 && (
    <div
      className="next-btn"
      onClick={() => {
        ;(currentSlide === 1 && isStableOne === null) ||
        (currentSlide === 2 && isStableTwo === null) ||
        (currentSlide === 3 && isStableThree === null)
          ? setIsError(true)
          : sliderRef.current.slickNext()
      }}
    >
      {currentSlide !== 0 ? 'Next' : 'Start'}
    </div>
  )

const PrevArrow: FC<{
  sliderRef: any
  currentSlide: number
  setIsError: Dispatch<SetStateAction<boolean>>
}> = ({ sliderRef, currentSlide, setIsError }) =>
  currentSlide !== 0 &&
  currentSlide !== 1 &&
  currentSlide !== 4 && (
    <div
      className="prev-btn"
      onClick={() => {
        sliderRef.current.slickPrev()
        setIsError(false)
      }}
    >
      Back
    </div>
  )

export const ChoosePool: FC<{ poolSelection: boolean; setPoolSelection: Dispatch<SetStateAction<boolean>> }> = ({
  poolSelection,
  setPoolSelection
}): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isStableOne, setIsStableOne] = useState<boolean>(null)
  const [isStableTwo, setIsStableTwo] = useState<boolean>(null)
  const [isStableThree, setIsStableThree] = useState<boolean>(null)
  const [isStablePool, setIsStablePool] = useState<boolean>(null)
  const [isError, setIsError] = useState<boolean>(false)
  const sliderRef = useRef<any>()

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: (
      <NextArrow
        sliderRef={sliderRef}
        currentSlide={currentSlide}
        isStableOne={isStableOne}
        isStableTwo={isStableTwo}
        isStableThree={isStableThree}
        setIsError={setIsError}
      />
    ),
    prevArrow: <PrevArrow sliderRef={sliderRef} currentSlide={currentSlide} setIsError={setIsError} />,
    beforeChange: (_current, next) => {
      console.log('before change', next)
      sliderRef && sliderRef.current && sliderRef.current.slickPause()
      if (next === 4) calculateUserRisk()
      setCurrentSlide(next)
    }
  }

  const calculateUserRisk = () => {
    if (
      (isStableOne && isStableTwo) ||
      (isStableOne && isStableThree) ||
      (isStableTwo && isStableThree) ||
      (isStableOne && isStableTwo && isStableThree)
    )
      setIsStablePool(true)
    else setIsStablePool(false)
  }

  return (
    <STYLED_POPUP
      height={checkMobile() ? '520px' : '398px'}
      width={checkMobile() ? '355px' : '500px'}
      title={null}
      centered={true}
      visible={poolSelection ? true : false}
      onCancel={() => setPoolSelection(false)}
      footer={null}
      currentSlide={currentSlide}
      isStableOne={isStableOne}
      isStableTwo={isStableTwo}
      isStableThree={isStableThree}
    >
      <Slider {...settings} ref={sliderRef}>
        <div className="slide">
          <h2>Can’t Choose A Pool?</h2>
          <img
            src={'/img/assets/choosePool.svg'}
            alt="choose-pool"
            height={checkMobile() ? '150px' : '159px'}
            width={checkMobile() ? '205px' : '170px'}
            tw="mx-auto"
          />
          <div className="subText">
            Let's review your risk tolerance together! Take a short time to answer few questions to better
            understand your risk preferences.
          </div>
        </div>
        <div className="slide">
          <div tw="absolute text-average top-1 !text-grey-2 dark:!text-grey-1">
            <span tw="dark:text-grey-5 text-grey-1">Step 1</span> of 3
          </div>
          <div className="question">What are your risk preferences?</div>
          <OPTION
            className={isStableOne === true ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setIsStableOne(true)
              setIsError(false)
            }}
          >
            I'm all about playing it safe
          </OPTION>
          <OPTION
            className={isStableOne === false ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setIsStableOne(false)
              setIsError(false)
            }}
            tw="mb-3.75"
          >
            I'm willing to take a little risk
          </OPTION>
          {isError && <Error />}
        </div>
        <div className="slide">
          <div tw="absolute text-average top-1 !text-grey-2 dark:!text-grey-1">
            <span tw="dark:text-grey-5 text-grey-1">Step 2</span> of 3
          </div>
          <div className="question">What is your desired timeframe?</div>
          <OPTION
            className={isStableTwo === true ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setIsStableTwo(true)
              setIsError(false)
            }}
          >
            Long term with stable yields
          </OPTION>
          <OPTION
            className={isStableTwo === false ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setIsStableTwo(false)
              setIsError(false)
            }}
            tw="mb-3.75"
          >
            Short term with risk high yields
          </OPTION>
          {isError && <Error />}
        </div>
        <div className="slide">
          <div tw="absolute text-average top-1 !text-grey-2 dark:!text-grey-1">
            <span tw="dark:text-grey-5 text-grey-1">Step 3</span> of 3
          </div>
          <div className="question">How do you want to manage your portfolio?</div>
          <OPTION
            className={isStableThree === true ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setIsStableThree(true)
              setIsError(false)
            }}
          >
            Passive, occasionally reviewing
          </OPTION>
          <OPTION
            className={isStableThree === false ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setIsStableThree(false)
              setIsError(false)
            }}
            tw="mb-3.75"
          >
            Active, making changes regularly
          </OPTION>
          {isError && <Error />}
        </div>
        <div className="slide">
          <h2>Our Recommendation</h2>
          <img
            src={`/img/assets/${isStablePool ? 'stable' : 'hyper'}_pool_choose.svg`}
            alt="choose-pool"
            height={checkMobile() ? '150px' : '162px'}
            width={checkMobile() ? '205px' : '170px'}
            tw="mx-auto"
          />
          {!isStablePool ? (
            <div className="subText">
              <span tw="dark:text-grey-5 text-black-4">Hyper Pools</span> are the ideal choice for you, <br /> with
              a bit more risk but higher returns.
            </div>
          ) : (
            <div className="subText">
              <span tw="dark:text-grey-5 text-black-4">Stable Pools</span> are the ideal choice for you, <br />{' '}
              with stable returns and balanced risk.
            </div>
          )}
          <div
            className="cta"
            onClick={() => {
              setPoolSelection(false)
            }}
          >
            Start Earning
          </div>
          <div tw="text-tiny font-medium dark:text-grey-2 text-grey-1">*Not financial advice</div>
        </div>
      </Slider>
    </STYLED_POPUP>
  )
}
