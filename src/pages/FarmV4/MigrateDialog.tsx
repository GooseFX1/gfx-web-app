import React, { FC, useState } from 'react'
import Slider from 'react-slick'
import useBreakPoint from '@/hooks/useBreakPoint'
import useBoolean from '@/hooks/useBoolean'
import {
  Button,
  Dialog,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogCloseDefault,
  Icon
} from 'gfx-component-lib'
import { TokenListToken } from '@/context/gamma'
import Decimal from 'decimal.js-light'
import { numberFormatter } from '@/utils'

interface MigrateDialogProps {
  isOpen: boolean
  onClose: () => void
  positions: MigratePosition[]
}

const MigrateDialog: FC<MigrateDialogProps> = ({ isOpen, onClose, positions }) => {
  const breakpoint = useBreakPoint()
  const slider = React.useRef<Slider>(null)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [selectedPosition, setSelectedPosition] = useState<MigratePosition | null>(null)
  const [isMigrating, setIsMigrating] = useBoolean(false)

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
  const platforms = {
    Raydium: '/img/crypto/raydium.svg',
    Orca: '/img/crypto/ORCA.svg',
    Meteora: '/img/crypto/meteora.svg'
  }

  const handleSelectPosition = (pos: MigratePosition) => {
    setSelectedPosition(pos)
    setCurrentSlide(1)
    slider.current?.slickNext()
  }

  const handleMigrate = async () => {
    console.log(selectedPosition)
    setIsMigrating.on()
    setTimeout(setIsMigrating.off, 2000)
  }

  const prev = () => {
    slider?.current?.slickPrev()
    if (currentSlide == 1) return
  }

  const calcUSDValue = (
    tokenAAmount: number,
    tokenA: TokenListToken,
    tokenBAmount: number,
    tokenB: TokenListToken
  ): Decimal => {
    const priceA = new Decimal(tokenAAmount).mul(tokenA.price)
    const priceB = new Decimal(tokenBAmount).mul(tokenB.price)
    const total = priceA.add(priceB).toNumber()
    return numberFormatter(total, 2)
  }

  return (
    <Dialog onOpenChange={(b) => onClose(b)} open={isOpen}>
      <DialogOverlay />
      <DialogContent
        className={`flex flex-col gap-0 max-h-[700px] border-1 border-solid z-[1001] overflow-hidden
        dark:border-border-darkmode-secondary border-border-lightmode-secondary max-sm:rounded-b-none`}
        placement={breakpoint.isMobile ? 'bottom' : 'default'}
        size={'lg'}
      >
        <DialogHeader
          className={`relative flex p-2.5 border-solid dark:border-black-4
             border-grey-4 border-b-[1px]`}
        >
          <div className="flex items-center gap-1">
            <span className="text-purple-3">Step {currentSlide + 1}</span>{' '}
            <span className="dark:text-grey-2 text-grey-1">of 2</span>
          </div>
          <DialogTitle className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2 text-left">
            {currentSlide == 0 ? 'Select Position' : 'Review & Migrate'} ({positions[0].tokenA.symbol}-
            {positions[0].tokenB.symbol})
          </DialogTitle>

          <DialogCloseDefault
            className={'top-2 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 z-[1000]'}
          />
        </DialogHeader>
        <DialogBody className={'flex-col flex-[1 0] overflow-auto pb-0'}>
          <Slider ref={slider} {...settings}>
            <div className="slide">
              <SelectPositions
                positions={positions}
                handleSelectPosition={handleSelectPosition}
                platforms={platforms}
                calcUSDValue={calcUSDValue}
              />
            </div>
            {selectedPosition && (
              <div className="slide">
                <ReviewAndMigrate position={selectedPosition} platforms={platforms} calcUSDValue={calcUSDValue} />
              </div>
            )}
          </Slider>
          {currentSlide > 0 && (
            <div
              className={`flex justify-between border-t-1 solid
                 border-border-lightmode-secondary dark:border-border-darkmode-secondary 
                 p-2.5 items-center`}
            >
              <Button
                variant={'link'}
                className={`prev-btn font-bold dark:text-white text-blue-1 text-regular cursor-pointer `}
                colorScheme={'white'}
                disabled={currentSlide == 0}
                onClick={prev}
              >
                Back
              </Button>
              <Button
                colorScheme={'blue'}
                className={'w-[220px] font-bold next-btn'}
                onClick={handleMigrate}
                disabled={selectedPosition === null || isMigrating}
                isLoading={isMigrating}
              >
                Migrate
              </Button>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

const SelectPositions: FC<{
  positions: MigratePosition[]
  platforms: Record<string, string>
  handleSelectPosition: (pos: MigratePosition) => void
  calcUSDValue: (
    tokenAAmount: number,
    tokenA: TokenListToken,
    tokenBAmount: number,
    tokenB: TokenListToken
  ) => Decimal
}> = ({ positions, handleSelectPosition, platforms, calcUSDValue }) => (
  <div className="p-2.5 max-h-[412px] overflow-scroll">
    {positions.map((p) => {
      const amountA = new Decimal(p.amountTokenA.toString()).div(10 ** p.tokenA.decimals)
      const amountB = new Decimal(p.amountTokenB.toString()).div(10 ** p.tokenB.decimals)

      return (
        <div
          key={p.source}
          className={`p-2.5 mb-2 dark:bg-black-1 bg-grey-5 rounded-[4px]
                border-solid dark:border-black-4 border-grey-4 border-[1px]
                hover:border-grey-1 hover:dark:border-white hover:cursor-pointer
              `}
          onClick={() => handleSelectPosition(p)}
        >
          <div className="flex items-center gap-1 mb-2">
            <Icon src={platforms[p.source]} className={'rounded-full'} size={'sm'} />
            <h3>{p.source}</h3>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span>Token A Amount</span>
            <span className="flex items-center gap-1">
              <Icon
                src={p.tokenA.logoURI}
                className={'border-solid dark:border-black-2 border-white border-[1px] rounded-full'}
                size={'sm'}
              />
              <p>
                {numberFormatter(amountA.toString(), 2)} {p.tokenA.symbol}
              </p>
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span>Token B Amount</span>
            <span className="flex items-center gap-1">
              <Icon
                src={p.tokenB.logoURI}
                className={'border-solid dark:border-black-2 border-white border-[1px] rounded-full'}
                size={'sm'}
              />
              <p>
                {numberFormatter(amountB.toString(), 2)} {p.tokenB.symbol}
              </p>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>USD Value</span>
            <span>
              <p>${calcUSDValue(amountA.toNumber(), p.tokenA, amountB.toNumber(), p.tokenB)}</p>
            </span>
          </div>
        </div>
      )
    })}
  </div>
)

const ReviewAndMigrate: FC<{
  position: MigratePosition
  platforms: Record<string, string>
  calcUSDValue: (
    tokenAAmount: number,
    tokenA: TokenListToken,
    tokenBAmount: number,
    tokenB: TokenListToken
  ) => Decimal
}> = ({ position, platforms, calcUSDValue }) => (
  <div className="p-2.5 max-h-[412px] overflow-scroll">
    <div
      key={position.source}
      className={`p-2.5 mb-2 dark:bg-black-1 bg-grey-5 rounded-[4px]
                border-solid dark:border-black-4 border-grey-4 border-[1px]
              `}
    >
      <div className="flex items-center justify-between mb-2">
        <span>Pool</span>

        <div className="grid grid-cols-[0.5fr_1.3fr] gap-1 items-start">
          <div className="relative">
            <Icon
              src={position.tokenA.logoURI}
              className={
                'absolute top-[-2px] left-0 border-solid dark:border-black-2 border-white border-[1px] rounded-full'
              }
              size={'sm'}
            />
            <Icon
              src={position.tokenB.logoURI}
              className={
                `absolute top-[-2px] left-[10px] border-solid dark:border-black-2 
                border-white border-[1px] rounded-full`
              }
              size={'sm'}
            />
          </div>
          <p>
            {position.tokenA.symbol}-{position.tokenB.symbol}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span>AMM</span>
        <span className="flex items-center gap-1">
          <Icon
            src={platforms[position.source]}
            className={'border-solid dark:border-black-2 border-white border-[1px] rounded-full'}
            size={'sm'}
          />
          <p>{position.source}</p>
        </span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span>Token A Amount</span>
        <span className="flex items-center gap-1">
          {numberFormatter(
            new Decimal(position.amountTokenA.toString()).div(10 ** position.tokenA.decimals).toString(),
            2
          )}{' '}
          {position.tokenA.symbol}
        </span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span>Token B Amount</span>
        <span className="flex items-center gap-1">
          {numberFormatter(
            new Decimal(position.amountTokenB.toString()).div(10 ** position.tokenB.decimals).toString(),
            2
          )}{' '}
          {position.tokenB.symbol}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>USD Value</span>
        <span>
          <p>
            $
            {calcUSDValue(
              new Decimal(position.amountTokenA.toString()).div(10 ** position.tokenA.decimals).toNumber(),
              position.tokenA,
              new Decimal(position.amountTokenB.toString()).div(10 ** position.tokenB.decimals).toNumber(),
              position.tokenB
            )}
          </p>
        </span>
      </div>
    </div>
  </div>
)

export default MigrateDialog
