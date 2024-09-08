import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import Slider from 'react-slick'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '@/layouts'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import {
  Button,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogHeader,
  DialogOverlay
} from 'gfx-component-lib'
import useBoolean from '@/hooks/useBoolean'
import useBreakPoint from '@/hooks/useBreakPoint'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { createPool } from '@/web3/Farm'

export const CreatePool: FC<{
  isCreatePool: boolean
  setIsCreatePool: Dispatch<SetStateAction<boolean>>
}> = ({ isCreatePool, setIsCreatePool }): JSX.Element => {
  const slider = React.useRef<Slider>(null)
  const breakpoint = useBreakPoint()
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [tokenA, setTokenA] = useState(null)
  const [amountTokenA, setAmountTokenA] = useState<string>('')
  const [tokenB, setTokenB] = useState(null)
  const [amountTokenB, setAmountTokenB] = useState<string>('')
  const [feeTier, setFeeTier] = useState<string>('0.01')
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
    <Dialog onOpenChange={setIsCreatePool} open={isCreatePool}>
      <DialogOverlay />
      <DialogContent
        className={`flex flex-col gap-0 max-h-[700px] border-1 border-solid z-[1001] overflow-hidden
        dark:border-border-darkmode-secondary border-border-lightmode-secondary max-sm:rounded-b-none`}
        placement={breakpoint.isMobile ? 'bottom' : 'default'}
      >
        <DialogHeader className={`relative`}>
          <DialogCloseDefault
            className={'top-2 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 z-[1000]'}
          />
        </DialogHeader>
        <DialogBody className={'flex-col flex-[1 0] overflow-auto pb-0'}>
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
          {currentSlide != 0 && (
            <div
              className={`flex justify-between border-t-1 solid
                 border-border-lightmode-secondary dark:border-border-darkmode-secondary 
                 p-2.5 items-center`}
            >
              {currentSlide > 0 && (
                <Button
                  variant={'link'}
                  className={`prev-btn font-bold dark:text-white text-blue-1 text-regular 
                                        cursor-pointer `}
                  colorScheme={'white'}
                  disabled={currentSlide == 0}
                  onClick={prev}
                >
                  Back
                </Button>
              )}
              {connected ? (
                <Button
                  colorScheme={'blue'}
                  className={'w-[157px] font-bold next-btn'}
                  disabled={currentSlide == 1 ? !tokenA || !tokenB : !amountTokenA || !amountTokenB}
                  onClick={next}
                >
                  {currentSlide === 1 ? 'Next' : 'Create & Deposit'}
                </Button>
              ) : (
                <Connect />
              )}
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
