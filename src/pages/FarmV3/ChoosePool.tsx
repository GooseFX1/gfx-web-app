import { FC, useState, Dispatch, SetStateAction, useRef } from 'react'
import tw, { styled } from 'twin.macro'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'
import 'styled-components/macro'
import Slider from 'react-slick'
import { checkMobile } from '../../utils'
import { poolType, Pool } from './constants'
import { useSSLContext } from '../../context'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const STYLED_POPUP = styled(PopupCustom)<{
  currentSlide: number
  userAnswer: any
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
      w-[150px] h-9 rounded-half bottom-6 text-regular font-semibold 
        cursor-pointer z-10 !flex flex-row justify-center items-center absolute sm:w-2/5`}
    right: ${({ currentSlide }) => (currentSlide === 0 ? 'calc(50% - 76px)' : '10px')};
    background: ${({ currentSlide, userAnswer }) =>
      currentSlide === 1 && userAnswer.answerOne === null
        ? '#131313'
        : currentSlide === 2 && userAnswer?.answerTwo === null
        ? '#131313'
        : currentSlide === 3 && userAnswer?.answerThree === null
        ? '#131313'
        : '#5855FF'};
    cursor: ${({ currentSlide, userAnswer }) =>
      currentSlide === 1 && userAnswer?.answerOne === null
        ? 'not-allowed'
        : currentSlide === 2 && userAnswer?.answerTwo === null
        ? 'not-allowed'
        : currentSlide === 3 && userAnswer?.answerThree === null
        ? 'not-allowed'
        : 'pointer'};
  }
  .prev-btn {
    ${tw`dark:text-white text-blue-1 text-regular font-semibold cursor-pointer 
    text-regular font-semibold cursor-pointer z-10 left-2.5 bottom-8 underline
    !flex flex-row justify-center items-center absolute sm:w-2/5`}
  }
  .slide {
    * {
      ${tw`font-semibold text-center`}
    }
    h2 {
      ${tw`text-lg font-semibold dark:text-grey-5 text-black-4 mb-5 sm:text-average`}
    }
    .subText {
      ${tw`font-medium text-regular dark:text-grey-2 text-grey-1`}
    }
    .question {
      ${tw`font-semibold text-lg dark:text-grey-5 text-black-4 text-left mt-6 mb-3.75 sm:text-average`}
    }
    .cta {
      ${tw`text-white text-regular font-semibold cursor-pointer w-[152px] h-[50px] rounded-half
        mx-auto flex flex-row justify-center items-center mt-5 mb-3 sm:mt-[30px]`}
      background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
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
  ${tw`w-[460px] h-[58px] cursor-pointer rounded-average dark:bg-black-1 bg-grey-4 
  !text-left px-3.75 pt-3.75 text-average font-semibold dark:text-grey-2 text-grey-1 mb-3.75
  sm:w-[100%] sm:h-14 sm:text-regular`}
`
const Error = () => (
  <div tw="!text-left !font-medium text-tiny text-red-2 relative bottom-1.5">
    Oh, we need an answer in order to continue.
  </div>
)

const NextArrow: FC<{
  sliderRef: any
  currentSlide: number
  userAnswer: any
  setIsError: Dispatch<SetStateAction<boolean>>
}> = ({ sliderRef, currentSlide, userAnswer, setIsError }) =>
  currentSlide !== 4 && (
    <div
      className="next-btn"
      onClick={() => {
        ;(currentSlide === 1 && userAnswer?.answerOne === null) ||
        (currentSlide === 2 && userAnswer?.answerTwo === null) ||
        (currentSlide === 3 && userAnswer?.answerThree === null)
          ? setIsError(true)
          : sliderRef.current.slickNext()
      }}
    >
      {currentSlide === 0 ? 'Start' : currentSlide === 3 ? 'Show results' : 'Next'}
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
      Go Back
    </div>
  )

export const ChoosePool: FC<{
  poolSelection: boolean
  setPoolSelection: Dispatch<SetStateAction<boolean>>
}> = ({ poolSelection, setPoolSelection }): JSX.Element => {
  const { setPool } = useSSLContext()
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [userPool, setUserPool] = useState<Pool>(null)
  const [isError, setIsError] = useState<boolean>(false)
  const sliderRef = useRef<any>()

  const [userAnswer, setUserAnswer] = useState<any>({
    answerOne: null,
    answerTwo: null,
    answerThree: null
  })
  const [userSelection, setUserSelection] = useState<string>(null)

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
        userAnswer={userAnswer}
        setIsError={setIsError}
      />
    ),
    prevArrow: <PrevArrow sliderRef={sliderRef} currentSlide={currentSlide} setIsError={setIsError} />,
    beforeChange: (_current, next) => {
      sliderRef && sliderRef.current && sliderRef.current.slickPause()
      if (next === 4) calculateUserRisk()
      setCurrentSlide(next)
    }
  }

  //If 2 or more answers are for a specific pool type then return true else false
  const checkUserSelection = (value: string): boolean => {
    if (
      (userAnswer?.answerOne === value && userAnswer?.answerTwo === value && userAnswer?.answerThree === value) ||
      (userAnswer?.answerOne === value && userAnswer?.answerTwo === value) ||
      (userAnswer?.answerTwo === value && userAnswer?.answerThree === value) ||
      (userAnswer?.answerThree === value && userAnswer?.answerOne === value)
    )
      return true
    else return false
  }

  //If user selects 2 or more answer for a specific pool type (True case of above function)
  //then toggle to that pool else toggle to stable
  const calculateUserRisk = () => {
    if (checkUserSelection('stable')) {
      setUserSelection('stable')
      setUserPool(poolType.stable)
    } else if (checkUserSelection('primary')) {
      setUserSelection('primary')
      setUserPool(poolType.primary)
    } else if (checkUserSelection('hyper')) {
      setUserSelection('hyper')
      setUserPool(poolType.hyper)
    } else {
      setUserSelection('stable')
      setUserPool(poolType.stable)
    }
  }

  return (
    <STYLED_POPUP
      height={checkMobile() ? '363px' : '378px'}
      width={checkMobile() ? '95%' : '500px'}
      title={null}
      centered={true}
      visible={poolSelection ? true : false}
      onCancel={() => setPoolSelection(false)}
      footer={null}
      currentSlide={currentSlide}
      userAnswer={userAnswer}
    >
      <Slider {...settings} ref={sliderRef}>
        <div className="slide">
          <h2>Can’t Choose A Pool?</h2>
          <img
            src={'/img/assets/choosePool.svg'}
            alt="choose-pool"
            height={checkMobile() ? 140 : 159}
            width={170}
            tw="mx-auto"
          />
          <div className="subText">
            Let us help you understand your risk profile. Take a few moments to answer the questions and get a
            better understanding.
          </div>
        </div>
        <div className="slide">
          <div tw="absolute top-[-2px] text-average !text-grey-2 dark:!text-grey-1 sm:text-regular">
            <span tw="dark:text-grey-5 text-grey-1">Step 1</span> of 3
          </div>
          <div className="question">What are your risk preferences?</div>
          <OPTION
            className={userAnswer?.answerOne === 'stable' ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setUserAnswer((prev) => ({ ...prev, answerOne: 'stable' }))
              setIsError(false)
            }}
          >
            I'm all about playing it safe
          </OPTION>
          <OPTION
            className={userAnswer?.answerOne === 'primary' ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setUserAnswer((prev) => ({ ...prev, answerOne: 'primary' }))
              setIsError(false)
            }}
            tw="mb-3.75"
          >
            I'm willing to take a little risk
          </OPTION>
          <OPTION
            className={userAnswer?.answerOne === 'hyper' ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setUserAnswer((prev) => ({ ...prev, answerOne: 'hyper' }))
              setIsError(false)
            }}
            tw="mb-3.75"
          >
            I'm willing to take high risk
          </OPTION>
          {isError && <Error />}
        </div>
        <div className="slide">
          <div tw="absolute top-[-2px] text-average !text-grey-2 dark:!text-grey-1">
            <span tw="dark:text-grey-5 text-grey-1">Step 2</span> of 3
          </div>
          <div className="question">What is your desired timeframe?</div>
          <OPTION
            className={userAnswer?.answerTwo === 'stable' ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setUserAnswer((prev) => ({ ...prev, answerTwo: 'stable' }))
              setIsError(false)
            }}
          >
            Long term with stable yields
          </OPTION>
          <OPTION
            className={userAnswer?.answerTwo === 'primary' ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setUserAnswer((prev) => ({ ...prev, answerTwo: 'primary' }))
              setIsError(false)
            }}
            tw="mb-3.75"
          >
            Short term with risk high yields
          </OPTION>
          <OPTION
            className={userAnswer?.answerTwo === 'hyper' ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setUserAnswer((prev) => ({ ...prev, answerTwo: 'hyper' }))
              setIsError(false)
            }}
            tw="mb-3.75"
          >
            Short term with risk high yields
          </OPTION>
          {isError && <Error />}
        </div>
        <div className="slide">
          <div tw="absolute text-average top-[-2px] !text-grey-2 dark:!text-grey-1">
            <span tw="dark:text-grey-5 text-grey-1">Step 3</span> of 3
          </div>
          <div className="question">How do you want to manage your portfolio?</div>
          <OPTION
            className={userAnswer?.answerThree === 'stable' ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setUserAnswer((prev) => ({ ...prev, answerThree: 'stable' }))
              setIsError(false)
            }}
          >
            Passive, occasionally reviewing
          </OPTION>
          <OPTION
            className={userAnswer?.answerThree === 'primary' ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setUserAnswer((prev) => ({ ...prev, answerThree: 'primary' }))
              setIsError(false)
            }}
            tw="mb-3.75"
          >
            Active, making changes regularly
          </OPTION>
          <OPTION
            className={userAnswer?.answerThree === 'hyper' ? 'active' : isError === true ? 'error' : ''}
            onClick={() => {
              setUserAnswer((prev) => ({ ...prev, answerThree: 'hyper' }))
              setIsError(false)
            }}
            tw="mb-3.75"
          >
            Short term with risk high yields
          </OPTION>
          {isError && <Error />}
        </div>
        <div className="slide">
          <h2>Our Recommendation</h2>
          <img
            src={`/img/assets/${userSelection === 'stable' ? 'stable' : 'hyper'}_pool_choose.svg`}
            alt="choose-pool"
            height={checkMobile() ? '150px' : '162px'}
            width={checkMobile() ? '205px' : '170px'}
            tw="mx-auto"
          />
          {userSelection === 'stable' ? (
            <div className="subText">
              {checkMobile() && (
                <div tw="text-tiny font-medium dark:text-grey-2 text-grey-1">*Not financial advice</div>
              )}
              <span tw="dark:text-grey-5 text-black-4">Stable Pools</span> are the ideal choice for you, <br />{' '}
              with a bit more risk but higher returns.
            </div>
          ) : userSelection === 'primary' ? (
            <div className="subText">
              {checkMobile() && (
                <div tw="text-tiny font-medium dark:text-grey-2 text-grey-1">*Not financial advice</div>
              )}
              <span tw="dark:text-grey-5 text-black-4">Primary Pools</span> are the ideal choice for you, <br />{' '}
              with stable returns and balanced risk.
            </div>
          ) : (
            <div className="subText">
              {checkMobile() && (
                <div tw="text-tiny font-medium dark:text-grey-2 text-grey-1">*Not financial advice</div>
              )}
              <span tw="dark:text-grey-5 text-black-4">Hyper Pools</span> are the ideal choice for you, <br /> with
              stable returns and balanced risk.
            </div>
          )}
          <div
            className="cta"
            onClick={() => {
              setPoolSelection(false)
              setPool(userPool)
            }}
          >
            Start Earning
          </div>
          {!checkMobile() && (
            <div tw="text-tiny font-medium dark:text-grey-2 text-grey-1">*Not financial advice</div>
          )}
        </div>
      </Slider>
    </STYLED_POPUP>
  )
}
