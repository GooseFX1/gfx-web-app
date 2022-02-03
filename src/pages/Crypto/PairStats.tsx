import React, { FC, useMemo } from 'react'
import { Skeleton } from 'antd'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { MarketType, useCrypto } from '../../context'
import { CenteredImg } from '../../styles'
import { removeFloatingPointError } from '../../utils'

const ASSET_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(2))}
`

/* const CHANGE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(1))}
` */

const INFO = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    ${({ theme }) => theme.flexCenter}

    span {
      margin-left: ${({ theme }) => theme.margin(1)};
      font-size: 10px;
      font-weight: bold;
      color: ${({ theme }) => theme.text1};
    }
  }
`

const PRICE = styled.div`
  display: flex;
  height: ${({ theme }) => theme.margin(3)};
  padding-top: ${({ theme }) => theme.margin(1)};

  > span {
    font-size: 12px;
    color: ${({ theme }) => theme.text1};
  }
`

const STATS = styled.div`
  min-width: 160px;
  padding: ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(2)};
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.bg3};
  cursor: pointer;
`

const Loader: FC = () => {
  return <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />
}

export const PairStats: FC<{ decimals: number; pair: string; type: MarketType }> = ({ decimals, pair, type }) => {
  const { formatPair, getAskSymbolFromPair, prices, selectedCrypto, setSelectedCrypto } = useCrypto()
  const history = useHistory()

  const formattedPair = useMemo(() => formatPair(pair), [formatPair, pair])
  const price = useMemo(() => prices[pair], [prices, pair])
  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])
  // const change24HIcon = useMemo(() => `price_${price.change24H >= 0 ? 'up' : 'down'}.svg`, [price])

  const handleClick = () => {
    if (type === 'synth') {
      history.push('/synths')
    } else if (selectedCrypto.pair !== symbol) {
      setSelectedCrypto({ decimals, pair, type })
    }
  }

  const assetIcon = useMemo(() => `/img/${type}/${type === 'synth' ? `g${symbol}` : symbol}.svg`, [symbol, type])

  return (
    <STATS onClick={handleClick}>
      <INFO>
        <div>
          <ASSET_ICON>
            <img src={assetIcon} alt="" />
          </ASSET_ICON>
          <span>{formattedPair}</span>
        </div>
        {/* !price.change24H ? (
          <Loader />
        ) : (
          <div>
            <CHANGE_ICON>
              <img src={`/img/assets/${change24HIcon}`} alt="" />
            </CHANGE_ICON>
            <span>{price.change24H}</span>
          </div>
        ) TODO RESTORE */}
      </INFO>
      <PRICE>{!price || !price.current ? <Loader /> : <span>$ {removeFloatingPointError(price.current)}</span>}</PRICE>
    </STATS>
  )
}
