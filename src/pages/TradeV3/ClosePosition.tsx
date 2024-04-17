/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useMemo, useState } from 'react'
import { useCrypto, useOrderBook } from '../../context'
import { useTraderConfig } from '../../context/trader_risk_group'
import tw, { styled } from 'twin.macro'
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
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogOverlay,
  Tabs,
  TabsList,
  TabsTrigger,
  cn
} from 'gfx-component-lib'
import { ContentLabel, InfoLabel, TitleLabel } from './perps/components/PerpsGenericComp'
import { InfoRow } from './TradeConfirmation'

const WRAPPER = styled.div`
  .percentage {
    ${tw`w-full h-[45px] rounded-circle flex flex-row dark:bg-black-1 bg-grey-4 mb-3.75`}
    >input {
      ${tw`w-full h-[45px] rounded-circle flex pl-6 font-semibold text-regular text-grey-1 
        flex-row dark:bg-black-1 bg-grey-4 border-none`}
      outline: none;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type='number'] {
      -moz-appearance: textfield;
    }
    .percentage-num {
      ${tw`w-1/4 font-semibold cursor-pointer flex flex-row items-center justify-center h-full 
        text-[16px] text-grey-1 sm:text-regular`}
    }
    .selected {
      ${tw`rounded-half text-white dark:text-grey-5`}
      background-image: linear-gradient(105deg, #f7931a 6%, #ac1cc7 96%);
    }
  }
`

const ROW = styled.div`
  ${tw`flex flex-row justify-between items-start mb-4 sm:mb-2.5`}

  > span {
    ${tw`text-average font-semibold text-grey-1 sm:text-regular`}
  }

  .value {
    ${tw`text-black-4 dark:text-white`}
    .positive {
      ${tw`text-green-2 font-medium`}
    }
    .negative {
      ${tw`text-red-1 font-medium`}
    }
  }
`

const percentDetails = [
  {
    index: 0,
    display: 25,
    value: new Fractional({ m: new anchor.BN(25), exp: new anchor.BN(2) })
  },
  {
    index: 1,
    display: 50,
    value: new Fractional({ m: new anchor.BN(5), exp: new anchor.BN(1) })
  },
  {
    index: 2,
    display: 75,
    value: new Fractional({ m: new anchor.BN(75), exp: new anchor.BN(2) })
  },
  {
    index: 3,
    display: 100,
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
    <DialogContent
      placement={checkMobile() ? 'bottom' : 'default'}
      className={'z-[999] w-[500px] h-[356px] sm:w-[100vw]'}
    >
      <DialogCloseDefault onClick={() => setVisibleState(false)} />

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
  const [percentageIndex, setPercentageindex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [customAmount, setCustomAmount] = useState<string>(null)
  const [inputValue, setInputValue] = useState<number>(null)

  const { closePosition } = useTraderConfig()
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, selectedCrypto.type])

  const handlePercentageChange = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setPercentageindex(index)
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
    if (!percentageIndex && customAmount) {
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
      <span className={isNegative ? 'text-red-2' : 'text-green-5'}>
        {(!isNegative ? '+' : '') + pnlNumber.toFixed(2) + ' USD'}
      </span>
    )
  }, [pnlNumber])

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
    const response = await closePosition(orderBook, selectedExitQty)
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

  const handleInputChange = (e) => {
    const inputAmt = e.target.value.replace(/[^0-9]\./g, '')
    if (!isNaN(+inputAmt)) setInputValue(+inputAmt)
    if (!isNaN(+inputAmt) && +inputAmt) {
      if (+inputAmt <= Math.abs(totalExitQtyNumber)) {
        setPercentageindex(null)
        setCustomAmount(inputAmt)
      }
    } else {
      setPercentageindex(3)
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
    <div className="w-full p-2.5">
      <div tw="flex items-center my-4 sm:my-3">
        <div className="text-[18px]">
          <InfoLabel>
            <h3> Close Position</h3>
          </InfoLabel>
        </div>
        {/*      
        <span tw="ml-auto text-average font-semibold text-black-4 dark:text-grey-5 sm:text-tiny">${price}</span>
        <span tw="text-average font-semibold text-grey-1 sm:text-tiny">{displayExitQty}</span> */}
      </div>
      <div className="percentage">
        <Tabs defaultValue="0">
          <TabsList>
            {percentDetails.map((elem, index) => (
              <TabsTrigger
                className={cn('w-[25%] h-8.75')}
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
      {/* <div tw="flex flex-row justify-between">
        <span tw="text-regular font-semibold dark:text-grey-4 text-grey-1 mb-2.5 sm:text-tiny">Custom</span>
        {inputValue > Math.abs(totalExitQtyNumber) ? (
          <span tw="text-red-1 font-semibold text-regular">Maximum quantity exceeded!</span>
        ) : null}
      </div> */}

      <div className="flex flex-col mt-2">
        <div className="flex justify-between items-center">
          <InfoLabel>
            <p>{displayExitQty}</p>
          </InfoLabel>
          <InfoLabel>
            <div className="flex items-center gap-1">
              <p className={cn('!font-semibold')}>{exitPrice}</p>
              <p className="text-green-1">(Market Price)</p>
            </div>
          </InfoLabel>
        </div>
        <InfoRow label="Est. Exit Price" value={exitPrice} />
        <InfoRow label="Est. Slippage" value={'0.000%'} />
        <InfoRow label="New Est. Liquidation Price" value={'None'} />
        <div className="flex justify-between">
          <ContentLabel>
            <p>Est. Realized P&L</p>
          </ContentLabel>
          <InfoLabel>
            <p>{pnlEstimate}</p>
          </InfoLabel>
        </div>
        {/* <InfoRow label="Est. Entry Price" value={`$${Number(order.price).toFixed(2)}`} />
            <InfoRow label="Est. Price Impact" value={`${totalPriceImpact.toFixed(4)}%`} />
            <InfoRow label="Slippage Tolerance" value={`${0.1}%`} />
            <InfoRow label="Trader Notional Size" value={`${notionalValue}%`} />
            <InfoRow label="Fee (0.1%)" value={`${fee} USDC`} />
            <InfoRow label="Total Cost" value={`${total} USDC`} />
            <InfoRow label="Est. Liquidation Price" value={`${totalPriceImpact.toFixed(4)}%`} /> */}
      </div>
      <Button
        onClick={closePositionFn}
        height="35px"
        className={cn(`w-[200px] h-10 ml-[150px] bottom-2.5 absolute`)}
        colorScheme={'blue'}
        disabled={loading}
        loading={loading}
        width="100%"
        // cssStyle={tw`bg-blue-1 text-grey-5 font-semibold border-0 rounded-circle text-average sm:text-regular`}
      >
        <span>
          {percentDetails[percentageIndex]?.display
            ? `Close ${percentDetails[percentageIndex].display}% of the position`
            : 'Close Position'}
        </span>
      </Button>
    </div>
  )
}
