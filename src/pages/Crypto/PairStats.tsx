import React, { FC, useMemo } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { MarketType, useCrypto, usePriceFeed } from '../../context'
import { CenteredImg } from '../../styles'
import { removeFloatingPointError } from '../../utils'

const ASSET_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(2))}
`

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
  background-color: ${({ theme }) => theme.bg9};
  box-shadow: ${({ theme }) => theme.boxShadow};
  cursor: pointer;
`

const Loader: FC = () => <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />

export const PairStats: FC<{ pair: string; type: MarketType; marketAddress: string }> = ({
  pair,
  type,
  marketAddress
}) => {
  const { prices } = usePriceFeed()
  const { formatPair, getAskSymbolFromPair, selectedCrypto, setSelectedCrypto } = useCrypto()

  const formattedPair = useMemo(() => formatPair(pair), [formatPair, pair])
  const price = useMemo(() => prices[pair], [prices, pair])
  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])

  const handleClick = () => {
    if (selectedCrypto.pair !== symbol) {
      setSelectedCrypto({ pair, marketAddress })
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
      </INFO>
      <PRICE>
        {!price || !price.current ? <Loader /> : <span>$ {removeFloatingPointError(price.current)}</span>}
      </PRICE>
    </STATS>
  )
}
