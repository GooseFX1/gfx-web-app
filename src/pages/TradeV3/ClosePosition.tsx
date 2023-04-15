/* eslint-disable */
import { FC, useMemo, useState } from 'react'
import { useCrypto, useOrderBook, usePriceFeed } from '../../context'
import { useTraderConfig } from '../../context/trader_risk_group'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button } from '../../components/Button'
import {
  displayFractional,
  getClosePositionPrice,
  getExitQuntity,
  getPerpsPrice,
  mulFractionals
} from './perps/utils'
import { Fractional } from './perps/dexterity/types'
import * as anchor from '@project-serum/anchor'
import { RotatingLoader } from '../../components/RotatingLoader'
import { checkMobile } from '../../utils'

const WRAPPER = styled.div`
  .percentage {
    ${tw`w-full h-12.5 rounded-circle flex flex-row dark:bg-black-1 bg-grey-4 sm:h-[45px]`}
  }

  .percentage-num {
    ${tw`w-1/4 font-semibold cursor-pointer flex flex-row items-center justify-center h-full 
        text-[16px] text-grey-1 sm:text-regular`}
  }

  .selected {
    ${tw`rounded-half text-white dark:text-white`}
    background-image: linear-gradient(105deg, #f7931a 6%, #ac1cc7 96%);
  }
`

const ROW = styled.div`
  ${tw`flex flex-row justify-between items-start mb-5 sm:mb-2.5`}

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

export const ClosePosition: FC<{ setVisibleState: React.Dispatch<React.SetStateAction<any>> }> = ({
  setVisibleState
}) => {
  const { traderInfo, activeProduct } = useTraderConfig()
  const { selectedCrypto, getAskSymbolFromPair } = useCrypto()
  const { orderBook } = useOrderBook()
  const price = getPerpsPrice(orderBook)
  const [percentageIndex, setPercentageindex] = useState<number>(3)
  const [loading, setLoading] = useState<boolean>(false)

  const { closePosition } = useTraderConfig()
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(
    () => `/img/crypto/${selectedCrypto.type === 'synth' ? `g${symbol}` : symbol}.svg`,
    [symbol, selectedCrypto.type]
  )

  const handlePercentageChange = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setPercentageindex(index)
  }

  const totalExitQty = useMemo(() => {
    return getExitQuntity(traderInfo.balances, activeProduct)
  }, [traderInfo, activeProduct])

  const selectedExitQty = useMemo(() => {
    const multiplier = percentDetails[percentageIndex].value
    return mulFractionals(multiplier, totalExitQty)
  }, [totalExitQty, percentageIndex])

  const exitPrice = useMemo(() => {
    return getClosePositionPrice(displayFractional(selectedExitQty), orderBook)
  }, [selectedExitQty, orderBook])

  const pnlEstimate = useMemo(() => {
    if (!traderInfo.averagePosition.price) return <span>-</span>
    const averagePrice = traderInfo.averagePosition.price,
      sellPrice = exitPrice
    if (!sellPrice || !Number(averagePrice)) return <span>-</span>
    const side = traderInfo.averagePosition.side
    const difference = side === 'buy' ? sellPrice - Number(averagePrice) : Number(averagePrice) - sellPrice
    let totalPnl = difference * Number(displayFractional(selectedExitQty))

    totalPnl = side === 'sell' ? totalPnl * -1 : totalPnl
    const isNegative = totalPnl < 0
    return (
      <span className={isNegative ? 'negative' : 'positive'}>
        {(!isNegative ? '+' : '') + totalPnl.toFixed(2)}
      </span>
    )
  }, [traderInfo, selectedExitQty])

  const closePositionFn = async () => {
    setLoading(true)
    const response = await closePosition(orderBook, selectedExitQty)
    if (response && response.txid) {
      setVisibleState(false)
    }
    setLoading(false)
  }

  const displayExitQty = useMemo(() => {
    const qt = Number(displayFractional(selectedExitQty))
    if (qt) {
      const qty = qt.toFixed(2)
      return qty
    }
    return '0.0'
  }, [selectedExitQty])

  return (
    <WRAPPER>
      <div tw="flex items-center mt-8 mb-7 sm:mt-[22px] sm:mb-5">
        <span tw="text-lg font-semibold text-grey-1 dark:text-grey-5 sm:text-regular">
          {displayExitQty} {symbol}
        </span>
        <img
          tw="ml-2.5"
          src={assetIcon}
          alt={symbol}
          height={checkMobile() ? '20px' : '28px'}
          width={checkMobile() ? '20px' : '28px'}
        />
        <span tw="ml-auto text-average font-semibold text-black-4 dark:text-grey-5 sm:text-tiny">${price}</span>
        <span tw="text-average font-semibold text-grey-1 sm:text-tiny">(Market Price)</span>
      </div>
      <div className="percentage">
        {percentDetails.map((elem, index) => (
          <div
            className={percentageIndex === index ? 'percentage-num selected' : 'percentage-num'}
            onClick={(e) => {
              handlePercentageChange(e, index)
            }}
            key={index}
          >
            {elem.display}%
          </div>
        ))}
      </div>
      <div tw="mb-9 mt-8 sm:my-[25px] ">
        <ROW>
          <span>Est. Exit Price</span>
          <span className="value">${exitPrice}</span>
        </ROW>
        <ROW>
          <span>Est. Slippage</span>
          <span className="value">0.0000%</span>
        </ROW>
        <ROW>
          <span>New Est. Liquidation Price</span>
          <span className="value">None</span>
        </ROW>
        <ROW>
          <span>Est. Realised P&L</span>
          <span className="value">{pnlEstimate} USD</span>
        </ROW>
      </div>
      <Button
        onClick={closePositionFn}
        height="50px"
        width="100%"
        cssStyle={tw`bg-blue-1 dark:text-white font-semibold border-0 rounded-circle text-average sm:text-tiny`}
      >
        <span>
          {loading ? (
            <RotatingLoader text="" textSize={12} iconSize={30} iconColor="white" />
          ) : (
            `Close ${percentDetails[percentageIndex].display}% of the position`
          )}
        </span>
      </Button>
    </WRAPPER>
  )
}
