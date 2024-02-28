import { FC, useMemo } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button } from '../../components'
import { useCrypto, useOrder, useOrderBook } from '../../context'
import { useTraderConfig } from '../../context/trader_risk_group'
import { checkMobile } from '../../utils'
import useBoolean from '../../hooks/useBoolean'

const WRAPPER = styled.div``

const ROW = styled.div`
  ${tw`flex flex-row justify-between items-start mb-2.5 sm:mb-2`}
  > span {
    ${tw`text-average font-semibold text-grey-2 sm:text-regular`}
  }
  .value {
    ${tw`text-black-4 dark:text-white font-semibold sm:text-regular`}
  }
  .spacing {
    ${tw`mb-[25px] sm:mb-3.75`}
  }
`

export const TradeConfirmation: FC<{ setVisibility: (bool: boolean) => any; takeProfit?: any }> = ({
  setVisibility,
  takeProfit
}) => {
  const { order } = useOrder()
  const { orderBook } = useOrderBook()
  const { selectedCrypto, getAskSymbolFromPair } = useCrypto()
  const { newOrder, newOrderTakeProfit } = useTraderConfig()
  const [isLoading, setIsLoading] = useBoolean(false)

  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )

  const notionalValue = useMemo(() => {
    if (Number(order.price) && Number(order.size)) return (Number(order.price) * Number(order.size)).toFixed(2)
    else return '-'
  }, [order])

  const fee = useMemo(() => {
    if (Number(notionalValue)) return (Number(notionalValue) / 10000).toFixed(2)
    else return '-'
  }, [notionalValue])

  const total = useMemo(() => {
    if (Number(notionalValue) && !Number.isNaN(Number(fee)))
      return (Number(notionalValue) + Number(fee)).toFixed(2)
    else return '-'
  }, [notionalValue, fee])

  const totalPriceImpact = useMemo(() => {
    const orderQuantity = Number(order.size)
    // Extract bid and ask arrays from the order book
    const bids = orderBook.bids
    const asks = orderBook.asks

    // Calculate total quantity at and above the order price for both bids and asks
    const totalBidQuantity = bids.reduce((total, bid) => total + bid[1], 0)
    const totalAskQuantity = asks.reduce((total, ask) => total + ask[1], 0)

    // Calculate the percentage of order quantity relative to total bid and ask quantity
    const bidPercentage = orderQuantity / totalBidQuantity
    const askPercentage = orderQuantity / totalAskQuantity

    // Calculate the price impact in percentage
    const bidImpact = bidPercentage * bids[0][0] // Assuming the order is a market buy
    const askImpact = askPercentage * asks[0][0] // Assuming the order is a market sell

    // Total price impact
    const totalImpact = bidImpact + askImpact

    return totalImpact
  }, [orderBook.bids, orderBook.asks])

  const handleClick = async () => {
    try {
      setIsLoading.on()
      if (takeProfit) {
        await newOrderTakeProfit(takeProfit.toString())
      } else {
        await newOrder()
      }
      setIsLoading.off()
      setVisibility(false)
    } catch (error) {
      setVisibility(false)
      setIsLoading.off()
    }
  }

  const cssStyle = useMemo(() => {
    if (order.side === 'buy') return tw`bg-green-3 text-white font-semibold border-0 rounded-circle text-regular`
    else return tw`bg-red-2 text-white font-semibold border-0 rounded-circle text-regular`
  }, [order.side])

  return (
    <WRAPPER>
      <div tw="mt-[30px] mb-7 sm:my-0">
        <ROW>
          <span>Order Type</span>
          <span className="value">{order.display === 'limit' ? 'Limit' : 'Market'}</span>
        </ROW>
        <ROW>
          <span>Trade Size</span>
          <span className="value spacing">
            {Number(order.size).toFixed(5)} {symbol}
          </span>
        </ROW>
        <ROW>
          <span>Est. Entry Price</span>
          <span className="value">${order.price}</span>
        </ROW>
        <ROW>
          <span>Est. Price Impact</span>
          <span className="value">{totalPriceImpact.toFixed(4)}%</span>
        </ROW>
        <ROW>
          <span>Slippage Tolerance</span>
          <span className="value spacing">{'0.1%'}</span>
        </ROW>
        <ROW>
          <span>Trade Notional Size</span>
          <span className="value">{notionalValue} USDC</span>
        </ROW>
        <ROW>
          <span>Fee (0.1%)</span>
          <span className="value">{fee} USDC</span>
        </ROW>
        <ROW>
          <span>Total Cost</span>
          <span tw="mb-7" className="value">
            {total} USDC
          </span>
        </ROW>
        {/* <ROW>
          <span>Est. Liquidation Price</span>
          <span className="value">$14.9628</span>
        </ROW> */}
      </div>
      <Button
        onClick={() => handleClick()}
        width="100%"
        loading={isLoading}
        disabled={isLoading}
        height={checkMobile() ? '45px' : '50px'}
        cssStyle={cssStyle}
      >
        {order.side === 'buy' ? 'Long' : 'Short'} {Number(order.size).toFixed(3)} {symbol}
      </Button>
    </WRAPPER>
  )
}
