import { Dropdown, Menu } from 'antd'
import React, { FC, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { MarketType, useCrypto, usePriceFeed } from '../../context'
import styled from 'styled-components'
import { FEATURED_PAIRS_LIST } from '../../context'
import { DownOutlined } from '@ant-design/icons'

const SELECTED_PAIR = styled.div`
  line-height: 40px;
  margin-left: 35px;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.bg9};
  width: 180px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
  align-items: center;
  padding-left: 10px;
  color: ${({ theme }) => theme.text21};
  .anticon-down {
    margin-right: 10px;
    width: 14px;
  }
  .asset-icon {
    width: 28px;
    height: 28px;
  }
`

const DROPDOWN_PAIR_DIV = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-left: -5px;
  margin-right: -5px;
  .asset-icon {
    width: 28px;
    height: 28px;
  }
`

const PairComponents: FC<{ pair: string; type: MarketType }> = ({ pair, type }) => {
  const { tokenInfo } = usePriceFeed()
  const { formatPair, getAskSymbolFromPair } = useCrypto()

  const formattedPair = useMemo(() => formatPair(pair), [formatPair, pair])
  //const price = useMemo(() => prices[pair], [prices, pair])
  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])
  const assetIcon = useMemo(() => `/img/${type}/${type === 'synth' ? `g${symbol}` : symbol}.svg`, [symbol, type])

  let changeValue = tokenInfo[pair] ? tokenInfo[pair].change : ' ',
    classNameChange = ''
  if (changeValue.substring(0, 1) === '-') classNameChange = 'down24h'
  else if (changeValue.substring(0, 1) === '+') classNameChange = 'up24h'

  return (
    <DROPDOWN_PAIR_DIV>
      <img className="asset-icon" src={assetIcon} alt="" />
      <div>{formattedPair}</div>
      {changeValue !== ' ' ? <div className={classNameChange}>{changeValue}%</div> : <div />}
    </DROPDOWN_PAIR_DIV>
  )
}

export const DropdownPairs: FC = () => {
  const { selectedCrypto, setSelectedCrypto } = useCrypto()
  const history = useHistory()

  const handleSelection = (item) => {
    if (item.type === 'synth') {
      history.push('/synths')
    } else if (selectedCrypto.pair !== symbol) {
      setSelectedCrypto(item)
    }
  }

  const menus = (
    <Menu>
      {FEATURED_PAIRS_LIST.map((item, index) => {
        return (
          <Menu.Item onClick={() => handleSelection(item)} key={index}>
            <PairComponents {...item} />
          </Menu.Item>
        )
      })}
    </Menu>
  )
  const { getAskSymbolFromPair, formatPair } = useCrypto()
  const formattedPair = useMemo(() => formatPair(selectedCrypto.pair), [formatPair, selectedCrypto.pair])
  const symbol = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])
  const assetIcon = useMemo(
    () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${symbol}` : symbol}.svg`,
    [symbol, selectedCrypto.type]
  )
  return (
    <Dropdown overlay={menus} trigger={['click']} placement="bottom">
      <SELECTED_PAIR>
        <img className="asset-icon" src={assetIcon} alt="" />
        {formattedPair}
        <DownOutlined />
      </SELECTED_PAIR>
    </Dropdown>
  )
}
