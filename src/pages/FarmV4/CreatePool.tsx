import React, { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import 'styled-components/macro'
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
import { useAccounts, useGamma, usePriceFeedFarm } from '@/context'
import useTransaction from '@/hooks/useTransaction'

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
  const { connected, wallet } = useWallet()
  const [poolExists, setPoolExists] = useBoolean(false)
  const [initialPrice, setInitialPrice] = useState<string>('')
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const { GammaProgram } = usePriceFeedFarm()
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const { setSendingTransaction, createPoolType, setCreatePoolType } = useGamma()
  const { getUIAmount } = useAccounts()
  const walletTokenA = useMemo(() => tokenA ? getUIAmount(tokenA?.address).toFixed(2) : '0.00', [tokenA, userPublicKey])
  const walletTokenB = useMemo(() => tokenB ? getUIAmount(tokenB?.address).toFixed(2) : '0.00', [tokenB, userPublicKey])

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

  const next = async () => {
    if (currentSlide !== 2) slider?.current?.slickNext()
    else {
      try {
        const txBuilder = createTransactionBuilder()
        const tx = await createPool(tokenA, tokenB, amountTokenA, amountTokenB, userPublicKey, GammaProgram)
        txBuilder.add(tx)
        setSendingTransaction(true)
        const { success } = await sendTransaction(txBuilder)

        if (!success) {
          console.log('failure')
          setSendingTransaction(false)
          return
        } else {
          setSendingTransaction(false)
        }
      } catch (e) {
        console.log('error while creating a new pool', e)
      }
    }
  }

  const prev = () => {
    slider?.current?.slickPrev()
    if (currentSlide == 1) {
      setTokenA(null)
      setTokenB(null)
      setAmountTokenA('')
      setAmountTokenB('')
      setPoolExists.off()
    }
  }

  const checkButtonStatus = useMemo(() => {
    if (currentSlide !== 1) return false
    else {
      if (!tokenA || !tokenB || !+amountTokenA || !+amountTokenB) return true
      if ((+amountTokenA && +amountTokenB) &&
        (+amountTokenA > +walletTokenA) || (+amountTokenB > +walletTokenB)) return true
      if (tokenA?.symbol === tokenB?.symbol) return true
      if (poolExists) return true
    }
  }, [currentSlide, tokenA, tokenB, amountTokenA, amountTokenB, walletTokenA, walletTokenB])

  return (
    <Dialog onOpenChange={(b) => {
      setIsCreatePool(b)
      if (!b) {
        setCreatePoolType('')
      }
    }} open={isCreatePool}>
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
              <Step1 slider={slider} setIsCreatePool={setIsCreatePool} setLocalPoolType={setCreatePoolType} />
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
                walletTokenA={walletTokenA}
                walletTokenB={walletTokenB}
              />
            </div>
            <div className="slide">
              <Step3
                tokenA={tokenA}
                tokenB={tokenB}
                amountTokenA={amountTokenA}
                amountTokenB={amountTokenB}
                localPoolType={createPoolType}
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
                  className={`prev-btn font-bold dark:text-white text-blue-1 text-regular cursor-pointer `}
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
                  disabled={checkButtonStatus}
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
