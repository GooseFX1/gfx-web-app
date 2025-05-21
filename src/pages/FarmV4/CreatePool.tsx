import React, { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import 'styled-components/macro'
import Slider from 'react-slick'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '@/layouts'
import CreatePoolChooseTokenStep from './CreatePoolChooseTokenStep'
import CreatePoolConfirmStep from './CreatePoolConfirmStep'
import {
  Button,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal
} from 'gfx-component-lib'
import useBoolean from '@/hooks/useBoolean'
import useBreakPoint from '@/hooks/useBreakPoint'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { createPool } from '@/web3/Farm'
import { CreationPoolFlowStateEnum, useConnectionConfig, useGamma, usePriceFeedFarm } from '@/context'
import useTransaction from '@/hooks/useTransaction'
import { notifyUsingPromiseForCreatePool } from '@/utils/perpsNotifications'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { INTERVALS } from '@/utils/time'
import { GAMMA_STABLE_TOKENS, POOL_TYPE } from '@/pages/FarmV4/constants'
import useGetGammaConfigIdQuery from '@/queries/GAMMA/pools/useGetGammaConfigIdQuery'
import { useMutation } from '@tanstack/react-query'
import useAddOrCheckTokenQuery from '@/queries/GAMMA/pools/useAddOrCheckTokenQuery'

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
  const [initialPrice, setInitialPrice] = useState<string>('')
  const [poolType, setPoolType] = useState<string | null>(null)

  const { GammaProgram } = usePriceFeedFarm()
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const {
    sendingTransaction,
    setSendingTransaction,
    forceCronAndUpdateLocalData,
    calculatePoolType,
    setCreatePoolState,
    updateGammaRoute
  } = useGamma()
  const { balance, publicKey } = useWalletBalance()

  const walletTokenA = balance[tokenA?.address].tokenAmount.uiAmountString
  const walletTokenB = balance[tokenB?.address].tokenAmount.uiAmountString
  const tokenAType = balance[tokenA?.address].tokenType
  const tokenBType = balance[tokenB?.address].tokenType

  const { connection } = useConnectionConfig()

  const ammConfigQuery = useGetGammaConfigIdQuery(0)

  useMemo(() => {
    if (tokenA && tokenB) {
      const isPrimary = calculatePoolType.has(tokenA.address) && calculatePoolType.has(tokenB.address)
      const isStable = GAMMA_STABLE_TOKENS.includes(tokenA.address) && GAMMA_STABLE_TOKENS.includes(tokenB.address)
      setPoolType(isStable ? 'Stable' : isPrimary ? POOL_TYPE.primary.name : POOL_TYPE.hyper.name)
    }
  }, [tokenA, tokenB])

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

  const addOrCheckTokenQueryTokenA = useAddOrCheckTokenQuery({ address: tokenA?.address })
  const addOrCheckTokenQueryTokenB = useAddOrCheckTokenQuery({ address: tokenB?.address })

  const createPoolMutation = useMutation({
    mutationFn: async () => {
      if (addOrCheckTokenQueryTokenA.isError) {
        throw new Error('Token A is not supported')
      }
      if (addOrCheckTokenQueryTokenB.isError) {
        throw new Error('Token B is not supported')
      }
      setCreatePoolState(CreationPoolFlowStateEnum.ON_CHAIN)
      const txBuilder = createTransactionBuilder()
      const tx = await createPool(
        tokenA,
        tokenB,
        amountTokenA,
        amountTokenB,
        publicKey,
        GammaProgram,
        connection,
        tokenAType,
        tokenBType,
        poolType,
        ammConfigQuery.data
      )
      txBuilder.add(tx)
      setSendingTransaction(true)
      setIsCreatePool(false)

      updateGammaRoute({
        mintA: tokenA,
        mintB: tokenB
      } as any)

      const { success, txSig } = await sendTransaction(
        txBuilder,
        { transactionDuration: INTERVALS.MINUTE * 5 },
        notifyUsingPromiseForCreatePool,
        true
      )
      setSendingTransaction(false)
      if (!success) {
        throw new Error('Transaction failed')
      }
      return txSig
    },
    onSuccess: async (txSig) => {
      setCreatePoolState(CreationPoolFlowStateEnum.GAMMA_API_UPDATING)
      await forceCronAndUpdateLocalData(txSig)
      setCreatePoolState(CreationPoolFlowStateEnum.QUERY_FETCHING)
    },
    onError: (e) => {
      console.error('Error while creating a new pool.', e)
      setCreatePoolState(CreationPoolFlowStateEnum.NONE)
      setSendingTransaction(false)
      setTokenA(null)
      setTokenB(null)
      setAmountTokenA('')
      setAmountTokenB('')
      slider.current.slickGoTo(0)

      updateGammaRoute()
    }
  })
  const next = async () => {
    if (currentSlide !== 1) slider?.current?.slickNext()
    else {
      createPoolMutation.mutate()
    }
  }

  const prev = () => {
    slider?.current?.slickPrev()
    if (currentSlide == 1) {
      setPoolExists.off()
    }
  }

  const checkButtonStatus = useMemo(() => {
    if (!tokenA || !tokenB || !+amountTokenA || !+amountTokenB) return true
    if ((+amountTokenA && +amountTokenB && +amountTokenA > +walletTokenA) || +amountTokenB > +walletTokenB)
      return true
    if (tokenA?.symbol === tokenB?.symbol) return true
    if (poolExists) return true
  }, [currentSlide, tokenA, tokenB, amountTokenA, amountTokenB, walletTokenA, walletTokenB])

  return (
    <Dialog
      onOpenChange={(b) => {
        setIsCreatePool(b)
        if (!b) {
          setPoolType(null)
          setTokenA(null)
          setTokenB(null)
          setAmountTokenA('')
          setAmountTokenB('')
          setCurrentSlide(0)
        }
      }}
      open={isCreatePool}
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          className={`flex flex-col gap-0 max-h-[700px] border-1 border-solid z-[1001] overflow-hidden
        dark:border-border-darkmode-secondary border-border-lightmode-secondary max-sm:rounded-b-none`}
          placement={breakpoint.isMobile ? 'bottom' : 'default'}
          size={'lg'}
        >
          <DialogHeader className={`relative`}>
            <img
              src="/img/assets/question-icn.svg"
              alt="primary"
              height={24}
              width={24}
              onClick={() =>
                window.open('https://docs.goosefx.io/goosefx-amm/gamma-for-pool-creators/how-to-create-a-new-pool')
              }
              className="absolute top-[14px] right-[45px] cursor-pointer z-[1000]"
            />

            <DialogCloseDefault
              className={'top-2 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 z-[1000]'}
            />
          </DialogHeader>
          <DialogBody className={'flex-col flex-[1 0] overflow-auto pb-0'}>
            <Slider ref={slider} {...settings}>
              <div className="slide">
                <CreatePoolChooseTokenStep
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
                  setIsCreatePool={setIsCreatePool}
                />
              </div>
              <div className="slide">
                <CreatePoolConfirmStep
                  tokenA={tokenA}
                  tokenB={tokenB}
                  amountTokenA={amountTokenA}
                  amountTokenB={amountTokenB}
                  initialPrice={initialPrice}
                />
              </div>
            </Slider>

            <div
              className={`flex justify-between border-t-1 solid flex-end
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
                  className={'w-[157px] font-bold next-btn ml-auto'}
                  disabled={checkButtonStatus || sendingTransaction}
                  onClick={next}
                >
                  {currentSlide === 0 ? 'Next' : 'Create & Deposit'}
                </Button>
              ) : (
                <Connect />
              )}
            </div>
          </DialogBody>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
