import React, { Dispatch, FC, SetStateAction, useMemo } from 'react'
import styled from 'styled-components'
import { useMarket } from '../../../context'
import { CenteredImg } from '../../../styles'

export type OrderType = 'buy' | 'sell'

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements('32px')}
`

const INFO = styled.div`
  > div {
    display: flex;
    justify-content: space-between;
  }
`

const WRAPPER = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['1x']};
  border: solid 2.5px #9f9f9f;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

export const Type: FC<{ setType: Dispatch<SetStateAction<OrderType>>, type: OrderType }> = ({ setType, type }) => {
  const { formatSymbol, getAssetFromSymbol, selectedMarket } = useMarket()
  const asset = useMemo(() => getAssetFromSymbol(selectedMarket), [getAssetFromSymbol, selectedMarket])
  const formattedSymbol = useMemo(() => formatSymbol(selectedMarket), [formatSymbol, selectedMarket])
  const past24HChange = '+245%'
  const past24HChangeIcon = `price_${past24HChange[0] === '+' ? 'up' : 'down'}.svg`

  return (
    <WRAPPER>
      <ICON>
        <img src={`${process.env.PUBLIC_URL}/img/tokens/${asset}.svg`} alt="" />
      </ICON>
      <INFO>
        <div>
          <span>
            {formattedSymbol}
          </span>
          <CenteredImg>
            <img src={`${process.env.PUBLIC_URL}/img/assets/${past24HChangeIcon}`} alt="" />
          </CenteredImg>
          <span>
            {past24HChange}
          </span>
        </div>
        <div>
          Price
        </div>
        <div>
          BUY
          SELL
        </div>
      </INFO>
    </WRAPPER>
  )
}
