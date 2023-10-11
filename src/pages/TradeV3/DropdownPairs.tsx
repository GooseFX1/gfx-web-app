/* eslint-disable */
import { Dropdown } from 'antd'
import React, { FC, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { MarketType, useCrypto, useDarkMode, usePriceFeed } from '../../context'
import { Modal, SearchBar } from '../../components'
import tw, { styled } from 'twin.macro'
import { checkMobile } from '../../utils'
import 'styled-components/macro'
import useBlacklisted from '../../utils/useBlacklisted'

const SELECTED_PAIR_CTN = styled.div`
  ${tw`h-10 w-[180px] rounded-[36px] cursor-pointer p-0.5`}
  background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
`

const SELECTED_PAIR = styled.div`
  ${tw`h-full w-full rounded-[36px] flex justify-around items-center text-tiny font-semibold`}
  color: ${({ theme }) => theme.text28};
  background: ${({ theme }) => theme.bg20};
  .asset-icon {
    ${tw`w-7 h-7`}
  }
`

const GRADIENT_BACKGROUND = styled.div`
  ${tw`h-full w-full rounded-[36px] dark:text-white text-black-4 
    text-regular font-semibold flex justify-around items-center`}
  background: linear-gradient(94deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
`

const DROPDOWN_PAIR_DIV = styled.div<{ $hoverBorder: boolean }>`
  ${tw`h-12.5 flex rounded-tiny items-center text-regular font-semibold cursor-pointer`}
  background-color: ${({ theme, $hoverBorder }) => ($hoverBorder ? theme.bg2 : theme.bg20)};

  .asset-icon {
    ${tw`h-7 w-7 mr-4.5 ml-2.5`}
  }
  .spacing {
    ${tw`mr-auto text-regular font-semibold`}
    color: ${({ theme }) => theme.text32};
  }
`

const DROPDOWN_MODAL = styled(Modal)`
  ${tw`!h-[425px] !w-[528px] rounded-[22px]`}
  background-color: ${({ theme }) => theme.bg20} !important;

  .ant-modal-content {
    ${tw`h-full overflow-y-hidden overflow-x-hidden`}

    .ant-modal-body {
      ${tw`pb-0 pt-4 sm:px-3`}

      .header-wrapper {
        ${tw`pb-3`}
        border-bottom: ${({ theme }) => '1px solid ' + theme.tokenBorder};
      }
      > div {
        > span {
          ${tw`w-full`}
        }
      }
    }
  }

  .dropdown-modal-search {
    ${tw`w-[440px] m-0 sm:w-full`}
    background-color: ${({ theme }) => theme.bg2} !important;
    border-radius: 50px !important;
    > input {
      background-color: ${({ theme }) => theme.bg2} !important;
      border-radius: 50px !important;
    }
    > input::placeholder {
      ${tw`text-regular font-medium dark:text-grey-1 text-grey-2`}
    }
  }
  .popular {
    ${tw`font-semibold text-regular my-2.5 mr-2`}
    color: ${({ theme }) => theme.text11};
  }

  .popular-container {
    ${tw`flex flex-row items-center justify-start flex-wrap`}
  }
  .allPairContainer {
    ${tw`overflow-y-auto`}
    height: calc(100% - 160px);
  }

  .popular-container:after {
    ${tw`flex w-[528px] m-0 p-0 h-[1.5px] sm:h-0`}
    background-color: ${({ theme }) => theme.tokenBorder};
    content: '';
  }

  .popular-tokens {
    ${tw`rounded-half flex flex-row justify-center items-center h-[42px] mb-3 py-0 px-2.5 cursor-pointer`}
    background: ${({ theme }) => theme.bg2};
    border: 1.5px solid ${({ theme }) => theme.tokenBorder};

    .asset-icon {
      ${tw`h-[30px] w-[30px] mr-2.5`}
    }

    .pair {
      ${tw`font-semibold text-regular`}
      color: ${({ theme }) => theme.text11};
    }
  }

  .no-result-found {
    ${tw`text-center text-regular font-medium mt-[150px] sm:mt-[50px]`}
    color: ${({ theme }) => theme.text1};
  }
`

const GRADIENT_BORDER = styled.div<{ $hoverBorder: boolean }>`
  ${tw`p-px rounded-tiny`}
  background: ${({ $hoverBorder, theme }) =>
    $hoverBorder ? 'linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);' : theme.bg20};
`

const MODAL_TITLE = styled.div`
  ${tw`flex flex-row justify-center items-center`}
  .btn {
    ${tw`flex flex-row justify-center items-center mr-6 text-regular font-semibold text-grey-2 w-[90px] h-9 mb-3.75`}
  }
  .active {
    ${tw`!text-white w-[90px] h-9 text-regular font-semibold rounded-[40px]`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  }
`

const MostPopularCrypto: FC<{ pair: string; type: MarketType; display: string }> = ({ pair, type, display }) => {
  const { getAskSymbolFromPair } = useCrypto()

  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, type])
  return (
    <div className="popular-tokens">
      <img className="asset-icon" src={assetIcon} alt="crypto-icon" />
      <div className="pair">{display}</div>
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

const PairComponents: FC<{ pair: string; type: MarketType; display: string }> = ({ pair, type, display }) => {
  const { tokenInfo } = usePriceFeed()
  const { getAskSymbolFromPair, selectedCrypto } = useCrypto()
  const [hoverBorder, setHoverBorder] = useState<boolean>(false)
  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, type])

  const changeValue = tokenInfo[pair] ? tokenInfo[pair].change : ' '
  let classNameChange = ''
  if (changeValue && changeValue.substring(0, 1) === '-') classNameChange = 'down24h'
  else if (changeValue && changeValue.substring(0, 1) === '+') classNameChange = 'up24h'

  return (
    <GRADIENT_BORDER $hoverBorder={checkMobile() ? selectedCrypto.pair === pair : hoverBorder}>
      <DROPDOWN_PAIR_DIV
        onMouseEnter={() => setHoverBorder(true)}
        onMouseLeave={() => setHoverBorder(false)}
        $hoverBorder={checkMobile() ? selectedCrypto.pair === pair : hoverBorder}
      >
        <img className="asset-icon" src={assetIcon} alt="" />
        <div className="spacing">{display}</div>
        {changeValue !== ' ' ? <div className={classNameChange}>{changeValue}%</div> : <div />}
      </DROPDOWN_PAIR_DIV>
    </GRADIENT_BORDER>
  )
}

const ModalHeader = ({ handleDropdownSearch }) => {
  return (
    <SearchBar
      className="dropdown-modal-search"
      placeholder="Search by name"
      setSearchFilter={handleDropdownSearch}
    />
  )
}

const ModalHeaderMobi = ({ handleDropdownSearch }) => {
  const { isDevnet, setIsDevnet } = useCrypto()
  const isGeoBlocked = useBlacklisted()

  const handleToggle = (e: string) => {
    if (e === 'spot') setIsDevnet(true)
    else setIsDevnet(false)
  }

  return (
    <div className="header-wrapper">
      <MODAL_TITLE>
        <div onClick={() => handleToggle('spot')} className={isDevnet ? 'active btn' : 'btn'}>
          Spot
        </div>
        <div
          onClick={isGeoBlocked ? null : () => handleToggle('perps')}
          className={!isDevnet ? 'active btn' : 'btn'}
        >
          Perps
        </div>
      </MODAL_TITLE>
      <SearchBar
        className="dropdown-modal-search"
        placeholder="Search by name"
        setSearchFilter={handleDropdownSearch}
      />
    </div>
  )
}

export const DropdownPairs: FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { selectedCrypto, getAskSymbolFromPair, formatPair, setFilteredSearchPairs, pairs, isDevnet } = useCrypto()
  //const formattedPair = useMemo(() => formatPair(selectedCrypto.pair), [formatPair, selectedCrypto.pair])
  const displayPair = useMemo(() => {
    return selectedCrypto.display
  }, [selectedCrypto.pair, selectedCrypto.type])
  const { mode } = useDarkMode()
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, selectedCrypto.type])
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
            checkMobile() ? (
              <ModalHeaderMobi handleDropdownSearch={handleDropdownSearch} />
            ) : (
              <ModalHeader handleDropdownSearch={handleDropdownSearch} />
            )
          }
        >
          <SelectCryptoModal setShowModal={setShowModal} />
        </DROPDOWN_MODAL>
      )}
      <Dropdown
        overlay={<></>}
        trigger={['click']}
        onVisibleChange={() => {
          setShowModal(true)
        }}
      >
        <SELECTED_PAIR_CTN>
          <SELECTED_PAIR>
            <GRADIENT_BACKGROUND>
              <img className="asset-icon" src={assetIcon} alt="asset-icon" />
              {displayPair}
              <img
                src={mode === 'lite' ? '/img/assets/arrow-circle-down.svg' : '/img/assets/arrow-circle-down.svg'}
                alt="arrow-icon"
                height="16"
                width="16"
              />
            </GRADIENT_BACKGROUND>
          </SELECTED_PAIR>
        </SELECTED_PAIR_CTN>
      </Dropdown>
    </>
  )
}
