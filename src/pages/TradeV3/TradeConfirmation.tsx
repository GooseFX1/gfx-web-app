import { FC, ReactElement, useMemo } from 'react'
import { GradientText } from '../../components'
import { useCrypto, useOrder, useOrderBook } from '../../context'
import { useTraderConfig } from '../../context/trader_risk_group'
import { checkMobile } from '../../utils'
import useBoolean from '../../hooks/useBoolean'
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogHeader,
  DialogOverlay
} from 'gfx-component-lib'
import { ContentLabel, InfoLabel } from './perps/components/PerpsGenericComp'
import useBreakPoint from '@/hooks/useBreakPoint'

export const TradeConfirmation: FC<{ open: boolean; setVisibility: (bool: boolean) => any; takeProfit?: any }> = ({
  setVisibility,
  open,
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

  const { isMobile } = useBreakPoint()

  return (
    <Dialog open={open} onOpenChange={setVisibility}>
      <DialogOverlay />
      <DialogContent
        size="md"
        placement={isMobile ? 'bottom' : 'default'}
        className={cn('pt-3 flex flex-col gap-0')}
      >
        <DialogCloseDefault />

        <DialogHeader className={`space-y-0 w-full pb-2 px-2.5 text-left `}>
          <div className={'flex items-center'}>
            <InfoLabel>
              <h3 className="mr-1 mb-1">{order.side === 'buy' ? 'Long' : 'Short'}</h3>
            </InfoLabel>
            <GradientText lineHeight={15} text={'SOL-PERP'} fontSize={18} fontWeight={700} />
          </div>
        </DialogHeader>
        <DialogBody
          className={`flex flex-col w-full h-[210px] min-md:h-full 
        min-md:rounded-b-[10px] bg-white dark:bg-black-2 flex-auto overflow-y-scroll
        min-md:gap-1 px-2.5
  `}
        >
          <div className="flex flex-col">
            <InfoRow label="Order Type" value={order.display === 'limit' ? 'Limit' : 'Market'} />
            <InfoRow label="Trade Size" value={`${Number(order.size).toFixed(5)} ${symbol}`} />
            <InfoRow label="Est. Entry Price" value={`$${Number(order.price).toFixed(2)}`} />
            <TradeConfirmationLine />
            <InfoRow label="Est. Price Impact" value={`${totalPriceImpact.toFixed(4)}%`} />
            <InfoRow label="Slippage Tolerance" value={`${0.1}%`} />
            <InfoRow label="Trader Notional Size" value={`${notionalValue} USDC`} />
            <TradeConfirmationLine />
            <InfoRow label="Fee (0.1%)" value={`${fee} USDC`} />
            <InfoRow label="Total Cost" value={`${total} USDC`} />
            <InfoRow label="Est. Liquidation Price" value={`${totalPriceImpact.toFixed(4)} USDC`} />
          </div>

          <Button
            onClick={() => handleClick()}
            colorScheme={order.side === 'buy' ? 'blue' : 'red'}
            variant={'default'}
            className={cn(
              order.size === 'buy' && 'bg-green-3',
              'max-w-[178px] w-full h-10 mt-auto mb-2 ml-auto mr-auto '
            )}
            isLoading={isLoading}
            disabled={isLoading}
            height={checkMobile() ? '45px' : '40px'}
          >
            {order.side === 'buy' ? 'Long' : 'Short'} {Number(order.size).toFixed(3)} {symbol}
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export const InfoRow: FC<{ label; value }> = ({ label, value }) => (
  <div className="flex justify-between leading-4 my-[5px] ">
    <ContentLabel>
      <p>{label}</p>
    </ContentLabel>
    <InfoLabel>
      <p className={cn('!font-semibold')}>{value}</p>
    </InfoLabel>
  </div>
)

export const TradeConfirmationLine = (): ReactElement => (
  <div className="w-full h-[1px] dark:bg-black-4 bg-grey-4 mb-2"></div>
)
