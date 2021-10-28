import React, { FC, useMemo } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { CryptoSelector } from './CryptoSelector'
import { OrderSide, useCrypto, useOrder } from '../../../context'
import { CenteredImg, SpaceBetweenDiv } from '../../../styles'

/* const CHANGE = styled(CenteredImg)`
  display: flex;

  > div {
    ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
    margin-right: ${({ theme }) => theme.margins['1x']};
  }

  span {
    font-size: 10px;
    font-weight: bold;
  }
` */

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['4x'])}
`

const INFO = styled.div`
  width: 100%;
  margin: 0 ${({ theme }) => theme.margins['1.5x']};

  > div {
    display: flex;
    align-items: center;
  }
`

const PRICE = styled.span`
  display: block;
  margin: ${({ theme }) => theme.margins['0.5x']} 0 ${({ theme }) => theme.margins['1.5x']};
  font-size: 10px;
  font-weight: bold;
  text-align: left;
`

const SIDE = styled(SpaceBetweenDiv)<{ $display: boolean; $side: OrderSide }>`
  position: relative;

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: -14.5px;
    left: ${({ $side }) => ($side === 'buy' ? '-20' : '113')}px;
    width: 43%;
    height: 2px;
    background-color: ${({ theme, $display, $side }) =>
      $display ? theme[$side === 'buy' ? 'bids' : 'asks'] : theme.cryptoOrderHeaderBorder};
    transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }

  span {
    cursor: pointer;
    color: ${({ theme }) => theme.text1h};
    font-size: 12px;
    font-weight: bold;
    transition: color ${({ theme }) => theme.hapticTransitionTime} ease-in-out;

    &:hover,
    &:${({ $side }) => ($side === 'buy' ? 'first' : 'last')}-child {
      color: white;
    }
  }
`

const TICKER = styled.span`
  margin-right: ${({ theme }) => theme.margins['1.5x']};
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
`

const WRAPPER = styled.div`
  position: relative;
  display: flex;
  margin: -${({ theme }) => theme.margins['2x']};
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['3x']}
    ${({ theme }) => theme.margins['1.5x']} ${({ theme }) => theme.margins['1.5x']};
  border: solid 2.5px ${({ theme }) => theme.cryptoOrderHeaderBorder};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${({ theme }) => theme.grey4};
  ${({ theme }) => theme.largeShadow}
`

const Loader: FC = () => {
  return <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />
}

export const Header: FC = () => {
  const { formatPair, getAskSymbolFromPair, prices, selectedCrypto } = useCrypto()
  const { order, setOrder } = useOrder()

  const symbol = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])
  // const change24HIcon = useMemo(() => `price_${marketData?.change24H >= 0 ? 'up' : 'down'}.svg`, [marketData])
  const formattedPair = useMemo(() => formatPair(selectedCrypto.pair), [formatPair, selectedCrypto])

  const handleClick = (side: OrderSide) => {
    if (side === order.side) {
      setOrder((prevState) => ({ ...prevState, isHidden: !prevState.isHidden }))
    } else {
      setOrder((prevState) => ({ ...prevState, isHidden: false, side }))
    }
  }

  return (
    <WRAPPER>
      <ICON>
        <img src={`${process.env.PUBLIC_URL}/img/crypto/${symbol}.svg`} alt="" />
      </ICON>
      <INFO>
        <div>
          <TICKER>{formattedPair}</TICKER>
          {/* !marketData || !marketData.change24H ? (
            <Loader />
          ) : (
            <CHANGE>
              <CenteredImg>
                <img src={`${process.env.PUBLIC_URL}/img/assets/${change24HIcon}`} alt="" />
              </CenteredImg>
              <span>{marketData.change24H}</span>
            </CHANGE>
          ) TODO RESTORE */}
        </div>
        <PRICE>{!marketData || !marketData.current ? <Loader /> : <>Price: $ {marketData.current}</>}</PRICE>
        <SIDE $display={!order.isHidden} $side={order.side}>
          <span onClick={() => handleClick('buy')}>Buy</span>
          <span onClick={() => handleClick('sell')}>Sell</span>
        </SIDE>
      </INFO>
      <CryptoSelector />
    </WRAPPER>
  )
}
