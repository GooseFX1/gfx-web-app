/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox, Switch } from 'antd'
import React, { ReactElement, FC, useState, useMemo, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import tw, { css } from 'twin.macro'
import 'styled-components/macro'
import { TokenToggleNFT } from '../../../components'
import { useNFTAggregator, useNFTAggregatorFilters } from '../../../context'
import { checkMobile } from '../../../utils'
import { HeaderTooltip } from '../../../utils/GenericDegsin'
import { PopupCustom } from '../Popup/PopupCustom'
import { ArrowIcon } from './CollectionV2.styles'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { number } from 'ts-pattern/dist/patterns'
import debounce from 'lodash.debounce'
import { AH_PROGRAM_IDS } from '../../../web3'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

export const ADDITIONAL_FILTERS = styled.div<{ open }>`
  ${({ open }) => css`
    ${tw`duration-500 flex h-full flex-col dark:text-grey-5 text-black-4`}
    width: ${open ? '16%' : '0px'} !important;
    min-width: ${open ? '248px' : '0px'} !important;
    border-right: 1px solid ${({ theme }) => theme.borderBottom};
    border-left: 1px solid ${({ theme }) => theme.borderBottom};
    border: ${!open && 'none'};
    opacity: ${open ? 1 : 0};
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
      ${tw`text-[20px] font-semibold h-[50px]  duration-1000 flex items-center duration-1000 justify-between pl-3 pr-3`}
      border-bottom:  1px solid ${({ theme }) => theme.borderBottom};
      visibility: ${open ? 'visible' : 'hidden'};
      font-size: ${open ? '20px' : '1px'};
    }
  `}
`
const STYLED_INPUT = styled.input`
  ${tw`rounded-[5px] h-[35px] w-[95px] m-0 p-[10%] dark:bg-black-1 bg-grey-5  border-none`};
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
    .marketTitle {
      ${tw`!duration-500 items-center text-[15px] flex justify-between font-semibold flex pl-3 pr-3`};
      height: ${isOpen ? '30px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${isOpen ? 1 : 0};
    }
    .showMoreAnimation {
      ${tw`!duration-500 `};
      height: ${showMore ? '30px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${showMore ? 1 : 0};
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
      .ant-switch {
        ${tw`h-[40px] sm:h-[35px] w-[37px] h-[18px] sm:w-[65px] sm:w-[75px] ml-auto mr-3`}
      }
      .ant-switch-handle {
        ${tw`w-[40px] h-[40px] left-[0px] top-[0px] sm:left-[1px] sm:top-[1px]`}
        ::before {
          ${tw`sm:w-[38px] sm:h-[38px] h-[18px] w-[18px] rounded-[40px] duration-500`}
        }
      }
      .ant-switch-checked {
        .ant-switch-handle {
          left: calc(100% - 18px);
          @media (max-width: 500px) {
            left: calc(100% - 35px);
          }
        }
        background: linear-gradient(101deg, #f7931a 4%, #ac1cc7 98%);
      }
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
      color: ${({ theme }) => theme.text29};
    }
  `}
`
const STYLED_POPUP = styled(PopupCustom)`
  color: ${({ theme }) => theme.text30};

  &.ant-modal {
    ${tw`max-w-full bottom-[-10px] mt-auto absolute`}
    background-color: ${({ theme }) => theme.bg26};
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
    ${tw`text-[20px] font-semibold h-[50px]  duration-1000 flex items-center duration-1000 justify-between pl-3 pr-3`}
    border-bottom:  1px solid ${({ theme }) => theme.borderBottom};
    visibility: ${open ? 'visible' : 'hidden'};
    font-size: ${open ? '20px' : '10px'};
  }
`

const AdditionalFilters: FC<{ open: boolean; setOpen: any }> = ({ open, setOpen }): ReactElement => {
  if (checkMobile())
    return (
      <STYLED_POPUP
        height={'480px'}
        width={'100vw'}
        title={null}
        visible={open ? true : false}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <div className="wrapper">
          {/* title */}
          <div className="filtersTitle">Filters</div>

          <PriceRange isOpen={open} />
          <Attributes />
        </div>
      </STYLED_POPUP>
    )
  else
    return (
      <ADDITIONAL_FILTERS open={open}>
        {/* title web */}
        <div className="filtersTitle">Filters</div>
        <MarketPlacesFilter isOpen={open} />
        <PriceRange isOpen={open} />
        <Attributes />
      </ADDITIONAL_FILTERS>
    )
}

const MarketPlacesFilter: FC<{ isOpen: boolean }> = ({ isOpen }): ReactElement => {
  const [isMarketFilterOpen, setIsMarketFilterOpen] = useState<boolean>(true)
  const [allMarketsToggle, setAllMarketsToggle] = useState<boolean>(true)
  const [showMore, setShowMore] = useState<boolean>(false)
  const { additionalFilters, setAdditionalFilters } = useNFTAggregatorFilters()

  useEffect(() => {
    const marketPlaces = []
    if (allMarketsToggle) {
      Object.keys(AH_PROGRAM_IDS).map((programId) => AH_PROGRAM_IDS[programId])
    }
  }, [allMarketsToggle])
  const handleShowMoreClicked = useCallback(() => {
    setShowMore((prev) => !prev)
  }, [])

  const handleAllMarketToggle = useCallback(() => {
    setAllMarketsToggle((prev) => !prev)
    if (additionalFilters.marketsFilter !== null)
      setAdditionalFilters((prev) => ({ ...prev, marketsFilter: null }))
  }, [])

  const checkIfMarketChecked = useCallback(
    (market: string) => {
      if (allMarketsToggle) return true
      const marketplaceArr = additionalFilters.marketsFilter ? [...additionalFilters.marketsFilter] : []
      return marketplaceArr.indexOf(AH_PROGRAM_IDS[market].toUpperCase().replaceAll(' ', '_')) >= 0
    },
    [allMarketsToggle, additionalFilters]
  )

  const handleMarketplaceCheck = useCallback(
    (e: CheckboxChangeEvent, market: string) => {
      const marketplace = AH_PROGRAM_IDS[market].toUpperCase().replaceAll(' ', '_')

      setAdditionalFilters((prev) => {
        const marketplaceArr = prev.marketsFilter ? [...prev.marketsFilter] : []

        if (e.target.checked) {
          marketplaceArr.push(marketplace)
        } else {
          const index = marketplaceArr.indexOf(marketplace)
          if (index >= 0) {
            marketplaceArr.splice(index, 1)
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
        Marketplaces
        <ArrowIcon isOpen={isMarketFilterOpen} setIsOpen={setIsMarketFilterOpen} />
      </div>
      <div className="marketTitle" tw="flex mt-1">
        <div>All markets</div>
        <div>
          <Switch onChange={handleAllMarketToggle} checked={allMarketsToggle} />
        </div>
      </div>
      <div tw="duration-500">
        {Object.keys(AH_PROGRAM_IDS).map((market, index) => (
          <div key={index} className={index > 2 ? 'marketTitle showMoreAnimation' : 'marketTitle'}>
            <div>{AH_PROGRAM_IDS[market]}</div>
            <div>
              <Checkbox
                checked={checkIfMarketChecked(market)}
                onChange={(e) => handleMarketplaceCheck(e, market)}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="marketTitle"
        onClick={handleShowMoreClicked}
        tw="font-bold cursor-pointer ml-[70px] duration-1000 "
      >
        <u tw="text-grey-5"> Show {showMore ? 'less' : 'more'} </u>
      </div>
    </LISTING_TYPE>
  )
}

// const ListingType = (): ReactElement => {
//   const [isOpen, setIsOpen] = useState<boolean>()

//   return (
//     <LISTING_TYPE isOpen={isOpen}>
//       <div className="filtersTitleItem">
//         Listing Type
//         <ArrowIcon isOpen={isOpen} setIsOpen={setIsOpen} />
//       </div>
//       <div className="listItem">
//         GooseFX Listing
//         <Switch />
//       </div>

//       <div className="listItem">
//         Hide Pool Listing {HeaderTooltip('Hide listings from pools (Hadeswap, Solvent, etc)')}
//         <Switch />
//       </div>
//     </LISTING_TYPE>
//   )
// }
const PriceRange: FC<{ isOpen: boolean }> = ({ isOpen }): ReactElement => {
  const [isPriceOpen, setIsPriceOpen] = useState<boolean>(true)
  const { setCurrency } = useNFTAggregator()
  const { setAdditionalFilters } = useNFTAggregatorFilters()

  const updateAdditionalFilters = useCallback(
    debounce((func: (value: number) => void, value: number) => func(value), 500),
    []
  )
  const updateMaxValue = useCallback((maxValue: number) => {
    setAdditionalFilters((prev) => ({
      ...prev,
      minValueFilter: prev.minValueFilter ?? 0,
      maxValueFilter: isNaN(maxValue) ? 9999 : maxValue
    }))
  }, [])

  const updateMinValue = useCallback((minValue: number) => {
    setAdditionalFilters((prev) => ({
      ...prev,
      minValueFilter: isNaN(minValue) ? 0.0001 : minValue
    }))
  }, [])

  return (
    <LISTING_TYPE isOpen={isPriceOpen} isParentOpen={isOpen}>
      <div className="filtersTitleItem">
        Price Range
        <ArrowIcon isOpen={isPriceOpen} setIsOpen={setIsPriceOpen} />
      </div>
      <div className="listItemCurreny">
        Currency
        <TokenToggleNFT toggleToken={setCurrency} />
      </div>
      <div className="listItem">
        <div className="inputContainer">
          Min
          <STYLED_INPUT
            className="styledInput"
            type="number"
            placeholder={`0.00`}
            onChange={(e) => updateAdditionalFilters(updateMinValue, parseFloat(e.target.value))}
          />
        </div>
        <div className="inputContainer">
          Max
          <STYLED_INPUT
            className="styledInput"
            type="number"
            placeholder={`0.00 `}
            onChange={(e) => updateAdditionalFilters(updateMaxValue, parseFloat(e.target.value))}
          />
        </div>
      </div>
    </LISTING_TYPE>
  )
}

const Attributes = (): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>()
  return (
    <div className="filtersTitleItem">
      Attribute
      <ArrowIcon isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

export default AdditionalFilters
