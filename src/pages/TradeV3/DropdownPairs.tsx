/* eslint-disable */
import { Dropdown } from 'antd'
import React, { FC, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { MarketType, useCrypto, useDarkMode, usePriceFeed } from '../../context'
import { Modal, SearchBar } from '../../components'
import tw, { styled } from 'twin.macro'
import { checkMobile } from '../../utils'
import 'styled-components/macro'
import { Search } from 'lucide-react'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseDefault,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  Input,
  InputElementLeft,
  InputElementRight,
  InputGroup,
  cn
} from 'gfx-component-lib'
import { GradientBorder, InfoLabel } from './perps/components/PerpsGenericComp'

const SELECTED_PAIR_CTN = styled.div`
  ${tw`h-10 w-[180px] rounded-[36px] cursor-pointer p-0.5 mt-1`}
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
    text-regular font-bold flex justify-around items-center bg-grey-5 dark:bg-black-1`}
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
    ${tw`m-0`}

    background-color: ${({ theme }) => theme.bg2} !important;
    border-radius: 50px !important;
    > input {
      background-color: ${({ theme }) => theme.bg2} !important;
      border-radius: 50px !important;
      height: 36px;
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

const SelectCryptoModal: FC<{
  handleDropdownSearch: (string) => void
  showModal: boolean
  setShowModal: (arg: boolean) => void
}> = ({ showModal, setShowModal, handleDropdownSearch }) => {
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
  const args = {
    // rightItem: (<InputElementRight>GOFX</InputElementRight>),
    leftItem: (
      <InputElementLeft>
        <Search />
      </InputElementLeft>
    )
  }
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogOverlay className={'z-[961]'} />
      <DialogClose onClick={() => setShowModal(false)} />

      <DialogContent
        className={cn('z-[962] min-md:w-[500px] h-[322px] pt-3 flex flex-col gap-0')}
        placement={'default'}
      >
        <DialogCloseDefault onClick={() => setShowModal(false)} />

        <DialogHeader
          className={`space-y-0 flex flex-col w-full h-[58px] justify-between px-2.5 pb-1.25 border-b-1 border-solid
        border-border-lightmode-secondary dark:border-border-darkmode-secondary`}
        >
          <InputGroup {...args} className={'w-11/12'}>
            <Input
              className={'text-left w-full'}
              // TODO Fix the trading view bug
              // onChange={(e) => handleDropdownSearch(e.target.value)}
              placeholder="Search by Token symbol"
            />
          </InputGroup>
        </DialogHeader>
        <DialogBody
          className={`flex flex-col w-full h-[210px] min-md:h-full 
            min-md:mb-[20px] min-md:rounded-b-[10px] bg-white dark:bg-black-2 flex-auto overflow-y-scroll gap-2.5
            min-md:gap-5 p-2.5
      `}
        >
          {filteredSearchPairs && filteredSearchPairs.length > 0 ? (
            filteredSearchPairs.map((item, index) => (
              <span onClick={() => handleSelection(item)} key={index}>
                <PairComponents {...item} />
              </span>
            ))
          ) : (
            <div className="no-result-found">Sorry, no result found!</div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
  // return (
  //   <>
  //     <div className="popular">Most popular</div>
  //     <div className="popular-container">
  //       {pairs &&
  //         pairs.slice(0, 3).map((item, index) => (
  //           <div onClick={() => handleSelection(item)} key={index}>
  //             <MostPopularCrypto {...item} />
  //           </div>
  //         ))}
  //     </div>
  //     <div className="allPairContainer">
  //       {filteredSearchPairs && filteredSearchPairs.length > 0 ? (
  //         filteredSearchPairs.map((item, index) => (
  //           <li onClick={() => handleSelection(item)} key={index}>
  //             <PairComponents {...item} />
  //           </li>
  //         ))
  //       ) : (
  //         <div className="no-result-found">Sorry, no result found!</div>
  //       )}
  //     </div>
  //   </>
  // )
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
    <GradientBorder radius={50}>
      <div className="flex items-center h-full p-2">
        <img className="h-8 w-8" src={assetIcon} alt="" />
        <InfoLabel>
          {' '}
          <h4 className="ml-2">{display}</h4>{' '}
        </InfoLabel>
      </div>
    </GradientBorder>
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
  // const { isDevnet, setIsDevnet } = useCrypto()
  // const {isGeoBlocked} = useConnectionConfig()

  // const handleToggle = (e: string) => {
  //   if (e === 'spot') setIsDevnet(true)
  //   else setIsDevnet(false)
  // }

  return (
    <div className="header-wrapper">
      {/* <MODAL_TITLE>
        <div onClick={() => handleToggle('spot')} className={isDevnet ? 'active btn' : 'btn'}>
          Spot
        </div>
        <div
          onClick={isGeoBlocked ? null : () => handleToggle('perps')}
          className={!isDevnet ? 'active btn' : 'btn'}
        >
          Perps
        </div>
      </MODAL_TITLE> */}
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
      <SelectCryptoModal
        handleDropdownSearch={handleDropdownSearch}
        showModal={showModal}
        setShowModal={closeModal}
      />

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
                src={mode === 'lite' ? '/img/assets/circularArrowlite.svg' : '/img/assets/circularArrowdark.svg'}
                style={showModal ? { transform: 'rotate(180deg)' } : {}}
                alt="arrow-icon"
                height="10"
                width="20"
              />
            </GRADIENT_BACKGROUND>
          </SELECTED_PAIR>
        </SELECTED_PAIR_CTN>
      </Dropdown>
    </>
  )
}
