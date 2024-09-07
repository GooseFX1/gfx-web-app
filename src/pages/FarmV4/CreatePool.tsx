import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { PopupCustom } from '../../components'
import 'styled-components/macro'
import Slider from 'react-slick'
import { checkMobile } from '../../utils'
import { useDarkMode } from '../../context'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '@/layouts'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import { Button, cn } from 'gfx-component-lib'
import useBoolean from '@/hooks/useBoolean'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { createPool } from '@/web3/Farm'

const STYLED_POPUP = styled(PopupCustom) <{
  currentSlide: number
  mode: string
}>`
    ${tw`dark:bg-black-2 bg-white rounded-[8px] z-[10] border border-solid dark:border-black-4 border-grey-4
    transition-all duration-300
    `}
  .ant-modal-content {
    height: 100%;
  }
  .ant-modal-close-x {
    > img {
      ${tw`!h-4 !w-4 absolute bottom-2 opacity-60`}
    }
  }
  .ant-modal-body {
    ${tw`p-0 transition-all duration-300`}
  }
  .next-btn {
    ${tw`text-regular font-semibold cursor-pointer bg-black-4 max-sm:w-2/5
      w-[157px] h-9 rounded-half bottom-3 text-regular font-semibold bg-blue-1
      cursor-pointer z-10 !flex flex-row justify-center items-center absolute right-2.5`}
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
      cursor: pointer;
  }
  .prev-btn {
    ${tw`dark:text-white text-blue-1 text-regular font-bold cursor-pointer 
    text-regular font-semibold cursor-pointer underline
    !flex flex-row justify-center items-center max-sm:bottom-5 max-sm:w-auto`}
  }
  .slick-slider{
    animation: animateHeight 0.5s;
  }
  .slick-list {
      animation: animateHeight 0.5s;
  }
    // to prevent flickering in when animating in with antd - should be replaced with dialog + slide from comp lib
  @keyframes animateHeight {
    from {
      height: 0;
    }
    to {
      height: max-content;
    }
  }
`

export const CreatePool: FC<{
  isCreatePool: boolean
  setIsCreatePool: Dispatch<SetStateAction<boolean>>
}> = ({ isCreatePool, setIsCreatePool }): JSX.Element => {
  const slider = React.useRef<Slider>(null)
  const { mode } = useDarkMode()
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [tokenA, setTokenA] = useState(null)
  const [amountTokenA, setAmountTokenA] = useState<string>('')
  const [tokenB, setTokenB] = useState(null)
  const [amountTokenB, setAmountTokenB] = useState<string>('')
  const [feeTier, setFeeTier] = useState<string>("0.01")
  const { connected } = useWallet()
  const [poolExists, setPoolExists] = useBoolean(false)
  const [localPoolType, setLocalPoolType] = useState<string>('')
  const [initialPrice, setInitialPrice] = useState<string>('')

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    beforeChange: (_current, next) => setCurrentSlide(next),
    prevArrow: <></>,
    nextArrow: <></>
  }

  const handleChange = (e, isSource: boolean) => {
    const inputNumber = e?.target?.value
    if (!e?.target?.value) {
      isSource ? setAmountTokenA('') : setAmountTokenB('')
    }
    if (!isNaN(+inputNumber)) {
      isSource ? setAmountTokenA(inputNumber) : setAmountTokenB(inputNumber)
    }
  }

  const next = () => {
    if(currentSlide !==2) slider?.current?.slickNext()
    else createPool(tokenA, tokenB, amountTokenA, amountTokenB)
  }
  const prev = () => {
    slider?.current?.slickPrev()
    if (currentSlide == 1) {
      setTokenA(null)
      setTokenB(null)
      setPoolExists.off()
    }
  }

  return (
    <STYLED_POPUP
      className={cn(
        checkMobile() ? 'min-h-[353px]' : 'min-h-[502px]'
      )}
      width={checkMobile() ? '95%' : '500px'}
      title={null}
      centered={true}
      visible={isCreatePool}
      onCancel={() => setIsCreatePool(false)}
      footer={null}
      currentSlide={currentSlide}
      mode={mode}
    >
      <Slider ref={slider} {...settings}>
        <div className="slide">
          <Step1 slider={slider} setIsCreatePool={setIsCreatePool} setLocalPoolType={setLocalPoolType} />
        </div>
        <div className="slide">
          <Step2
            tokenA={tokenA}
            setTokenA={setTokenA}
            tokenB={tokenB}
            setTokenB={setTokenB}
            handleChange={handleChange}
            amountTokenA={amountTokenA}
            amountTokenB={amountTokenB}
            feeTier={feeTier}
            setFeeTier={setFeeTier}
            poolExists={poolExists}
            setPoolExists={setPoolExists.set}
            initialPrice={initialPrice}
            setInitialPrice={setInitialPrice}
          />
        </div>
        <div className="slide">
          <Step3
            tokenA={tokenA}
            tokenB={tokenB}
            amountTokenA={amountTokenA}
            amountTokenB={amountTokenB}
            localPoolType={localPoolType}
            initialPrice={initialPrice}
          />
        </div>
      </Slider>
      {currentSlide != 0 && <div className={`flex justify-between border-t-1 solid
       border-border-lightmode-secondary dark:border-border-darkmode-secondary p-2.5 items-center`}>
        {currentSlide > 0 && <Button variant={'link'}
          className={`prev-btn font-bold dark:text-white text-blue-1 text-regular cursor-pointer `}
          colorScheme={'white'}
          disabled={currentSlide == 0}
          onClick={prev}
        >Back</Button>}
        {connected ? <Button colorScheme={'blue'}
          className={'w-[157px] font-bold next-btn'}
          disabled={currentSlide == 1 && !tokenA || !tokenB || !amountTokenA || !amountTokenB}
          onClick={next}
        >
          {currentSlide === 1 ? 'Next' : 'Create & Deposit'}
        </Button> : <Connect />}
      </div>}
    </STYLED_POPUP>
  )
}