/* eslint-disable */
import { FC, useMemo, useState } from 'react'
import { useCrypto, useOrderBook, usePriceFeed } from '../../context'
import { useTraderConfig } from '../../context/trader_risk_group'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button } from '../../components/Button'
import { getPerpsPrice } from './perps/utils'

const WRAPPER = styled.div`
  .percentage {
    ${tw`w-full h-12.5 rounded-circle flex flex-row dark:bg-black-1 bg-grey-4`}
  }

  .percentage-num {
    ${tw`w-1/4 font-semibold cursor-pointer flex flex-row items-center justify-center h-full 
        text-[16px] dark:text-black-4 text-grey-1`}
  }

  .selected {
    ${tw`rounded-half text-white dark:text-white`}
    background-image: linear-gradient(105deg, #f7931a 6%, #ac1cc7 96%);
  }
`

const ROW = styled.div`
  ${tw`flex flex-row justify-between items-start mb-2.5`}

  > span {
    ${tw`text-average font-semibold text-grey-1`}
  }

  .value {
    ${tw`text-black-4 dark:text-white`}
  }
`

export const ClosePosition: FC<{}> = () => {
  const { traderInfo } = useTraderConfig()
  const { selectedCrypto, getAskSymbolFromPair } = useCrypto()
  const { orderBook } = useOrderBook()
  const price = getPerpsPrice(orderBook)
  const percentageArr = [25, 50, 75, 100]
  const [percentageIndex, setPercentageindex] = useState<number>(0)
  const [percent, setPercent] = useState<number>(25)
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
    setPercent(percentageArr[index])
  }

  return (
    <WRAPPER>
      <div tw="flex items-center mt-8 mb-7">
        <span tw="text-lg font-semibold text-grey-1 dark:text-grey-2">
          {traderInfo?.averagePosition.quantity} {symbol}
        </span>
        <img tw="ml-2.5" src={assetIcon} alt={symbol} height="28px" width="28px" />
        <span tw="ml-auto text-average font-semibold text-black-4 dark:text-grey-5">${price}</span>
        <span tw="text-average font-semibold text-grey-1">(Market Price)</span>
      </div>
      <div className="percentage">
        {percentageArr.map((elem, index) => (
          <div
            className={percentageIndex === index ? 'percentage-num selected' : 'percentage-num'}
            onClick={(e) => {
              handlePercentageChange(e, index)
            }}
            key={index}
          >
            {elem}%
          </div>
        ))}
      </div>
      <div tw="mb-6 mt-8">
        <ROW>
          <span>Est. Exist Price</span>
          <span className="value">$23.29</span>
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
          <span>Leverage Ratio After Close</span>
          <span className="value">0x</span>
        </ROW>
        <ROW>
          <span>Est. Realised P&L</span>
          <span className="value">0.00 USD</span>
        </ROW>
      </div>
      <Button
        height="50px"
        width="100%"
        cssStyle={tw`bg-blue-1 dark:text-white font-semibold border-0 rounded-circle text-regular`}
      >
        {`Close ${percent}% of the position`}
      </Button>
    </WRAPPER>
  )
}
