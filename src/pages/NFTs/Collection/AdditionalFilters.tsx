/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Switch, Tooltip } from 'antd'
import React, { ReactElement, FC, useState, useMemo } from 'react'
import styled from 'styled-components'
import tw, { css } from 'twin.macro'
import { HeaderTooltip } from '../../../utils/GenericDegsin'
import { ArrowIcon } from './CollectionV2.styles'
export const ADDITIONAL_FILTERS = styled.div<{ open }>`
  ${({ open }) => css`
    ${tw`duration-700 flex h-full flex-col`}
    width: ${open ? '16%' : '0px'} !important;
    min-width: ${open ? '248px' : '0px'} !important;
    background: ${({ theme }) => theme.bg23};
    border-right: 1px solid ${({ theme }) => theme.borderBottom};
    border-right: ${!open && 'none'};
    color: ${({ theme }) => theme.text30};
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
      font-size: ${open ? '20px' : '10px'};
    }
  `}
`
const STYLED_INPUT = styled.input`
  ${tw`rounded-[60px] h-[35px] w-[95px] m-0 p-[10%] border-0 border-none outline-none`}
  background-color: ${({ theme }) => theme.avatarBackground};
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

export const LISTING_TYPE = styled.div<{ isOpen }>`
  ${({ isOpen }) => css`
    .listItem {
      ${tw`duration-500 items-center text-[15px] pr-3 justify-between font-semibold flex pl-3`}
      height: ${isOpen ? '53px' : 0};
      color: ${({ theme }) => theme.text20};
      opacity: ${isOpen ? 1 : 0};
    }
    .inputContainer {
      ${tw`flex flex-col`}
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

const AdditionalFilters: FC<{ open: boolean }> = ({ open }: any): ReactElement => {
  console.log()
  return (
    <ADDITIONAL_FILTERS open={open}>
      <>
        <div className="filtersTitle">Filters</div>
        <ListingType />
        <PriceRange />
        <Attributes />
      </>
    </ADDITIONAL_FILTERS>
  )
}

const ListingType = (): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>()

  return (
    <LISTING_TYPE isOpen={isOpen}>
      <div className="filtersTitleItem">
        Listing Type
        <ArrowIcon isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className="listItem">
        GooseFX Listing
        <Switch />
      </div>

      <div className="listItem">
        Hide Pool Listing {HeaderTooltip('Hide listings from pools (Hadeswap, Solvent, etc)')}
        <Switch />
      </div>
    </LISTING_TYPE>
  )
}
const PriceRange = (): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>()
  const [minValue, setMinValue] = useState<number>(0)
  const [maxValue, setMaxValue] = useState<number>(0)
  const [currency, setCurrency] = useState<'SOL' | 'USDC'>('SOL')
  const isSol = useMemo(() => currency === 'SOL', [currency])
  return (
    <LISTING_TYPE isOpen={isOpen}>
      <div className="filtersTitleItem">
        Price Range
        <ArrowIcon isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className="listItem">
        Currency
        <Switch />
      </div>
      <div className="listItem">
        <div className="inputContainer">
          Min
          <STYLED_INPUT
            className="styledInput"
            type="number"
            placeholder={`0.00 `}
            value={minValue}
            onChange={(e) => setMinValue(parseFloat(e.target.value))}
          />
        </div>
        <div className="inputContainer">
          Max
          <STYLED_INPUT
            className="styledInput"
            type="number"
            placeholder={`0.00 `}
            value={maxValue}
            onChange={(e) => setMaxValue(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="listItem">
        <div className="button">Apply</div>
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
