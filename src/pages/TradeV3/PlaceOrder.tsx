/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useMemo, useState } from 'react'
import {
  AVAILABLE_ORDERS,
  OrderType,
  useAccounts,
  useConnectionConfig,
  useCrypto,
  useDarkMode,
  useOrder,
  useOrderBook,
  useTokenRegistry
} from '../../context'
import { checkMobile } from '../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTraderConfig } from '../../context/trader_risk_group'
import { getProfitAmount } from './perps/utils'
import { TradeConfirmation } from './TradeConfirmation'
import 'styled-components/macro'
import useWindowSize from '../../utils/useWindowSize'
import {
  BlackGradientBg,
  ContentLabel,
  InfoLabel,
  PerpsLayout,
  TitleLabel
} from './perps/components/PerpsGenericComp'
import {
  Button,
  Checkbox,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  InputElementRight,
  InputGroup,
  Slider,
  Tabs,
  TabsList,
  TabsTrigger
} from 'gfx-component-lib'
import useBoolean from '@/hooks/useBoolean'
import { Connect } from '../../layouts/Connect'
import { useWalletBalance } from '@/context/walletBalanceContext'

const MAX_SLIDER_THRESHOLD = 9.9 // If the slider is more than num will take maximum leverage
const DECIMAL_ADJUSTMENT_FACTOR = 1000 // For three decimal places, adjust if needed

enum ButtonState {
  Connect = 0,
  CanPlaceOrder = 1,
  NullAmount = 2,
  BalanceExceeded = 3,
  CreateAccount = 4,
  isGeoBlocked = 5,
  OrderTooSmall = 6
}

const ORDER_CATEGORY_TYPE = [
  {
    id: 'postOnly',
    display: 'Post'
  },
  {
    id: 'ioc',
    display: 'IOC'
  }
]
export const PlaceOrder: FC = () => {
  const { getUIAmount } = useAccounts()
  const { selectedCrypto, getSymbolFromPair, getAskSymbolFromPair, getBidSymbolFromPair, isDevnet } = useCrypto()
  const { order, setOrder, focused, setFocused } = useOrder()
  const { publicKey } = useWalletBalance()

  const { traderInfo } = useTraderConfig()
  const { orderBook } = useOrderBook()
  const [selectedTotal, setSelectedTotal] = useState<number>(null)
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { connected } = useWallet()
  const { mode } = useDarkMode()
  const { height } = useWindowSize()
  const [loading, setLoading] = useState<boolean>(false)
  const { blacklisted } = useConnectionConfig()
  const { wallet } = useWallet()

  //Take profit state:
  const [takeProfitVisible, setTakeProfitVisible] = useState(false)
  const [takeProfitArrow, setTakeProfitArrow] = useState(false)
  const [takeProfitAmount, setTakeProfitAmount] = useState<number>(null)
  const [takeProfitIndex, setTakeProfitIndex] = useState<number>(null)
  const [takeProfitInput, setTakeProfitInput] = useState<number>(null)
  const [profits, setProfits] = useState<any>(['', '', '', ''])
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)
  const [tradeType, setTradeType] = useState<string>('deposit')
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useBoolean(false)
  const [leverageValue, setLeverageValue] = useState<number[]>([0])
  const TAKE_PROFIT_ARRAY = [
    {
      display: '10%',
      value: 0.1,
      key: 1
    },
    {
      display: '25%',
      value: 0.25,
      key: 2
    },
    order.side === 'buy'
      ? {
          display: '50%',
          value: 0.5,
          key: 3
        }
      : {
          display: '75%',
          value: 0.75,
          key: 3
        }
  ]

  useEffect(() => {
    setOrder((prevState) => ({ ...prevState, size: '' }))
  }, [Number(traderInfo.currentLeverage).toFixed(1), publicKey])

  useEffect(() => {
    const obj = []
    TAKE_PROFIT_ARRAY.map((item, index) => {
      if (Number.isNaN(+order.price)) obj.push('')
      else {
        const profit = getProfitAmount(order.side, order.price, item.value)
        obj.push(profit.toFixed(2))
      }
    })
    setProfits(obj)
  }, [order])

  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])

  const tokenInfo = useMemo(
    () => getTokenInfoFromSymbol(getSymbolFromPair(selectedCrypto.pair, order.side)),
    [getSymbolFromPair, getTokenInfoFromSymbol, order.side, selectedCrypto.pair]
  )
  const userBalance = useMemo(() => (tokenInfo ? getUIAmount(tokenInfo.address) : 0), [tokenInfo, getUIAmount])

  const perpsBidBalance: number = useMemo(() => {
    if (!traderInfo || !traderInfo.balances || !traderInfo.traderRiskGroup) return 0
    const balanceBid = Number(traderInfo.marginAvailable)
    return balanceBid
  }, [traderInfo])

  const maxQtyNum: number = useMemo(() => {
    const maxQty = Number(traderInfo.maxQuantity)
    if (Number.isNaN(maxQty)) return 0
    return maxQty
  }, [traderInfo.maxQuantity, order.size])

  const buttonState = useMemo(() => {
    if (blacklisted) return ButtonState.isGeoBlocked
    if (!connected) return ButtonState.Connect
    if (!traderInfo?.traderRiskGroupKey) return ButtonState.CreateAccount
    if (!order.price || !order.total || !order.size) return ButtonState.NullAmount
    if (+order.size > maxQtyNum) return ButtonState.BalanceExceeded
    if (+order.size < 0.01) return ButtonState.OrderTooSmall
    //if (order.total > perpsBidBalance) return ButtonState.BalanceExceeded
    return ButtonState.CanPlaceOrder
  }, [connected, selectedCrypto.pair, order, isDevnet, traderInfo])

  const buttonText = useMemo(() => {
    if (buttonState === ButtonState.BalanceExceeded) return 'Insufficient Balance'
    else if (buttonState === ButtonState.Connect) return 'Connect Wallet'
    else if (buttonState === ButtonState.isGeoBlocked) return 'Georestricted'
    else if (buttonState === ButtonState.CreateAccount) return 'Deposit!'
    else if (buttonState === ButtonState.OrderTooSmall) return 'Minimum size 0.01'
    else if (buttonState === ButtonState.NullAmount) return 'Enter Amount'

    if (order.side === 'buy') return 'LONG ' + symbol
    else return 'SHORT ' + symbol
  }, [buttonState, order.side, selectedCrypto.type])

  const displayedOrder = useMemo(
    () => AVAILABLE_ORDERS.find(({ display, side }) => display === order.display && side === order.side),
    [order.display, order.side]
  )

  const handleOrderSide = (side) => {
    if (side !== order.side) {
      setOrder((prevState) => ({ ...prevState, side }))
      setSelectedTotal(null)
    }
  }
  function isValidDecimal(input) {
    const num = Number(input)
    const scaled = num * 1000

    if (scaled === Math.round(scaled)) {
      return true
    } else {
      return false
    }
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 8) {
      const adjustedSize = Math.floor(maxQtyNum * DECIMAL_ADJUSTMENT_FACTOR) / DECIMAL_ADJUSTMENT_FACTOR
      if (order.size === adjustedSize) {
        setOrder((prev) => ({ ...prev, size: '' }))
      }
    }
  }

  const numberCheck = (input: string, source: string) => {
    if (!isNaN(+input)) {
      setSelectedTotal(null)
      switch (source) {
        case 'size':
          if (isValidDecimal(input)) setOrder((prev) => ({ ...prev, size: input }))
          break
        case 'total':
          if (isValidDecimal(input)) setOrder((prev) => ({ ...prev, total: input }))
          break
        case 'price':
          if (isValidDecimal(input)) setOrder((prev) => ({ ...prev, price: input }))
          break
      }
    }
  }
  const handlePlaceOrder = async () => {
    if (buttonState === ButtonState.CanPlaceOrder) {
      setLoading(true)
      setConfirmationModal(true)
      //await newOrder()
      setLoading(false)
    }
  }

  useEffect(() => {
    if (firstLoad && traderInfo.onChainPrice !== '0') {
      setOrder((prev) => ({ ...prev, price: traderInfo.onChainPrice, size: '' }))
      setFirstLoad(false)
      handleSliderChange([0])
    }
  }, [traderInfo.onChainPrice, firstLoad])

  const handleSliderChange = async (e: number[]) => {
    if (!order.price || order.price === '0') {
      setFocused('price')
      setOrder((prev) => ({ ...prev, price: traderInfo.onChainPrice }))
    }
    let newE = e[0]
    setLeverageValue(e)
    //if (e > 9.7) newE = e * 0.97
    //if (Number(order.price) <= Number(traderInfo.onChainPrice)) {
    const initLeverage = Number(traderInfo.currentLeverage)

    let newLev = newE - initLeverage
    if (newLev < 0) return
    setFocused('size')
    const availLeverage = Number(traderInfo.availableLeverage)
    const maxQty = Number(traderInfo.maxQuantity)
    const percentage1 = (newLev / availLeverage) * maxQty
    const percentage2 = Number(percentage1.toFixed(3))
    if (newLev > availLeverage) return
    if (isNaN(percentage2)) {
      setOrder((prev) => ({ ...prev, size: 0 }))
      return
    }
    if (percentage2 < maxQty) setOrder((prev) => ({ ...prev, size: percentage2 }))

  }

  const getMarks = () => {
    const markObj = {}
    for (let i = 2; i <= 10; i = i + 2) {
      markObj[i] = (
        <div className={cn(i === 10 ? 'mr-1' : 'mr-0', 'mt-0.5 max-sm:mt-0')}>
          <TitleLabel>{i + 'x'}</TitleLabel>
        </div>
      )
    }
    return markObj
  }
  const handleDropdownInput = (e) => {
    const inputAmt = e.target.value.replace(/[^0-9]\./g, '')
    if (!isNaN(+inputAmt)) setTakeProfitInput(+inputAmt)
  }

  const handleSave = (e) => {
    setTakeProfitIndex(null)
    setTakeProfitArrow(false)
    setTakeProfitVisible(false)
    setTakeProfitAmount(takeProfitInput)
  }

  const checkDisabled = () => {
    if (!+order.price) return true
    if (order.side === 'buy' && takeProfitInput < +order.price) return true
    if (order.side === 'sell' && takeProfitInput > +order.price) return true
    if (!takeProfitInput) return true
    return false
  }

  const calcTakeProfit = (value, index) => {
    setTakeProfitIndex(index)
    setTakeProfitInput(null)
  }

  const getTakeProfitItems = () => {
    let items = []

    items = TAKE_PROFIT_ARRAY.map((item, index) => {
      const html = (

        <DropdownMenuItem variant={'default'} onClick={() => setOrder((prev) => ({ ...prev, display: 'limit' }))}>
          <ContentLabel>
            <div className="flex w-[200px]" onClick={() => calcTakeProfit(item.value, index)}>
              <p className={cn('font-bold cursor-pointer mr-1')}>{item.display}</p>
              <p className={cn('font-bold cursor-pointer')}>
                {index === 0 ? '' : profits[index] ? '($' + profits[index] + ')' : '(-)'}
              </p>
            </div>
          </ContentLabel>
        </DropdownMenuItem>
      )

      return html
    })

    const saveHtml = (
      <DropdownMenuItem variant={'blank'} onSelect={(e) => e.preventDefault()}>
        <InputGroup
          rightItem={
            <InputElementRight>
              <Button
                variant={'ghost'}
                disabled={checkDisabled()}
                className={cn(`cursor-pointer ${checkDisabled() ? '' : '!text-white'}`)}
                onClick={!checkDisabled() && handleSave}
              >
                Save
              </Button>
            </InputElementRight>
          }
        >
          <Input
            onChange={handleDropdownInput}
            type="number"
            className={'dark:border-border-darkmode-secondary'}
            placeholder={'Enter custom price'}
          />
        </InputGroup>
      </DropdownMenuItem>
    )

    return [...items, saveHtml]
  }

  const getTakeProfitParam = () => {
    if (takeProfitIndex !== null) {
      const numPrice = +order.price
      if (Number.isNaN(numPrice)) return null

      const profitPrice =
        numPrice +
        (order.side === 'buy'
          ? TAKE_PROFIT_ARRAY[takeProfitIndex].value * numPrice
          : -TAKE_PROFIT_ARRAY[takeProfitIndex].value * numPrice)
      return profitPrice
    } else if (takeProfitAmount > 0) {
      return takeProfitAmount
    } else return null
  }

  const sliderValue = useMemo(() => {
    if (!publicKey) return 0
    const initLeverage = Number(traderInfo.currentLeverage)
    const availLeverage = Number(traderInfo.availableLeverage)
    const qty = maxQtyNum
    let orderSize = order.size || 0
    // we do this so that the displayed leverage doesn't exceed 10x
    if (Number(orderSize) > qty) {
      orderSize = qty
    }
    //const availMargin = Number(traderInfo.marginAvailable)
    let percentage = 0
    percentage = (Number(orderSize) / qty) * availLeverage

    //else if (order.total < availMargin) percentage = (Number(order.total) / Number(availMargin)) * availLeverage
    if (isNaN(Number((initLeverage + percentage).toFixed(2)))) return 0
    return Number((initLeverage + percentage).toFixed(2))
    //return Number(initLeverage.toFixed(2))
  }, [maxQtyNum, order.size, publicKey, traderInfo.currentLeverage, traderInfo.availableLeverage])

  const displayPair = useMemo(() => {
    return selectedCrypto.display
  }, [selectedCrypto.pair, selectedCrypto.type])

  useEffect(() => {
    // Check if the slider is at its maximum value
    // Calculate adjusted size based on maximum quantity so that we get 2 decimal places
    if (sliderValue > MAX_SLIDER_THRESHOLD) {
      const adjustedSize = Math.floor(maxQtyNum * DECIMAL_ADJUSTMENT_FACTOR) / DECIMAL_ADJUSTMENT_FACTOR
      setOrder((prevState) => ({ ...prevState, size: adjustedSize }))
    }
  }, [sliderValue, maxQtyNum])

  const sizeDisplay = useMemo(() => {
    return order.size !== '' && order.size !== 0 ? order.size : ''
  }, [order.size])

  const amountDisplay = useMemo(() => {
    return order.total !== '' && order.total !== 0 ? order.total : ''
  }, [order.total])


  return (
    <div className={cn('h-full rounded-[3px] max-sm:rounded-[10px]')}>
      <PerpsLayout>
        <LongShortTitleLayout handleOrderSide={handleOrderSide} />
        <LeverageRatioTile sliderValue={sliderValue} />
        {confirmationModal && (
          <TradeConfirmation
            open={confirmationModal}
            setVisibility={setConfirmationModal}
            takeProfit={getTakeProfitParam()}
          />
        )}

        <div className="px-2.5 flex flex-col flex-1 max-sm:pb-2.5 py-1 max-sm:h-auto h-[calc(100% - 80px)]">
          <div className={cn('flex mb-2.5')}>
            <div className={cn('flex w-1/2 flex-col gap-1')}>
              <InfoLabel> Order type</InfoLabel>
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen.set}>
                <DropdownMenuTrigger asChild={true}>
                  <Button
                    variant="outline"
                    onClick={setIsOpen.on}
                    colorScheme={mode === 'lite' ? 'blue' : 'white'}
                    className={cn('max-content mr-2 h-[30px] max-sm:h-[35px]')}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex">
                        {/* <IconTooltip tooltipType={'outline'}>
                          <p>Limit</p>
                        </IconTooltip> */}
                        <h4 className={cn('ml-1')}>{order.display === 'limit' ? 'Limit ' : 'Market '}</h4>
                      </div>

                      <img
                        style={{
                          height: '18px',
                          width: '18px',
                          transform: `rotate(${isOpen ? '0deg' : '180deg'})`,
                          transition: 'transform 0.2s ease-in-out'
                        }}
                        src={`/img/mainnav/connect-chevron-${mode}.svg`}
                        alt={'connect-chevron'}
                      />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent asChild>
                  <div className={'flex flex-col gap-1.5 items-start  max-w-[250px] '}>
                    <DropdownMenuItem
                      className="!cursor-pointer"
                      variant={'default'}
                      onClick={() => setOrder((prev) => ({ ...prev, display: 'limit' }))}
                    >
                      <p className={cn('font-bold w-[90px] !cursor-pointer')}>Limit</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="!cursor-pointer"
                      onClick={() => setOrder((prev) => ({ ...prev, display: 'market' }))}
                    >
                      <p className={cn('font-bold w-[90px] !cursor-pointer')}>Market</p>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className={cn('flex w-1/2 flex-col gap-1')}>
              <InfoLabel>Price</InfoLabel>
              <div className={cn('w-full flex')}>
                <Input
                  placeholder={'0.00 USDC'}
                  value={order.price ?? ''}
                  onChange={(e) => numberCheck(e.target.value, 'price')}
                  disabled={order.display === 'market'}
                  className={cn(
                    `mr-2 p-1 h-[30px] max-sm:h-[35px] min-w-[100px] text-right`,
                    order.price && `pr-[52px]`
                  )}
                />
                <div className="relative">
                  {order.price && (
                    <p className={cn('mt-[7px] max-sm:mt-[9px] right-3 absolute mr-1')}>
                      <InfoLabel>
                        <p>USDC</p>{' '}
                      </InfoLabel>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={cn('flex mb-2.5')}>
            <div className={cn('flex w-1/2 flex-col gap-1')}>
              <InfoLabel>Size</InfoLabel>
              <div className={cn('w-full flex')}>
                <Input
                  onKeyDown={(e) => handleKeyDown(e)}
                  placeholder={'0.00 SOL'}
                  onFocus={() => setFocused('size')}
                  value={sizeDisplay}
                  onChange={(e) => numberCheck(e.target.value, 'size')}
                  className={cn(
                    `mr-2 p-1 h-[30px] max-sm:h-[35px] min-w-[100px] text-right`,
                    sizeDisplay !== '' && `pr-12`
                  )}
                />
                <div className="relative">
                  {sizeDisplay !== '' && (
                    <InfoLabel>
                      <p className={cn('mt-[7px] max-sm:mt-[9px] right-3 absolute mr-1')}>SOL</p>
                    </InfoLabel>
                  )}
                </div>
              </div>
            </div>
            <div className={cn('flex w-1/2 flex-col gap-1')}>
              <InfoLabel>Amount</InfoLabel>
              <div className={cn('w-full flex')}>
                <Input
                  onKeyDown={(e) => handleKeyDown(e)}
                  placeholder={'0.00 USDC'}
                  onFocus={() => setFocused('total')}
                  value={amountDisplay}
                  onChange={(e) => numberCheck(e.target.value, 'total')}
                  className={cn(
                    `mr-2 p-1 max-sm:text-[15px] h-[30px] max-sm:h-[35px] min-w-[100px] text-right`,
                    amountDisplay !== '' && `pr-[52px]`
                  )}
                />
                <div className="relative">
                  {amountDisplay !== '' && (
                    <InfoLabel>
                      <p className={cn('max-sm:mt-[9px] mt-[7px] right-[15px] absolute')}>USDC</p>
                    </InfoLabel>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={cn('flex mb-2.5 flex-col gap-1')}>
            <InfoLabel>Take Profit {takeProfitVisible} </InfoLabel>
            <div className={cn('w-full flex')}>
              <div className="w-1/2 flex">
                <Input
                  placeholder={'0.00 USDC'}
                  value={
                    takeProfitIndex === null
                      ? takeProfitAmount
                        ? takeProfitAmount
                        : ''
                      : profits[takeProfitIndex]
                      ? '$' + profits[takeProfitIndex] + ' USDC'
                      : '(-)'
                  }
                  onChange={(e) => {
                    setTakeProfitIndex(null)
                    setTakeProfitAmount(Number(e.target.value))
                  }}
                  className={cn(
                    `mr-2 p-1 h-[30px] max-sm:h-8.75 min-w-[100px] text-right`,
                    (takeProfitIndex || takeProfitAmount) && `pr-1`
                  )}
                />
              </div>
              <div className="w-1/2">
                <Tabs>
                  <TabsList className="!p-0">
                    {TAKE_PROFIT_ARRAY.map((elem, index) => (
                      <TabsTrigger
                        className={cn('w-[33%] max-sm:h-[35px] h-[30px] ')}
                        size="xl"
                        key={index}
                        value={index.toString()}
                        variant="primary"
                        onClick={(e) => calcTakeProfit(elem.value, index)}
                      >
                        <TitleLabel whiteText={takeProfitIndex === index}>{elem.display}</TitleLabel>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          <div className={cn('flex mb-2.5 flex-col gap-1')}>
            <InfoLabel>Leverage</InfoLabel>
              <Slider max={10}  value={leverageValue}
                      step={0.1}
                      steps={4}
                      snapToThreshold={0.05}
                      showSteps
                      snapToStep
                      minStepsBetweenThumbs={0.1}
                      onValueChange={(v)=>handleSliderChange(v)}>
                {leverageValue[0].toFixed(2)}x
              </Slider>
          </div>
          <div className={cn('flex items-center mt-auto')}>
            {ORDER_CATEGORY_TYPE.map((item) => (
              <div key={item.id} className={cn('flex mr-2 items-center')}>
                <Checkbox
                  checked={order.type === item.id}
                  onCheckedChange={(checked: boolean) => {
                    checked
                      ? setOrder((prev) => ({ ...prev, type: item.id as OrderType }))
                      : setOrder((prev) => ({ ...prev, type: 'limit' }))
                  }}
                />
                <div className="ml-1">
                  <InfoLabel>{item.display}</InfoLabel>
                </div>
              </div>
            ))}
            {!checkMobile() ? (
              <div className={cn('ml-auto w-full')}>
                {publicKey ? (
                  <Button
                    className={cn('min-w-[170px] !w-full h-[30px]')}
                    variant="default"
                    colorScheme="blue"
                    size="lg"
                    onClick={() => handlePlaceOrder()}
                    disabled={buttonState !== ButtonState.CanPlaceOrder}
                  >
                    <h4>{buttonText}</h4>
                  </Button>
                ) : (
                  <Connect customButtonStyle="!w-[100%]" containerStyle="!w-[100%]" />
                )}
              </div>
            ) : publicKey ? (
              <ButtonForMobile
                buttonText={buttonText}
                handlePlaceOrder={handlePlaceOrder}
                buttonState={buttonState}
              />
            ) : null}
          </div>
        </div>
      </PerpsLayout>
    </div>
  )
}

const ButtonForMobile: FC<{ buttonText; handlePlaceOrder; buttonState }> = ({
  buttonText,
  handlePlaceOrder,
  buttonState
}) => {
  const { traderInfo } = useTraderConfig()
  const collateralAvailable = useMemo(
    () => Number(traderInfo?.collateralAvailable),
    [traderInfo?.collateralAvailable]
  )

  if (collateralAvailable === 0) return null

  return (
    <BlackGradientBg>
      <div className={cn('w-full absolute flex items-center justify-center')}>
        <Button
          className={cn('min-w-[170px] !w-[90%] h-10 mb-2 disabled:opacity-100')}
          variant="default"
          colorScheme="blue"
          size="lg"
          onClick={() => handlePlaceOrder()}
          disabled={buttonState !== ButtonState.CanPlaceOrder}
        >
          <h4>{buttonText}</h4>
        </Button>
      </div>
    </BlackGradientBg>
  )
}

const LeverageRatioTile: FC<{ sliderValue }> = ({ sliderValue }) => (
  <div className={cn('px-2.5 py-1')}>
    <div className={cn('h-8.75 flex items-center justify-between')}>
      <div className={cn('flex items-center')}>
        <img src={'/img/crypto/SOL.svg'} className={cn('h-6 mr-2 w-6')} alt="SOL Logo" />
        <InfoLabel> SOL-PERP </InfoLabel>
      </div>
      <div className="w-[43px] h-[23px]">
        <Badge variant="default" size={'lg'}>
          <InfoLabel>
            <h5 className={'!dark:text-white mt-0.5'}> {sliderValue}x </h5>
          </InfoLabel>
        </Badge>
      </div>
    </div>
  </div>
)

const LongShortTitleLayout: FC<{ handleOrderSide: (string) => void }> = ({ handleOrderSide }) => {
  const { order } = useOrder()
  return (
    <div className={cn('flex items-center max-sm:p-[5px] max-sm:rounded-[10px]')}>
      <div
        onClick={() => handleOrderSide('buy')}
        className={cn(`h-[35px] w-[50%] flex items-center duration-200 cursor-pointer rounded-[3px]
       justify-center ${order.side === 'buy' && 'bg-green-4'}`)}
      >
        <TitleLabel whiteText={order.side === 'buy'}> Long </TitleLabel>
      </div>
      <div
        onClick={() => handleOrderSide('sell')}
        className={cn(`h-[35px] w-[50%] flex items-center duration-200 cursor-pointer rounded-[3px]
      justify-center ${order.side === 'sell' && 'bg-red-1'}`)}
      >
        <TitleLabel whiteText={order.side === 'sell'}> Short </TitleLabel>
      </div>
    </div>
  )
}
