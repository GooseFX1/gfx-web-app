import React, { FC, useEffect, useMemo, useState } from 'react'
import { Spin } from 'antd'
import styled from 'styled-components'
import { useConnectionConfig } from '../../context'
import { CenteredImg } from '../../styles'
import { getLatestBid } from '../../web3/serum'

const ASSET_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])}
`

const CHANGE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['1x'])}
`

const INFO = styled.div`
  display: flex;
  justify-content: space-between;
  
  > div {
    ${({ theme }) => theme.flexCenter}
    
    span {
      margin-left: ${({ theme }) => theme.margins['1x']};
      font-size: 10px;
      font-weight: bold;
    }
  }
`

const PRICE = styled.div`
  display: flex;
  height: ${({ theme }) => theme.margins['3x']};
  padding-top: ${({ theme }) => theme.margins['1x']};
  
  > span {
    ${({ theme }) => theme.mainText}
    font-size: 12px;
  }
`

const STATS = styled.div`
  width: 220px;
  padding: ${({ theme }) => theme.margins['1.5x']} ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.bg3};
`

export const PairStats: FC<{ symbol: string; type: string }> = ({ symbol, type }) => {
  const { connection } = useConnectionConfig()
  const [price, setPrice] = useState<string>()

  const asset = useMemo(() => symbol.slice(0, symbol.indexOf('/')), [symbol])
  const formattedSymbol = useMemo(() => symbol.replace('/', ' / '), [symbol])
  const past24HChange = '+245%'
  const past24HChangeIcon = `price_${past24HChange[0] === '+' ? 'up' : 'down'}`

  useEffect(() => {
    let fetching = true;
    (async () => {
      const latestBid = await getLatestBid(connection, symbol)
      if (!fetching) return
      setPrice(latestBid.toLocaleString())
    })()

    return () => {
      fetching = false
    }
  }, [connection, symbol])

  return (
    <STATS>
      <INFO>
        <div>
          <ASSET_ICON>
            <img src={`${process.env.PUBLIC_URL}/img/tokens/${asset}.svg`} alt="" />
          </ASSET_ICON>
          <span>{formattedSymbol}</span>
        </div>
        <div>
          <CHANGE_ICON>
            <img src={`${process.env.PUBLIC_URL}/img/assets/${past24HChangeIcon}.svg`} alt="" />
          </CHANGE_ICON>
          <span>{past24HChange}</span>
        </div>
      </INFO>
      <PRICE>
        {price ? <span>$ {price}</span> : <Spin size="small" />}
      </PRICE>
    </STATS>
  )
}
