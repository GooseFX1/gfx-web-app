/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useMemo, useState } from 'react'
import { useCrypto, useOrder, useOrderBook } from '../../context'
import { useTraderConfig } from '../../context/trader_risk_group'
import 'styled-components/macro'
import {
  convertToFractional,
  displayFractional,
  getClosePositionPrice,
  getExitQuantityInNumber,
  getExitQuntity,
  getPerpsPrice,
  mulFractionals
} from './perps/utils'
import { Fractional } from './perps/dexterity/types'
import * as anchor from '@project-serum/anchor'
import { checkMobile } from '../../utils'
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogOverlay,
  Input,
  Tabs,
  TabsList,
  TabsTrigger
} from 'gfx-component-lib'
import { ContentLabel, InfoLabel, InfoLabelNunito, TitleLabel } from './perps/components/PerpsGenericComp'
import { InfoRow } from './TradeConfirmation'
import { OrderTypeDropdown, PlaceOrder, PriceInput, numberCheck } from './PlaceOrder'
import useBoolean from '@/hooks/useBoolean'

const percentDetails = [
  {
    index: 0,
    display: '25%',
    value: new Fractional({ m: new anchor.BN(25), exp: new anchor.BN(2) })
  },
  {
    index: 1,
    display: '50%',
    value: new Fractional({ m: new anchor.BN(5), exp: new anchor.BN(1) })
  },
  {
    index: 2,
    display: '100%',
    value: new Fractional({ m: new anchor.BN(1), exp: new anchor.BN(0) })
  },
  {
    index: 3,
    display: 'Custom',
    value: new Fractional({ m: new anchor.BN(1), exp: new anchor.BN(0) })
  }
]
export const ClosePositionDialog: FC<{
  closePositionModal: boolean
  setVisibleState: React.Dispatch<React.SetStateAction<any>>
  setSummaryData: React.Dispatch<React.SetStateAction<any>>
  setPerpsEndModal: React.Dispatch<React.SetStateAction<any>>
}> = ({ closePositionModal, setVisibleState, setSummaryData, setPerpsEndModal }) => (
  <Dialog open={closePositionModal} onOpenChange={setVisibleState}>
    <DialogOverlay />
    {/* <DialogClose onClick={() => setDepositWithdrawModal(false)} /> */}
    <DialogContent size={'md'} placement={checkMobile() ? 'bottom' : 'default'} className={'h-[356px] sm:px-0'}>
      <DialogCloseDefault />

      <DialogBody>
        <ClosePosition
          setVisibleState={setVisibleState}
          setPerpsEndModal={setPerpsEndModal}
          setSummaryData={setSummaryData}
        />
      </DialogBody>
    </DialogContent>
  </Dialog>
)

export const ClosePosition: FC<{
  setVisibleState: React.Dispatch<React.SetStateAction<any>>
  setSummaryData: React.Dispatch<React.SetStateAction<any>>
  setPerpsEndModal: React.Dispatch<React.SetStateAction<any>>
}> = ({ setVisibleState, setSummaryData, setPerpsEndModal }) => {
  const { traderInfo, activeProduct } = useTraderConfig()
  const { selectedCrypto, getAskSymbolFromPair } = useCrypto()
  const { orderBook } = useOrderBook()
  const price = getPerpsPrice(orderBook)
  const [percentageIndex, setPercentageindex] = useState<number>(2)
  const [loading, setLoading] = useState<boolean>(false)
  const [customAmount, setCustomAmount] = useState<string>(null)
  const [inputValue, setInputValue] = useState<number>(null)
  const [isOpen, setIsOpen] = useBoolean(false)
  const { order, setOrder } = useOrder()

  const { closePosition, newOrder } = useTraderConfig()
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, selectedCrypto.type])

  const handlePercentageChange = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setPercentageindex(index)
    if (index !== 3) {
      setCustomAmount(null)
    }
  }

  const entryPrice = useMemo(() => traderInfo.averagePosition.price, [traderInfo, activeProduct])

  const totalExitQty = useMemo(
    () => getExitQuntity(traderInfo.balances, activeProduct),
    [traderInfo, activeProduct]
  )

  const totalExitQtyNumber = useMemo(
    () => getExitQuantityInNumber(traderInfo.balances, activeProduct),
    [traderInfo, activeProduct]
  )

  const getFractionalCustomAmount = (customAmount: string) => {
    const side = traderInfo.averagePosition.side
    const fractionalCustomAmount = convertToFractional(customAmount)
    if (side === 'sell') {
      const negativeCustomAmount = mulFractionals(
        new Fractional({
          m: new anchor.BN(-1),
          exp: new anchor.BN(0)
        }),
        fractionalCustomAmount
      )
      return negativeCustomAmount
    } else {
      return fractionalCustomAmount
    }
  }

  const selectedExitQty = useMemo(() => {
    if (percentageIndex === 3 && customAmount) {
      return getFractionalCustomAmount(customAmount)
    } else {
      const multiplier = percentDetails[percentageIndex]?.value
      return mulFractionals(multiplier, totalExitQty)
    }
  }, [totalExitQty, percentageIndex, customAmount])

  const exitPrice = useMemo(
    () => getClosePositionPrice(displayFractional(selectedExitQty), orderBook),
    [selectedExitQty, orderBook]
  )

  const pnlNumber = useMemo(() => {
    if (!traderInfo.averagePosition.price) return '-'
    const averagePrice = traderInfo.averagePosition.price,
      sellPrice = exitPrice
    if (!sellPrice || !Number(averagePrice)) return '-'
    const side = traderInfo.averagePosition.side
    const difference = side === 'buy' ? sellPrice - Number(averagePrice) : Number(averagePrice) - sellPrice
    let totalPnl = difference * Number(displayFractional(selectedExitQty))

    totalPnl = side === 'sell' ? totalPnl * -1 : totalPnl
    return totalPnl
  }, [traderInfo, selectedExitQty])

  const pnlEstimate = useMemo(() => {
    if (pnlNumber === '-') return <span>-</span>

    const isNegative = pnlNumber < 0
    return (
      <span className={isNegative ? 'text-red-2' : 'text-green-4'}>
        {(!isNegative ? '+' : '') + pnlNumber.toFixed(2) + ' USD'}
      </span>
    )
  }, [pnlNumber])

  const limitPnL = useMemo(() => {
    if (!traderInfo.averagePosition.price) return '-'
    const averagePrice = traderInfo.averagePosition.price,
      sellPrice = Number(order.price)
    if (!sellPrice || !Number(averagePrice)) return '-'
    const side = traderInfo.averagePosition.side
    const difference = side === 'buy' ? sellPrice - Number(averagePrice) : Number(averagePrice) - sellPrice
    let totalPnl = difference * Number(displayFractional(selectedExitQty))

    totalPnl = side === 'sell' ? totalPnl * -1 : totalPnl
    return totalPnl;
  }, [traderInfo, selectedExitQty, order.price])

  const limitPnlEstimate = useMemo(() => {
    if (limitPnL === '-') return <span>-</span>

    const isNegative = limitPnL < 0
    return (
      <span className={isNegative ? 'text-red-2' : 'text-green-4'}>
        {(!isNegative ? '+' : '') + limitPnL.toFixed(2) + ' USD'}
      </span>
    )
  }, [limitPnL])


  const percentageChange = useMemo(() => {
    const exitPriceNum = Number(exitPrice)
    const entry = Number(traderInfo.averagePosition.price)
    if (Number.isNaN(exitPriceNum) || Number.isNaN(entry)) return 0
    else {
      const percent = ((exitPriceNum - entry) / entry) * 100
      return Math.abs(percent).toFixed(1)
    }
  }, [pnlNumber])

  const closePositionFn = async () => {
    setLoading(true)
    let response;
    if (order.display === 'limit') {
      setOrder((prev) => ({ ...prev, size: displayExitQty }))
      response = await newOrder(traderInfo.averagePosition.side === 'buy' ? 'sell' : 'buy', displayExitQty);
    } else {
      response = await closePosition(orderBook, selectedExitQty)
    }
    if (response && response.txid) {
      setVisibleState(false)
      setPerpsEndModal(true)
      setSummaryData({
        entryPrice: entryPrice,
        exitPrice: exitPrice,
        pnl: pnlNumber !== '-' ? Math.abs(pnlNumber).toFixed(2) : '-',
        profit: pnlNumber !== '-' ? !(pnlNumber < 0) : false,
        leverage: '10',
        percentageChange: percentageChange
      })
    }
    setLoading(false)
  }

  const handleInputChange = async (e) => {
    const inputAmt = e.target.value
    if (inputAmt === '.') setCustomAmount('0.')
    // await setPercentageindex(3)
    if (inputAmt) setInputValue(inputAmt)

    if (inputAmt && inputAmt) {
      if (inputAmt <= Math.abs(totalExitQtyNumber)) {
        setCustomAmount(inputAmt)
      }
    } else {
      setCustomAmount(null)
    }
  }

  const displayExitQty = useMemo(() => {
    const qt = Number(displayFractional(selectedExitQty))
    if (qt) {
      const qty = qt.toFixed(2)
      return qty
    }
    return '0.0'
  }, [selectedExitQty])



  useEffect(() => {
    setOrder((prev) => ({ ...prev, display: 'market' }));
  }, [])


  const slippage = useMemo(() => {
    if (Number.isNaN(exitPrice) || exitPrice === 0) return 'N/A'
    if (Number.isNaN(price) || price === 0) return 'N/A'
    if (Number(displayExitQty) < 0) {
      if (exitPrice - price > 0) {
        const percentage = ((exitPrice - price) / price) * 100
        return percentage.toFixed(2) + '%'
      } else return 'N/A'
    } else {
      if (price - exitPrice > 0) {
        const percentage = ((price - exitPrice) / price) * 100
        return percentage.toFixed(2) + '%'
      } else return 'N/A'
    }
  }, [exitPrice, price, displayExitQty])

  return (
    <div className="flex flex-col justify-between w-full p-3 sm:px-2">
      <div>
        <h3 className={cn('text-black-4 dark:text-grey-8 mt-1 mb-3')}>Close Position</h3>
        <div className='flex w-full '>
          <div className='w-full mr-2.5'>
            <OrderTypeDropdown isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>

          <div className='w-full'>
            {order.display === 'limit' ?
              <PriceInput numberCheck={numberCheck} setOrder={setOrder} /> :
              <>
                <InfoLabel>Size</InfoLabel>
                <Input
                  placeholder={'0.00 SOL'}
                  value={customAmount ?? ''}
                  onFocus={() => setPercentageindex(3)}
                  onChange={(e) => handleInputChange(e)}
                  // disabled={order.display === 'market'}
                  className={cn(`my-2.5  !mt-1 h-[30px]  
                   sm:h-[35px] min-w-[100px] text-right`, customAmount && 'pr-[48px]')}
                />
              </>
            }
          </div>



        </div>
        <div className='mt-2'>
          {order.display === 'limit' &&
            <>
              <InfoLabel>Size</InfoLabel>
              <Input
                placeholder={'0.00 SOL'}
                value={displayExitQty ?? ''}
                onFocus={() => setPercentageindex(3)}
                onChange={(e) => handleInputChange(e)}
                // disabled={order.display === 'market'}
                className={cn(`my-2.5  !mt-1 h-[30px]  
                   sm:h-[35px] min-w-[100px] text-right`, displayExitQty && 'pr-[38px]')}
              />
              <div className='absolute right-5 mt-[-33px] !text-[15px]'>
                <InfoLabelNunito><p>SOL </p> </InfoLabelNunito>
              </div>
            </>
          }

        </div>
        <div className="percentage">
          <Tabs defaultValue="2" value={percentageIndex.toString()}>
            <TabsList>
              {percentDetails.map((elem, index) => (
                <TabsTrigger
                  className={cn('w-[25%]')}
                  size="xl"
                  key={index}
                  value={index.toString()}
                  variant="primary"
                  onClick={(e) => handlePercentageChange(e, index)}
                >
                  <TitleLabel whiteText={percentageIndex == index}>{elem.display}</TitleLabel>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {/* {inputValue > Math.abs(totalExitQtyNumber) ? (
            <span tw="text-red-1 font-semibold text-regular">Maximum quantity exceeded!</span>
          ) : null} */}
          {/* {customAmount && (
            <InfoLabel>
              <p className="text-[15px] absolute right-[25px] mt-[17px]">SOL</p>
            </InfoLabel>
          )} */}

          {/* {percentDetails.map((elem, index) => (
            <div
              className={percentageIndex === index ? 'percentage-num selected' : 'percentage-num'}
              onClick={(e) => {
                handlePercentageChange(e, index)
              }}
              key={index}
            >
              {elem.display}%
            </div>
          ))} */}
        </div>
      </div>

      <div className="flex flex-col">
        {order.display === 'limit' ? (
          <>
            <InfoRow label="Limit Price" value={order.price !== '' ? '$' + order.price : ''} />
            <div className="flex justify-between items-center my-2">
              <InfoLabel>
                <p>Est. Realized P&L (if filled)</p>
              </InfoLabel>
              <InfoLabel>
                <div className="flex items-center gap-1">
                  <p className={cn('!font-semibold')}>{limitPnlEstimate}</p>
                </div>
              </InfoLabel>
            </div>

            {/* <InfoRow label="Est. Realized P&L (if filled)" value={exitPrice} /> */}
          </>
        ) :
          (
            <>
              <div className="flex justify-between items-center my-2">
                <InfoLabel>
                  <p>{displayExitQty} SOL</p>
                </InfoLabel>
                <InfoLabel>
                  <div className="flex items-center gap-1">
                    <p className={cn('!font-semibold')}>{exitPrice}</p>
                    <p>(Market Price)</p>
                  </div>
                </InfoLabel>
              </div>
              <div>
                <InfoRow label="SOL Market Price" value={'1 SOL = ' + '$' + exitPrice} />
                <InfoRow label="Est. Exit Price" value={exitPrice} />
                <InfoRow label="Est. Slippage" value={'0.000%'} />
                <InfoRow label="New Est. Liquidation Price" value={'None'} />
                <div className="flex justify-between my-2">
                  <ContentLabel>
                    <p>Est. Realized P&L</p>
                  </ContentLabel>
                  <InfoLabel>
                    <p>{pnlEstimate}</p>
                  </InfoLabel>
                </div>
              </div>
            </>
          )
        }
      </div>

      <Button
        onClick={closePositionFn}
        className={`mx-auto mb-2`}
        colorScheme={'blue'}
        disabled={loading}
        loading={loading}
        size="lg"
        width={'100'}
      >
        <span>
          {percentDetails[percentageIndex]?.display
            ? `Close ${percentDetails[percentageIndex].display} of the position`
            : 'Close Position'}
        </span>
      </Button>
    </div>
  )
}
