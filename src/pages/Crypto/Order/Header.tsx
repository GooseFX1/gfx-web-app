import React, { FC, useMemo } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
//import { CryptoSelector } from './CryptoSelector'
import { OrderSide, useCrypto, useOrder, usePriceFeed } from '../../../context'
import { CenteredImg, SpaceBetweenDiv } from '../../../styles'

/* const CHANGE = styled(CenteredImg)`
  display: flex;

  > div {
    ${({ theme }) => theme.measurements(theme.margin(1.5))}
    margin-right: ${({ theme }) => theme.margin(1)};
  }

  span {
    font-size: 10px;
    font-weight: bold;
  }
` */

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(4))}
  margin-top:15px;
  margin-left: 20px;
  img {
    height: 45px;
    width: 45px;
  }
`

const INFO = styled.div`
  width: 100%;
  margin: 10px 40px;
  > div {
    display: flex;
    align-items: center;
  }
`

const PRICE = styled.span`
  display: block;
  margin: ${({ theme }) => theme.margin(0.5)} 0 ${({ theme }) => theme.margin(1.5)};
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  color: #e7e7e7;
`

const SIDE = styled(SpaceBetweenDiv)<{ $display: boolean; $side: OrderSide }>`
  position: relative;
  margin-top: 10px;

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: -11.5px;
    left: ${({ $side }) => ($side === 'buy' ? '-10' : '70')}%;
    width: 43%;
    height: 2px;
    background-color: ${({ theme, $side }) => theme[$side === 'buy' ? 'bids' : 'asks']};
    transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }

  span {
    cursor: pointer;
    color: #e7e7e7;
    font-size: 16px;
    font-weight: bold;
    transition: color ${({ theme }) => theme.hapticTransitionTime} ease-in-out;

    &:hover,
    &:${({ $side }) => ($side === 'buy' ? 'first' : 'last')}-child {
      color: white;
    }
  }
`

const TICKER = styled.span`
  margin-right: ${({ theme }) => theme.margin(1.5)};
  font-size: 15px;
  font-weight: bold;
  white-space: nowrap;
  color: #e7e7e7;
`

const WRAPPER = styled.div`
  position: relative;
  display: flex;
  margin: -${({ theme }) => theme.margin(2)};
  padding: ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(3)} ${({ theme }) => theme.margin(0)}
    ${({ theme }) => theme.margin(1.5)};
  //border: solid 2.5px ${({ theme }) => theme.cryptoOrderHeaderBorder};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${({ theme }) => theme.bg14};
  border: 2.5px solid #484848;
  ${({ theme }) => theme.largeShadow}
`

const Loader: FC = () => <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />

export const Header: FC = () => {
  const { prices } = usePriceFeed()
  const { formatPair, getAskSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setOrder } = useOrder()

  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])
  // const change24HIcon = useMemo(() => `price_${marketData?.change24H >= 0 ? 'up' : 'down'}.svg`, [marketData])
  const formattedPair = useMemo(() => formatPair(selectedCrypto.pair), [formatPair, selectedCrypto])

  const handleSelectOrderSide = (side: OrderSide) => {
    if (side !== order.side) {
      setOrder((prevState) => ({ ...prevState, side }))
    }
  }

  return (
    <WRAPPER>
      <ICON>
        <img src={`/img/crypto/${symbol}.svg`} alt="" />
      </ICON>
      <INFO>
        <div>
          <TICKER>{formattedPair}</TICKER>
          {/* !marketData || !marketData.change24H ? (
            <Loader />
          ) : (
            <CHANGE>
              <CenteredImg>
                <img src={`/img/assets/${change24HIcon}`} alt="" />
              </CenteredImg>
              <span>{marketData.change24H}</span>
            </CHANGE>
          ) TODO RESTORE */}
        </div>
        <PRICE>{!marketData || !marketData.current ? <Loader /> : <>Price: $ {marketData.current}</>}</PRICE>
        <SIDE $display={!order.isHidden} $side={order.side}>
          <span onClick={() => handleSelectOrderSide('buy')}>Buy</span>
          <span onClick={() => handleSelectOrderSide('sell')}>Sell</span>
        </SIDE>
      </INFO>
      {/*<CryptoSelector />*/}
    </WRAPPER>
  )
}
