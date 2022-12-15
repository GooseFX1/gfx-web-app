import { Dropdown } from 'antd'
import React, { FC, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { MarketType, useCrypto, usePriceFeed } from '../../context'
import { DownOutlined } from '@ant-design/icons'
import { Modal, SearchBar } from '../../components'
import tw, { styled } from 'twin.macro'

const SELECTED_PAIR_CTN = styled.div`
  ${tw`ml-[35px] rounded-[36px] w-[180px] cursor-pointer p-px`}
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
`

const SELECTED_PAIR = styled.div`
  ${tw`leading-10 rounded-[36px] text-center flex 
  flex-row justify-between items-center font-medium pl-2.5`}
  background-color: ${({ theme }) => theme.bg9};
  color: ${({ theme }) => theme.text21};
  font-size: 16px;
  .anticon-down {
    ${tw`mr-2.5 w-3.5`}
  }
  .asset-icon {
    ${tw`mr-2.5 w-7 h-7`}
  }
`

const DROPDOWN_PAIR_DIV = styled.div`
  ${tw`h-12.5 flex items-center text-regular font-semibold cursor-pointer`}
  background-color: ${({ theme }) => theme.bg20};

  .asset-icon {
    ${tw`h-7 w-7 mr-4.5 ml-2.5`}
  }
  .spacing {
    ${tw`mr-auto`}
  }
`

const DROPDOWN_MODAL = styled(Modal)`
  ${tw`!h-[528px] !w-[528px] rounded-[22px]`}
  background-color: ${({ theme }) => theme.bg20} !important;

  .ant-modal-content {
    ${tw`h-full overflow-y-hidden overflow-x-hidden`}

    .ant-modal-body {
      ${tw`pb-12`}
    }
  }

  .dropdown-modal-search {
    ${tw`w-[440px] m-0`}
    background-color: ${({ theme }) => theme.bg2} !important;

    > input {
      background-color: ${({ theme }) => theme.bg2} !important;
    }
  }

  .popular {
    ${tw`font-semibold text-regular text-[#eeeeee] my-2.5 mx-0`}
  }

  .popular-container {
    ${tw`flex flex-row items-center justify-around flex-wrap`}
  }
  .allPairContainer {
    ${tw`overflow-y-scroll h-full`}
  }

  .popular-container:after {
    ${tw`flex w-[528px] m-0 p-0 h-[1.5px]`}
    background-color: ${({ theme }) => theme.tokenBorder};
    content: '';
  }

  .popular-tokens {
    ${tw`rounded-[27px] flex flex-row justify-center items-center h-[42px] mb-3 py-0 px-2.5 cursor-pointer`}
    border: 1.5px solid ${({ theme }) => theme.tokenBorder};

    .asset-icon {
      ${tw`h-[30px] w-[30px] mr-2.5`}
    }

    .pair {
      ${tw`font-semibold text-tiny`}
    }
  }

  .no-result-found {
    ${tw`text-center text-regular font-medium mt-[150px]`}
  }
`

const GRADIENT_BORDER = styled.div<{ $hoverBorder: boolean }>`
  ${tw`p-px`}
  background-color: ${({ theme }) => theme.bg20};
  background: ${({ $hoverBorder, theme }) =>
    $hoverBorder === true ? 'linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);' : theme.bg20};
`

const MostPopularCrypto: FC<{ pair: string; type: MarketType }> = ({ pair, type }) => {
  const { getAskSymbolFromPair } = useCrypto()

  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])
  const assetIcon = useMemo(() => `/img/crypto/${type === 'synth' ? `g${symbol}` : symbol}.svg`, [symbol, type])
  return (
    <div className="popular-tokens">
      <img className="asset-icon" src={assetIcon} alt="crypto-icon" />
      <div className="pair">{pair}</div>
    </div>
  )
}

const SelectCryptoModal: FC<{ setShowModal: (arg: boolean) => void }> = ({ setShowModal }) => {
  const { selectedCrypto, setSelectedCrypto, pairs, getAskSymbolFromPair, filteredSearchPairs } = useCrypto()
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
      <div className="popular-container">
        {pairs &&
          pairs.slice(0, 3).map((item, index) => (
            <div onClick={() => handleSelection(item)} key={index}>
              <MostPopularCrypto {...item} />
            </div>
          ))}
      </div>
      <div className="allPairContainer">
        {filteredSearchPairs && filteredSearchPairs.length > 0 ? (
          filteredSearchPairs.map((item, index) => (
            <li onClick={() => handleSelection(item)} key={index}>
              <PairComponents {...item} />
            </li>
          ))
        ) : (
          <div className="no-result-found">Sorry, no result found!</div>
        )}
      </div>
    </>
  )
}

const PairComponents: FC<{ pair: string; type: MarketType }> = ({ pair, type }) => {
  const { tokenInfo } = usePriceFeed()
  const { formatPair, getAskSymbolFromPair } = useCrypto()
  const [hoverBorder, setHoverBorder] = useState<boolean>(false)

  const formattedPair = useMemo(() => formatPair(pair), [formatPair, pair])
  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, type])

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
  const [showModal, setShowModal] = useState<boolean>(false)
  const menus = <></>
  const { selectedCrypto, getAskSymbolFromPair, formatPair, setFilteredSearchPairs, pairs } = useCrypto()
  const formattedPair = useMemo(() => formatPair(selectedCrypto.pair), [formatPair, selectedCrypto.pair])
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(
    () => `/img/crypto/${selectedCrypto.type === 'synth' ? `g${symbol}` : symbol}.svg`,
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
          <SelectCryptoModal setShowModal={setShowModal} />
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
        <SELECTED_PAIR_CTN>
          <SELECTED_PAIR>
            <img className="asset-icon" src={assetIcon} alt="asset-icon" />
            {formattedPair}
            <DownOutlined />
          </SELECTED_PAIR>
        </SELECTED_PAIR_CTN>
      </Dropdown>
    </>
  )
}
