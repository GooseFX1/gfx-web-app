import React, { BaseSyntheticEvent, FC, useEffect, useMemo } from 'react'
import { Input, Switch } from 'antd'
import styled, { css } from 'styled-components'
import { FieldHeader } from './shared'
import { useDarkMode, useCrypto, useOrder } from '../../../context'
import { ellipseNumber } from '../../../utils'

const TYPES = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.margins['0.5x']};
  padding: 0 ${({ theme }) => theme.margins['0.5x']};

  > div {
    &:first-child {
      margin-right: ${({ theme }) => theme.margins['2x']};
    }

    span {
      margin-right: ${({ theme }) => theme.margins['1x']};
      font-size: 10px;
      font-weight: bold;
      color: ${({ theme }) => theme.text2};
    }
  }
`

const WRAPPER = styled.div<{ $display: boolean }>`
  max-height: ${({ $display }) => ($display ? '500px' : '0')};
  ${({ theme, $display }) => $display && `margin-bottom: ${theme.margins['1.5x']};`}
  overflow: hidden;
`

export const LimitPrice: FC = () => {
  const { mode } = useDarkMode()
  const { getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setFocused, setOrder } = useOrder()

  const symbol = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])

  const onChangeIOC = (checked: boolean) => setOrder((prevState) => ({ ...prevState, type: checked ? 'ioc' : 'limit' }))
  const onChangePost = (checked: boolean) =>
    setOrder((prevState) => ({ ...prevState, type: checked ? 'postOnly' : 'limit' }))

  useEffect(() => {
    const focusinChange = (x: any) => x.target === document.getElementById('price-input') && setFocused('price')
    document.addEventListener('focusin', focusinChange)

    return () => document.removeEventListener('focusin', focusinChange)
  }, [setFocused])

  const localCSS = css`
    .order-price .ant-input-affix-wrapper {
      background-color: ${mode === 'dark' ? '#191919' : '#525252'};
    }
  `

  return (
    <WRAPPER className="order-price" $display={order.display === 'limit'}>
      <style>{localCSS}</style>
      <FieldHeader>Limit price</FieldHeader>
      <Input
        id="price-input"
        maxLength={15}
        onChange={(x: BaseSyntheticEvent) => {
          !isNaN(x.target.value) && setOrder((prevState) => ({ ...prevState, price: x.target.value }))
        }}
        pattern="\d+(\.\d+)?"
        placeholder={order.price.toString()}
        suffix={<span>{symbol}</span>}
        value={ellipseNumber(order.price)}
      />
      <TYPES>
        <div>
          <span>PostOnly</span>
          <Switch checked={order.type === 'postOnly'} onChange={onChangePost} size="small" />
        </div>
        <div>
          <span>IOC</span>
          <Switch checked={order.type === 'ioc'} onChange={onChangeIOC} size="small" />
        </div>
      </TYPES>
    </WRAPPER>
  )
}
