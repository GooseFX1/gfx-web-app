/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox, Drawer, Switch } from 'antd'
import React, {
  ReactElement,
  FC,
  useState,
  useMemo,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'
import styled from 'styled-components'
import tw, { css } from 'twin.macro'
import 'styled-components/macro'
import { Button, TokenToggleNFT } from '../../../components'
import {
  initialFilters,
  useNFTAggregator,
  useNFTAggregatorFilters,
  useNFTCollections,
  usePriceFeedFarm
} from '../../../context'
import { checkMobile, formatSOLDisplay } from '../../../utils'
import { PopupCustom } from '../Popup/PopupCustom'
import { ArrowIcon } from './CollectionV2.styles'
import { AH_PROGRAM_IDS } from '../../../web3'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import useBreakPoint from '../../../hooks/useBreakPoint'
import { CircularArrow } from '../../../components/common/Arrow'
import { SVGDynamicReverseMode } from '../../../styles/utils'
import CollectionSweeper from './CollectionSweeper'
import { useWallet } from '@solana/wallet-adapter-react'

export const ADDITIONAL_FILTERS = styled.div<{ open }>`
  ${({ open }) => css`
    ${tw`duration-500 h-full dark:text-grey-5 text-black-4 overflow-y-scroll`}
    width: ${open ? '15vh' : '0px'} !important;
    min-width: ${open ? '248px' : '0px'} !important;
    border-right: 1px solid ${({ theme }) => theme.borderBottom};
    border: ${!open && 'none'};
    opacity: ${open ? 1 : 0};
    height: calc(100vh);

    .filtersTitle {
      ${tw`font-semibold h-[50px] flex items-center pl-3 duration-1000`}
      opacity: ${open ? 1 : 0};
      visibility: ${open ? 'visible' : 'hidden'};
      font-size: ${open ? '20px' : '10px'};
    }
    .info-icon {
      ${tw`w-[20px] h-[20px] block ml-2`}
    }
    .filtersTitleItem {
      ${tw`text-[18px] font-semibold h-[50px]  duration-1000 flex items-center
      duration-1000 justify-between pl-3 pr-3`}
      border-bottom:  1px solid ${({ theme }) => theme.borderBottom};
      visibility: ${open ? 'visible' : 'hidden'};
      font-size: ${open ? '18px' : '1px'};
    }
    .ant-checkbox {
      ${tw`bg-grey-6 dark:bg-black-2`}
    }
  `}
`
export const STYLED_INPUT = styled.input`
  ${tw`rounded-[5px] h-[35px] w-[95px] sm:w-[165px] m-0 p-[10%] dark:bg-black-1 bg-grey-5  `};
  border: 1px solid ${({ theme }) => theme.tokenBorder};
  background: ${({ theme }) => theme.sweepModalCard};
  @media (max-width: 500px) {
    background: ${({ theme }) => theme.bg25} !important;
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .textMain {
    ${tw`text-tiny font-semibold text-center flex`}
    color: ${({ theme }) => theme.text29};
  }
  .textTwo {
    ${tw`ml-3`}
  }
`
const STYLED_DRAWER = styled.div`
  .ant-modal-body {
    ${tw`p-0`}
  }
  .ant-drawer-content-wrapper {
    box-shadow: none;
    border-radius: 10px 10px 0 0 !important;
    @media (max-width: 500px) {
      border-radius: 10px 10px 0 0 !important;
    }
  }

  .ant-drawer-content {
    ${tw`dark:bg-black-2 bg-grey-5 sm:rounded-[10px] sm:border-solid sm:border-1 sm:dark:border-black-4 
      sm:border-grey-2 `}
    @media (max-width: 500px) {
      border-radius: 10px 10px 0 0 !important;
    }
  }
  .ant-drawer-content &.ant-drawer-content {
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    border-radius: 10px 10px 0 0 !important;
    @media (max-width: 500px) {
      border-radius: 10px 10px 0 0 !important;
    }
  }
`

export const LISTING_TYPE = styled.div<{ isOpen: boolean; isParentOpen?: boolean; showMore?: boolean }>`
  ${({ isOpen, isParentOpen, showMore }) => css`
    .listItemCurreny {
      ${tw`duration-500 items-center text-[15px] sm:text-[18px] justify-between font-semibold flex pl-3 pr-3`}
      height: ${isOpen ? '53px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${isOpen ? 1 : 0};
    }
    .ant-switch {
      ${tw`h-[40px] w-[50px] h-[26px] ml-auto dark:bg-black-4 bg-grey-4`}
    }
    .ant-switch-handle {
      ${tw`left-[0px] top-[0px]`}
      ::before {
        ${tw`h-[26px] w-[26px] rounded-[40px] duration-500`}
      }
    }
    .ant-switch-checked {
      .ant-switch-handle {
        left: calc(100% - 26px);
      }
      background: linear-gradient(101deg, #f7931a 4%, #ac1cc7 98%);
    }
    .attributeTitle {
      ${tw`!duration-500  text-[15px] w-[100%]
        font-semibold flex px-3 pb-0.5 rounded-[7.5px]`};
      height: ${isOpen ? '50px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${isOpen ? 1 : 0};
      border: 2px solid ${({ theme }) => theme.text20};
      padding-top: ${isOpen ? '11px' : 0};
      margin-bottom: ${isOpen ? '10px' : 0};
      visibility: ${isOpen ? 'visible' : 'hidden'};
      padding-bottom: ${isOpen ? '2px' : 0};
    }
    .showMoreText {
      color: ${({ theme }) => theme.text39};
    }
    .marketTitle {
      ${tw`!duration-500 items-center text-[15px] flex font-semibold flex pl-3 pr-3 sm:max-h-20`};
      height: ${isOpen ? '40px' : 0};
      opacity: ${isOpen ? 1 : 0};
      visibility: ${isOpen ? 'visible' : 'hidden'};
    }
    .genericButtonHeight {
      ${tw`!duration-500`};
      height: ${isOpen ? '40px' : 0};
      opacity: ${isOpen ? 1 : 0};
      margin-top: ${isOpen ? '20px' : 0};
      visibility: ${isOpen ? 'visible' : 'hidden'};
      :disabled {
        opacity: 0.7;
      }
    }
    .showMoreAnimation {
      ${tw`!duration-500`};
      height: ${showMore && isOpen ? '40px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${showMore && isOpen ? 1 : 0};
      visibility: ${showMore && isOpen ? 'visible' : 'hidden'};
    }
    .filtersTitle {
      ${tw`font-semibold h-[50px] flex items-center pl-3 duration-1000`}
      opacity: ${isParentOpen ? 1 : 0};
      visibility: ${isParentOpen ? 'visible' : 'hidden'};
      font-size: ${isParentOpen ? '20px' : '10px'};
    }
    .listItem {
      ${tw`duration-500 items-center text-[15px] sm:text-[18px] justify-between font-semibold flex pl-3`}
      height: ${isOpen ? '53px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${isOpen ? 1 : 0};
    }

    .inputContainer {
      ${tw`flex flex-col mr-6`}
      height: ${isOpen ? 'fit-content' : 0};
    }
    .button {
      ${tw`mt-4 flex items-center justify-center cursor-pointer
      text-[#ffffff] h-[35px] w-[95px] rounded-3xl bg-[#5855FF]`}
    }

    .styledInput {
      ${tw`mt-1 text-[15px] font-semibold `}
      color: ${({ theme }) => theme.text28};
    }
  `}
`
const DRAWER_CONTENTS = styled.div`
  color: ${({ theme }) => theme.text32};
  .searchInsideTrait {
    background: none;
  }
  .wrapper {
    ${tw`flex flex-col sm:pt-11`}
  }
  .filtersTitle {
    ${tw`font-semibold h-[50px] text-[22px] sm:mt-3 flex items-center pl-3 sm:pl-4 duration-1000`}
  }
  .filtersTitleItem {
    ${tw` font-semibold h-[50px] duration-1000 flex items-center duration-1000 justify-between pl-3 pr-3`}
    border-bottom:  1px solid ${({ theme }) => theme.borderBottom};
    visibility: ${open ? 'visible' : 'hidden'};
    font-size: ${open ? '18px' : '1px'};
  }
`

const AdditionalFilters: FC<{ open: boolean; setOpen: any; displayIndex: number }> = ({
  open,
  setOpen,
  displayIndex
}): ReactElement => {
  const { availableAttributes } = useNFTCollections()
  const { additionalFilters, setAdditionalFilters } = useNFTAggregatorFilters()
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const clearAllFilters = useCallback(() => {
    setAdditionalFilters(initialFilters)
  }, [])
  const breakpoint = useBreakPoint()
  const elem = document.getElementById('nft-aggerator') // TODO-PROFILE: Stop background scroll

  const showPriceAndMarket = useMemo(() => displayIndex === 0, [displayIndex])

  if (!showPriceAndMarket && !availableAttributes) return null
  if (breakpoint.isMobile)
    return (
      <STYLED_DRAWER id="nft-aggerator" className="dark">
        <Drawer
          title={null}
          className="dark"
          placement={breakpoint.isMobile ? 'bottom' : 'right'}
          closable={false}
          height={'500px'}
          onClose={() => setOpen(false)}
          getContainer={elem}
          open={open}
          width={'100vw'}
          bodyStyle={{ padding: '0' }}
        >
          <DRAWER_CONTENTS>
            <SVGDynamicReverseMode
              onClick={() => setOpen(false)}
              tw="absolute right-3 top-3"
              src={`/img/assets/close-white-icon.svg`}
              alt="close-icn"
            />
            {
              <div tw="absolute mt-[-44px]">
                {breakpoint.isMobile && (
                  <div tw="flex items-center">
                    <div tw="!border-none" className="filtersTitleItem">
                      Filters
                    </div>
                    <ClearAllFiltersButton setOpen={setOpen} />
                  </div>
                )}
              </div>
            }
            <div tw="mt-12">
              <div tw="sm:h-[445px] overflow-y-auto " className="dark">
                {showPriceAndMarket && <MarketPlacesFilter isOpen={open} />}
                {showPriceAndMarket && <PriceRange isOpen={open} />}
                {availableAttributes && <Attributes isOpen={open} displayIndex={displayIndex} />}
                {publicKey && <CollectionSweeper />}
              </div>
            </div>
          </DRAWER_CONTENTS>
        </Drawer>
      </STYLED_DRAWER>
    )
  else
    return (
      <ADDITIONAL_FILTERS open={open}>
        {/* title web */}
        {showPriceAndMarket && <MarketPlacesFilter isOpen={open} />}
        {showPriceAndMarket && <PriceRange isOpen={open} />}
        {availableAttributes && <Attributes isOpen={open} displayIndex={displayIndex} />}
        {publicKey && <CollectionSweeper />}
      </ADDITIONAL_FILTERS>
    )
}

const MarketPlacesFilter: FC<{ isOpen: boolean }> = ({ isOpen }): ReactElement => {
  const breakpoint = useBreakPoint()
  const [isMarketFilterOpen, setIsMarketFilterOpen] = useState<boolean>(!breakpoint.isMobile)
  const { singleCollection } = useNFTCollections()
  const [allMarketsToggle, setAllMarketsToggle] = useState<boolean>(true)
  const [showMore, setShowMore] = useState<boolean>(false)
  const { additionalFilters, setAdditionalFilters } = useNFTAggregatorFilters()
  const marketplaces = useMemo(() => {
    const values = Object.keys(AH_PROGRAM_IDS).map((programId) => AH_PROGRAM_IDS[programId])
    return new Set(values)
  }, [])

  const handleShowMoreClicked = useCallback(() => {
    setShowMore((prev) => !prev)
  }, [])

  const handleAllMarketToggle = useCallback(
    async (check) => {
      setAllMarketsToggle(check)
      if (check && additionalFilters.marketsFilter) {
        const filteredMarketPlaces = Array.from(marketplaces)
        const marketplaceArr = filteredMarketPlaces.map((market) => market.toUpperCase().replaceAll(' ', '_'))
        setAdditionalFilters((prev) => ({ ...prev, marketsFilter: marketplaceArr }))
      }
      if (!check) setAdditionalFilters((prev) => ({ ...prev, marketsFilter: null }))
    },
    [marketplaces, additionalFilters]
  )

  const checkIfMarketChecked = useCallback(
    (market: string) => {
      if (allMarketsToggle) return true
      const marketplaceArr = additionalFilters.marketsFilter ? [...additionalFilters.marketsFilter] : []
      return marketplaceArr.indexOf(market.toUpperCase().replaceAll(' ', '_')) >= 0
    },
    [allMarketsToggle, additionalFilters]
  )

  const handleMarketplaceCheck = useCallback(
    (e: CheckboxChangeEvent, market: string) => {
      const marketplaceName = market.toUpperCase().replaceAll(' ', '_')

      setAdditionalFilters((prev) => {
        let marketplaceArr = prev.marketsFilter ? [...prev.marketsFilter] : []

        if (e.target.checked) {
          marketplaceArr.push(marketplaceName)
          if (marketplaceArr.length === marketplaces.size) setAllMarketsToggle(true)
        } else {
          setAllMarketsToggle(false)
          if (marketplaceArr.length) {
            const index = marketplaceArr.indexOf(marketplaceName)
            if (index >= 0) {
              marketplaceArr.splice(index, 1)
            }
          } else {
            const filteredMarketPlaces = Array.from(marketplaces).filter((place) => place !== market)
            marketplaceArr = filteredMarketPlaces.map((market) => market.toUpperCase().replaceAll(' ', '_'))
          }
        }
        return {
          ...prev,
          marketsFilter: marketplaceArr
        }
      })
    },
    [additionalFilters]
  )

  return (
    <LISTING_TYPE isOpen={isMarketFilterOpen} isParentOpen={isOpen} showMore={showMore}>
      <div className="filtersTitleItem" tw="mt-[-5px]">
        {singleCollection ? (
          <>
            Marketplaces
            <ArrowIcon isOpen={isMarketFilterOpen} setIsOpen={setIsMarketFilterOpen} />
          </>
        ) : (
          <SkeletonCommon width="180px" height="30px" />
        )}
      </div>
      {singleCollection && (
        <div tw="sm:max-h-[200px] sm:overflow-y-auto">
          <div className="marketTitle">
            <img src="/img/assets/Aggregator/AllMarkets.svg" tw="mr-2" />
            All markets
            <div tw="ml-auto">
              <Switch onChange={(e) => handleAllMarketToggle(e)} checked={allMarketsToggle} />
            </div>
          </div>
          {isOpen && (
            <div tw="duration-500">
              {Array.from(marketplaces).map((market, index) => (
                <div key={index} className={index > 2 ? 'marketTitle showMoreAnimation' : 'marketTitle'}>
                  <img tw="h-[30px] w-[30px]" src={`/img/assets/Aggregator/${market}.svg`} />
                  <div tw="ml-2">{market}</div>
                  <div tw="ml-auto" className={index > 2 && 'showMoreAnimation'}>
                    <Checkbox
                      checked={checkIfMarketChecked(market)}
                      onChange={(e) => handleMarketplaceCheck(e, market)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isOpen && (
            <div
              className="marketTitle"
              onClick={handleShowMoreClicked}
              tw="font-bold cursor-pointer ml-[72px] sm:ml-[calc(50% - 45px)] duration-1000"
            >
              <u className="showMoreText" tw="leading-7">
                {' '}
                Show {showMore ? 'less' : 'more'}{' '}
              </u>
            </div>
          )}
        </div>
      )}
    </LISTING_TYPE>
  )
}

const PriceRange: FC<{ isOpen: boolean }> = ({ isOpen }): ReactElement => {
  const [isPriceOpen, setIsPriceOpen] = useState<boolean>(false)
  const { setCurrency, currencyView } = useNFTAggregator()
  const { singleCollection } = useNFTCollections()
  const { solPrice } = usePriceFeedFarm()
  const { setAdditionalFilters } = useNFTAggregatorFilters()
  const [minValue, setMinValue] = useState<number>()
  const [maxValue, setMaxValue] = useState<number>()
  const applyDisabled = useMemo(() => minValue > maxValue || !minValue || !maxValue, [minValue, maxValue])

  const updateAdditionalFilters = useCallback(() => {
    setAdditionalFilters((prev) => ({
      ...prev,
      maxValueFilter: isNaN(maxValue) ? undefined : maxValue,
      minValueFilter: isNaN(minValue) ? undefined : minValue
    }))
  }, [minValue, maxValue])

  useEffect(() => {
    if (currencyView === 'USDC') {
      setMaxValue((prev) => parseFloat(formatSOLDisplay(prev * solPrice)))
      setMinValue((prev) => parseFloat(formatSOLDisplay(prev * solPrice)))
    } else {
      setMaxValue((prev) => parseFloat(formatSOLDisplay(prev / solPrice)))
      setMinValue((prev) => parseFloat(formatSOLDisplay(prev / solPrice)))
    }
  }, [currencyView])

  return (
    <LISTING_TYPE isOpen={isPriceOpen} isParentOpen={isOpen}>
      <div className="filtersTitleItem">
        {singleCollection ? (
          <>
            Price Range
            <ArrowIcon isOpen={isPriceOpen} setIsOpen={setIsPriceOpen} />
          </>
        ) : (
          <SkeletonCommon width="180px" height="30px" />
        )}
      </div>

      <div className="listItemCurreny">
        Currency
        <TokenToggleNFT toggleToken={setCurrency} />
      </div>
      <div className="listItem">
        <div className="inputContainer">
          <div>Min</div>
          <div tw="flex">
            <STYLED_INPUT
              value={minValue}
              className="styledInput"
              type="number"
              placeholder="0.00"
              onChange={(e) => setMinValue(e.target.value ? parseFloat(e.target.value) : undefined)}
            />
            <img tw="h-5 w-5 items-center ml-[-25px] mt-3 z-[1000] " src={`/img/crypto/${currencyView}.svg`} />
          </div>
        </div>
        <div className="inputContainer">
          <div>Max</div>
          <div tw="flex">
            <STYLED_INPUT
              value={maxValue}
              className="styledInput"
              type="number"
              placeholder={`0.00 `}
              onChange={(e) => setMaxValue(e.target.value ? parseFloat(e.target.value) : undefined)}
            />
            <img tw="h-5 w-5 items-center  ml-[-25px] mt-3 z-[1000] " src={`/img/crypto/${currencyView}.svg`} />
          </div>
        </div>
      </div>
      <div tw="flex justify-center w-full">
        <Button
          disabled={applyDisabled}
          className="genericButtonHeight"
          onClick={updateAdditionalFilters}
          disabledColor={tw`dark:bg-black-2 bg-grey-4 !text-grey-1 opacity-70`}
          cssStyle={tw`bg-blue-1 sm:w-[calc(100% - 32px)]
          !text-white h-[35px] w-[217px] cursor-pointer font-semibold text-[15px]`}
        >
          Apply
        </Button>
      </div>
    </LISTING_TYPE>
  )
}

const Attributes: FC<{ isOpen: boolean; displayIndex: number }> = ({ isOpen, displayIndex }): ReactElement => {
  const [isAttributeOpen, setIsAttributeOpen] = useState<boolean>(true)
  const { availableAttributes } = useNFTCollections()
  return (
    <LISTING_TYPE isOpen={isAttributeOpen} isParentOpen={isOpen} css={[isAttributeOpen && tw`overflow-y-auto`]}>
      <div className="filtersTitleItem">
        Attributes
        <ArrowIcon isOpen={isAttributeOpen} setIsOpen={setIsAttributeOpen} />
      </div>
      <div css={[isAttributeOpen && tw`p-3 pb-20`]}>
        {availableAttributes &&
          Object.keys(availableAttributes).map((attributeTrait, index) => (
            <AttributeDetails key={index} trait={attributeTrait} displayIndex={displayIndex} />
          ))}
      </div>
    </LISTING_TYPE>
  )
}

const AttributeDetails: FC<{ trait: string; displayIndex: number }> = ({ trait, displayIndex }): ReactElement => {
  const { availableAttributes } = useNFTCollections()
  const { setAdditionalFilters, additionalFilters } = useNFTAggregatorFilters()
  const [isTraitOpen, setTraitOpen] = useState<boolean>(false)
  const [searchInsideTrait, setSearchInsideTrait] = useState<string>()
  const countAttribute = useMemo(() => (displayIndex === 0 ? 'count' : 'totalCount'), [displayIndex])

  const filteredAvailableTrait: any[] = useMemo(
    () =>
      searchInsideTrait
        ? availableAttributes[trait].filter(
            (subTrait) =>
              subTrait.traitValue !== undefined &&
              subTrait.traitValue.toString().toLocaleLowerCase().includes(searchInsideTrait.toLocaleLowerCase())
          )
        : availableAttributes[trait],
    [availableAttributes, searchInsideTrait]
  )

  const handleAttributeCheckbox = (e: CheckboxChangeEvent, trait: string, subTrait: string | any) => {
    setAdditionalFilters((prev) => {
      const attributes = prev.attributes ? [...prev.attributes] : []

      if (e.target.checked) {
        attributes.push({
          trait_type: trait,
          value: subTrait.traitValue,
          isAnnotation: subTrait.isAnnotation
        })
      } else {
        const updatedAttributes = attributes.filter(
          (attr) => attr.value !== subTrait.traitValue || attr.trait_type !== trait
        )
        return {
          ...prev,
          attributes: updatedAttributes
        }
      }

      return {
        ...prev,
        attributes: attributes
      }
    })
  }

  const formatDisplay = (str: string): string => str[0].toLocaleUpperCase() + str.substring(1).replaceAll('_', ' ')
  return (
    <div className="attributeTitle" css={[isTraitOpen && tw`!h-[180px]`]}>
      <div tw="flex flex-col w-[100%]">
        <div tw="flex justify-between items-center sm:text-[18px]">
          {!isTraitOpen ? (
            <div>{formatDisplay(trait)}</div>
          ) : (
            <input
              className="searchInsideTrait"
              type="text"
              tw="border-none rounded-[10px] outline-none bg-transparent text-[15px] font-semibold w-[85%]"
              placeholder={`Search ${formatDisplay(trait)}`}
              onChange={(e) => setSearchInsideTrait(e.target.value)}
            />
          )}
          <div>
            <ArrowIcon isOpen={isTraitOpen} setIsOpen={setTraitOpen} />
          </div>
        </div>
        <div css={[isTraitOpen && tw`!h-[160px] overflow-y-auto`]}>
          {isTraitOpen &&
            filteredAvailableTrait.map((subTrait) => (
              <div key={subTrait.traitValue} tw="flex justify-between h-[30px]  items-center">
                <div tw="flex text-[15px] text-grey-5">
                  <Checkbox
                    checked={
                      additionalFilters?.attributes?.filter(
                        (attr) => attr.trait_type === trait && attr.value === subTrait.traitValue
                      ).length > 0
                    }
                    onChange={(e) => handleAttributeCheckbox(e, trait, subTrait)}
                  />
                  <div tw="ml-2 text-grey-1 dark:text-grey-5">{minimizeTheString(subTrait.traitValue, 12)}</div>
                </div>
                <div tw="text-grey-1 dark:text-grey-5">({subTrait[countAttribute]}) </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export const ClearAllFiltersButton: FC<{ setOpen?: Dispatch<SetStateAction<boolean>> }> = ({
  setOpen
}): ReactElement => {
  const { additionalFilters, setAdditionalFilters } = useNFTAggregatorFilters()
  const clearAllFilters = useCallback(() => {
    if (setOpen) {
      setOpen(false)
    }
    setAdditionalFilters(initialFilters)
  }, [])
  return (
    <div>
      {' '}
      {((additionalFilters.marketsFilter?.length > 0 &&
        additionalFilters.marketsFilter?.length !== Object.keys(AH_PROGRAM_IDS).length - 1) ||
        additionalFilters.minValueFilter ||
        additionalFilters.attributes?.length > 0) && (
        <Button
          onClick={clearAllFilters}
          height="30px"
          width="94px"
          cssStyle={tw`dark:bg-grey-5 bg-black-4 ml-2 font-semibold dark:text-black-4 
           text-grey-5 `}
        >
          Clear All
        </Button>
      )}
    </div>
  )
}

export default AdditionalFilters
