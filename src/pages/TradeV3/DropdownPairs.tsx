import { Dropdown } from 'antd'
import React, { FC, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { MarketType, useCrypto, usePriceFeed } from '../../context'
import styled from 'styled-components'
import { DownOutlined } from '@ant-design/icons'
import { Modal, SearchBar } from '../../components'

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
  height: 49px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  background: #1c1c1c;
  .asset-icon {
    width: 28px;
    height: 28px;
    margin-right: 18px;
    margin-left: 10px;
  }
  .spacing {
    margin-right: auto;
  }
`

const DROPDOWN_MODAL = styled(Modal)`
  width: 528px !important;
  height: 528px !important;
  background-color: ${({ theme }) => theme.bg20} !important;
  border-radius: 22px;

  .ant-modal-content {
    height: 100%;
    overflow: scroll;
  }

  .dropdown-modal-search {
    background: red;
    width: 440px;
    margin: 0;
    background-color: ${({ theme }) => theme.bg2} !important;

    > input {
      background-color: ${({ theme }) => theme.bg2} !important;
    }
  }

  .popular {
    font-weight: 600;
    font-size: 18px;
    color: #eeeeee;
    margin: 10px 0;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .row:after {
    height: 1.5px;
    display: flex;
    width: 528px;
    background-color: ${({ theme }) => theme.tokenBorder};
    content: '';
    padding: 0;
    margin: 0;
  }

  .popular-tokens {
    border: 1.5px solid ${({ theme }) => theme.tokenBorder};
    border-radius: 27px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 42px;
    padding: 0 10px;
    margin-bottom: 12px;
    cursor: pointer;

    .asset-icon {
      height: 30px;
      width: 30px;
      margin-right: 10px;
    }

    .pair {
      font-weight: 600;
      font-size: 15px;
    }
  }

  .no-result-found {
    text-align: center;
    margin-top: 150px;
    font-size: 18px;
    font-weight: 500;
  }
`

const GRADIENT_BORDER = styled.div<{ $hoverBorder: boolean }>`
  background: #1c1c1c;
  padding: 1px;
  background: ${({ $hoverBorder }) =>
    $hoverBorder === true ? 'linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);' : '#1c1c1c;'};
`

const MostPopularCrypto: FC<{ pair: string; type: MarketType }> = ({ pair, type }) => {
  const { getAskSymbolFromPair } = useCrypto()

  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])
  const assetIcon = useMemo(() => `/img/${type}/${type === 'synth' ? `g${symbol}` : symbol}.svg`, [symbol, type])
  return (
    <div className="popular-tokens">
      <img className="asset-icon" src={assetIcon} alt="crypto-icon" />
      <div className="pair">{pair}</div>
    </div>
  )
}

const SelectCryptoModal: FC = () => {
  const { selectedCrypto, setSelectedCrypto, pairs, setShowModal, getAskSymbolFromPair, filteredSearchPairs } =
    useCrypto()
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const history = useHistory()

  const handleSelection = (item) => {
    if (item.type === 'synth') {
      setShowModal(false)
      history.push('/synths')
    } else if (selectedCrypto.pair !== symbol) {
      setSelectedCrypto(item)
      setShowModal(false)
    }
  }
  return (
    <>
      <div className="popular">Most popular</div>
      <div className="row">
        {pairs &&
          pairs.slice(0, 3).map((item, index) => (
            <div onClick={() => handleSelection(item)} key={index}>
              <MostPopularCrypto {...item} />
            </div>
          ))}
      </div>
      {filteredSearchPairs && filteredSearchPairs.length > 0 ? (
        filteredSearchPairs.map((item, index) => (
          <li onClick={() => handleSelection(item)} key={index}>
            <PairComponents {...item} />
          </li>
        ))
      ) : (
        <div className="no-result-found">Sorry, no result found!</div>
      )}
    </>
  )
}

const PairComponents: FC<{ pair: string; type: MarketType }> = ({ pair, type }) => {
  const { tokenInfo } = usePriceFeed()
  const { formatPair, getAskSymbolFromPair } = useCrypto()
  const [hoverBorder, setHoverBorder] = useState<boolean>(false)

  const formattedPair = useMemo(() => formatPair(pair), [formatPair, pair])
  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])
  const assetIcon = useMemo(() => `/img/${type}/${type === 'synth' ? `g${symbol}` : symbol}.svg`, [symbol, type])

  const changeValue = tokenInfo[pair] ? tokenInfo[pair].change : ' '
  let classNameChange = ''
  if (changeValue && changeValue.substring(0, 1) === '-') classNameChange = 'down24h'
  else if (changeValue && changeValue.substring(0, 1) === '+') classNameChange = 'up24h'

  return (
    <GRADIENT_BORDER $hoverBorder={hoverBorder}>
      <DROPDOWN_PAIR_DIV onMouseEnter={() => setHoverBorder(true)} onMouseLeave={() => setHoverBorder(false)}>
        <img className="asset-icon" src={assetIcon} alt="" />
        <div className="spacing">{formattedPair}</div>
        {changeValue !== ' ' ? <div className={classNameChange}>{changeValue}%</div> : <div />}
      </DROPDOWN_PAIR_DIV>
    </GRADIENT_BORDER>
  )
}

export const DropdownPairs: FC = () => {
  const menus = <></>
  const {
    selectedCrypto,
    getAskSymbolFromPair,
    formatPair,
    showModal,
    setShowModal,
    setFilteredSearchPairs,
    pairs
  } = useCrypto()
  const formattedPair = useMemo(() => formatPair(selectedCrypto.pair), [formatPair, selectedCrypto.pair])
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(
    () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${symbol}` : symbol}.svg`,
    [symbol, selectedCrypto.type]
  )
  const handleDropdownSearch = (searchString: string) => {
    const filteredResult = pairs.filter((item) =>
      getAskSymbolFromPair(item.pair).includes(searchString.toUpperCase())
    )
    setFilteredSearchPairs(filteredResult)
  }
  const closeModal = () => {
    setShowModal(false)
    setFilteredSearchPairs(pairs)
  }

  return (
    <>
      {showModal && (
        <DROPDOWN_MODAL
          setVisible={closeModal}
          bigTitle={false}
          visible={true}
          title={
            <SearchBar
              className="dropdown-modal-search"
              placeholder="Search by name"
              setSearchFilter={handleDropdownSearch}
            />
          }
        >
          <SelectCryptoModal />
        </DROPDOWN_MODAL>
      )}
      <Dropdown
        overlay={menus}
        trigger={['click']}
        placement="bottom"
        align={{ offset: [0, 10] }}
        overlayClassName="antd-radius-trade-v2"
        onVisibleChange={() => {
          setShowModal(true)
        }}
      >
        <SELECTED_PAIR>
          <img className="asset-icon" src={assetIcon} alt="asset-icon" />
          {formattedPair}
          <DownOutlined />
        </SELECTED_PAIR>
      </Dropdown>
    </>
  )
}
