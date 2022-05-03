import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input, Switch } from 'antd'
import styled, { css } from 'styled-components'
import { FieldHeader } from './shared'
import { useDarkMode, useCrypto, useOrder } from '../../../context'
import { ellipseNumber } from '../../../utils'

const WRAPPER = styled.div<{ $display: boolean }>`
  max-height: ${({ $display }) => ($display ? '500px' : '0')};
  ${({ theme, $display }) => $display && `margin-bottom: ${theme.margin(1.5)};`}
  overflow: hidden;
  .symbol-name {
    font-size: 15px;
    line-height: 50px;
    .asset-icon {
      height: 25px;
      width: 25px;
      margin-right: 5px;
    }
  }
`

export const LimitPrice: FC = () => {
  const { mode } = useDarkMode()
  const { getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setFocused, setOrder } = useOrder()

  const symbol = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])

  const assetIcon = useMemo(
    () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${symbol}` : symbol}.svg`,
    [symbol, selectedCrypto.type]
  )

  const localCSS = css`
    .order-price {
      padding: 0 2px;
    }
    .order-price .ant-input-affix-wrapper {
      background-color: ${mode === 'dark' ? '#191919' : '#525252'};
    }
  `

  return (
    <WRAPPER className="order-price" $display={order.display === 'limit'}>
      <style>{localCSS}</style>
      <FieldHeader>Price</FieldHeader>
      <Input
        id="price-input"
        maxLength={15}
        onBlur={() => setFocused(undefined)}
        onChange={(x: BaseSyntheticEvent) => {
          !isNaN(x.target.value) && setOrder((prevState) => ({ ...prevState, price: x.target.value }))
        }}
        onFocus={() => setFocused('price')}
        pattern="\d+(\.\d+)?"
        placeholder={order.price.toString()}
        suffix={
          <span className="symbol-name">
            <img className="asset-icon" src={assetIcon} alt="" />
            {symbol}
          </span>
        }
        value={ellipseNumber(order.price)}
      />
    </WRAPPER>
  )
}
