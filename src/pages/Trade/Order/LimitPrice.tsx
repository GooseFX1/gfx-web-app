import React, { BaseSyntheticEvent, FC, useMemo, useState } from 'react'
import { Input, Switch } from 'antd'
import styled, { css } from 'styled-components'
import { useMarket, useOrder } from '../../../context'

const HEADER = styled.span`
  display: block;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.margins['0.5x']};
  padding: 0 ${({ theme }) => theme.margins['0.5x']};
  font-size: 11px;
  text-align: left;
`

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
    }
  }
`

const WRAPPER = styled.div<{ $display: boolean }>`
  max-height: ${({ $display }) => ($display ? '500px' : '0')};
  ${({ theme, $display }) => $display && `margin-bottom: ${theme.margins['1.5x']};`}
  overflow: hidden;
  transition: max-height ${({ theme }) => theme.mainTransitionTime} ease-in-out;
`

export const LimitPrice: FC = () => {
  const { order, setOrder } = useOrder()
  const { getBidFromSymbol, selectedMarket } = useMarket()
  const [value, setValue] = useState(0)

  const bid = useMemo(() => getBidFromSymbol(selectedMarket.symbol), [getBidFromSymbol, selectedMarket.symbol])

  const onChangeIOC = (checked: boolean) => setOrder((prevState) => ({ ...prevState, type: checked ? 'ioc' : 'limit' }))
  const onChangePost = (checked: boolean) =>
    setOrder((prevState) => ({ ...prevState, type: checked ? 'postOnly' : 'limit' }))

  const localCSS = css`
    .ant-input-affix-wrapper {
      height: 39px;
      border: none;
      border-radius: 8px;
      background-color: black;
    }

    .ant-input-affix-wrapper > input.ant-input {
      text-align: left;
    }
  `

  return (
    <WRAPPER $display={order.display === 'limit'}>
      <HEADER>Limit price</HEADER>
      <style>{localCSS}</style>
      <Input
        maxLength={15}
        onChange={(x: BaseSyntheticEvent) => !isNaN(x.target.value) && setValue(x.target.value)}
        pattern="\d+(\.\d+)?"
        placeholder={value.toString()}
        suffix={<span>{bid}</span>}
        value={value}
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
