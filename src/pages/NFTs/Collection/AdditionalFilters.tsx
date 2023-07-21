/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox, Switch } from 'antd'
import React, { ReactElement, FC, useState, useMemo, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import tw, { css } from 'twin.macro'
import 'styled-components/macro'
import { Button, Loader, TokenToggle, TokenToggleNFT } from '../../../components'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections, usePriceFeedFarm } from '../../../context'
import { checkMobile, formatSOLDisplay } from '../../../utils'
import { HeaderTooltip } from '../../../utils/GenericDegsin'
import { PopupCustom } from '../Popup/PopupCustom'
import { ArrowIcon } from './CollectionV2.styles'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { number } from 'ts-pattern/dist/patterns'
import debounce from 'lodash.debounce'
import { AH_NAME, AH_PROGRAM_IDS } from '../../../web3'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

export const ADDITIONAL_FILTERS = styled.div<{ open }>`
  ${({ open }) => css`
    ${tw`duration-500 flex h-full flex-col dark:text-grey-5 text-black-4 overflow-y-auto`}
    width: ${open ? '16%' : '0px'} !important;
    min-width: ${open ? '248px' : '0px'} !important;
    border-right: 1px solid ${({ theme }) => theme.borderBottom};
    border-left: 1px solid ${({ theme }) => theme.borderBottom};
    border: ${!open && 'none'};
    opacity: ${open ? 1 : 0};
    height: calc(100vh - 250px);

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
      ${tw`text-[18px] font-semibold h-[50px]  duration-1000 flex items-center duration-1000 justify-between pl-3 pr-3`}
      border-bottom:  1px solid ${({ theme }) => theme.borderBottom};
      visibility: ${open ? 'visible' : 'hidden'};
      font-size: ${open ? '18px' : '1px'};
    }
    .ant-checkbox {
      ${tw`bg-grey-6 dark:bg-black-2`}
    }
  `}
`
const STYLED_INPUT = styled.input`
  ${tw`rounded-[5px] h-[35px] w-[95px] m-0 p-[10%] dark:bg-black-1 bg-grey-5  `};
  border: 1px solid ${({ theme }) => theme.tokenBorder};
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

export const LISTING_TYPE = styled.div<{ isOpen: boolean; isParentOpen?: boolean; showMore?: boolean }>`
  ${({ isOpen, isParentOpen, showMore }) => css`
    .listItemCurreny {
      ${tw`duration-500 items-center text-[15px]  justify-between font-semibold flex pl-3 pr-3`}
      height: ${isOpen ? '53px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${isOpen ? 1 : 0};
    }
    .ant-switch {
      ${tw`h-[40px] sm:h-[35px] w-[50px] h-[26px] sm:w-[65px] sm:w-[75px] ml-auto dark:bg-black-4 bg-grey-4`}
    }
    .ant-switch-handle {
      ${tw`left-[0px] top-[0px] sm:left-[1px] sm:top-[1px]`}
      ::before {
        ${tw`sm:w-[38px] sm:h-[38px] h-[26px] w-[26px] rounded-[40px] duration-500`}
      }
    }
    .ant-switch-checked {
      .ant-switch-handle {
        left: calc(100% - 26px);
        @media (max-width: 500px) {
          left: calc(100% - 35px);
        }
      }
      background: linear-gradient(101deg, #f7931a 4%, #ac1cc7 98%);
    }
    .attributeTitle {
      ${tw`!duration-500  text-[15px] w-[100%]
        font-semibold flex px-3 pt-2 pb-0.5 rounded-[10px] mb-2.5`};
      height: ${isOpen ? '44px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${isOpen ? 1 : 0};
      border: 1px solid;
    }
    .marketTitle {
      ${tw`!duration-500 items-center text-[15px] flex font-semibold flex pl-3 pr-3 sm:max-h-20`};
      height: ${isOpen ? '40px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${isOpen ? 1 : 0};
    }
    .genericButtonHeight {
      ${tw`!duration-500`};
      height: ${isOpen ? '40px' : 0};
      opacity: ${isOpen ? 1 : 0};
      margin-top: ${isOpen ? '20px' : 0};
      visibility: ${isOpen ? 'visible' : 'hidden'};
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
      ${tw`duration-500 items-center text-[15px]  justify-between font-semibold flex pl-3`}
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
const STYLED_POPUP = styled(PopupCustom)`
  color: ${({ theme }) => theme.text30};

  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-8px] left-0 sm:mt-auto sm:absolute sm:h-[600px]`}

    background-color: ${({ theme }) => theme.bg20};
  }
  .ant-modal-body {
    ${tw`p-0`}
  }
  .wrapper {
    ${tw`flex flex-col`}
  }
  .filtersTitle {
    ${tw`font-semibold h-[50px] text-[22px] sm:mt-3 flex items-center pl-3 sm:pl-4 duration-1000`}
  }
  .filtersTitleItem {
    ${tw` font-semibold h-[50px]  duration-1000 flex items-center duration-1000 justify-between pl-3 pr-3`}
    border-bottom:  1px solid ${({ theme }) => theme.borderBottom};
    visibility: ${open ? 'visible' : 'hidden'};
    font-size: ${open ? '18px' : '10px'};
  }
`

const AdditionalFilters: FC<{ open: boolean; setOpen: any; displayIndex: number }> = ({
  open,
  setOpen,
  displayIndex
}): ReactElement => {
  const { availableAttributes } = useNFTCollections()

  const showPriceAndMarket = useMemo(() => displayIndex === 0, [displayIndex])

  if (!showPriceAndMarket && !availableAttributes) return null
  if (checkMobile())
    return (
      <></>
      // <STYLED_POPUP
      //   height={'460px'}
      //   width={'100vw'}
      //   title={null}
      //   visible={open ? true : false}
      //   onCancel={() => setOpen(false)}
      //   footer={null}
      // >
      //   <div className="wrapper">
      //     {/* title */}
      //     {showPriceAndMarket && <MarketPlacesFilter isOpen={open} />}
      //     {showPriceAndMarket && <PriceRange isOpen={open} />}
      //     {availableAttributes && <Attributes isOpen={open} displayIndex={displayIndex} />}
      //   </div>
      // </STYLED_POPUP>
    )
  else
    return (
      <ADDITIONAL_FILTERS open={open}>
        {/* title web */}
        {showPriceAndMarket && <MarketPlacesFilter isOpen={open} />}
        {showPriceAndMarket && <PriceRange isOpen={open} />}
        {availableAttributes && <Attributes isOpen={open} displayIndex={displayIndex} />}
      </ADDITIONAL_FILTERS>
    )
}

const MarketPlacesFilter: FC<{ isOpen: boolean }> = ({ isOpen }): ReactElement => {
  const [isMarketFilterOpen, setIsMarketFilterOpen] = useState<boolean>(true)
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
      <div className="filtersTitleItem">
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
            <div> All markets</div>
            <div tw="ml-auto">
              <Switch onChange={(e) => handleAllMarketToggle(e)} checked={allMarketsToggle} />
            </div>
          </div>
          {isOpen && (
            <div tw="duration-500">
              {Array.from(marketplaces).map((market, index) => (
                <div key={index} className={index > 2 ? 'marketTitle showMoreAnimation' : 'marketTitle'}>
                  <img
                    tw="h-[30px] w-[30px]"
                    src={`/img/assets/Aggregator/${market.toLocaleUpperCase().replaceAll(' ', '_')}.svg`}
                  />
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
              <u tw="dark:text-grey-5 text-blue-1 leading-7"> Show {showMore ? 'less' : 'more'} </u>
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
            <img tw="h-5 w-5 items-center  ml-[-25px] mt-3 z-[1000] " src={`/img/crypto/${currencyView}.svg`} />
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
          cssStyle={tw`bg-blue-1 !text-white h-[35px] w-[217px] cursor-pointer font-semibold text-[15px]`}
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
    <LISTING_TYPE isOpen={isAttributeOpen} isParentOpen={isOpen} tw="sm:max-h-[200px] overflow-y-auto">
      <div className="filtersTitleItem">
        Attribute
        <ArrowIcon isOpen={isAttributeOpen} setIsOpen={setIsAttributeOpen} />
      </div>
      <div tw="p-3">
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

  // const showCheckmarkStatus = useCallback(() => {}, [additionalFilters])

  const formatDisplay = (str: string): string => str[0].toLocaleUpperCase() + str.substring(1).replaceAll('_', ' ')
  return (
    <div className="attributeTitle" css={[isTraitOpen && tw`!h-[180px]`]}>
      <div tw="flex flex-col w-[100%]">
        <div tw="flex justify-between">
          {!isTraitOpen ? (
            <div>{formatDisplay(trait)}</div>
          ) : (
            <input
              className="searchInsideTrait"
              type="text"
              tw="bg-none border-none dark:bg-black-1 bg-grey-5 outline-none text-[15px] font-semibold w-[85%]"
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
              <div key={subTrait.traitValue} tw="flex justify-between h-[30px]   items-center">
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

export default AdditionalFilters
