import React, { BaseSyntheticEvent, FC, useMemo, useState } from 'react'
import { Input } from 'antd'
import { css } from 'styled-components'
import { useMarket, useOrder } from '../../../context'

export const Size: FC = () => {
  const { getAskFromSymbol, selectedMarket } = useMarket()
  const { order } = useOrder()
  const [value, setValue] = useState<number | string>('')

  const ask = useMemo(() => getAskFromSymbol(selectedMarket.symbol), [getAskFromSymbol, selectedMarket.symbol])

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
    <div>
      <style>{localCSS}</style>
      <Input
        maxLength={15}
        onChange={(x: BaseSyntheticEvent) => !isNaN(x.target.value) && setValue(x.target.value)}
        pattern="\d+(\.\d+)?"
        placeholder={`Amount to ${order.side}`}
        suffix={<span>{ask}</span>}
        value={value}
      />
    </div>
  )
}
