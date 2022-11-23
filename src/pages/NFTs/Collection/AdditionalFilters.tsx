import React, { ReactElement, FC, useState } from 'react'
import styled from 'styled-components'
import tw, { css } from 'twin.macro'
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
      ${tw`text-[20px] font-semibold h-[50px] flex items-center pl-3 duration-1000`}
      opacity: ${open ? 1 : 0};
      visibility: ${open ? 'visible' : 'hidden'};
    }
    .filtersTitleItem {
      ${tw`text-[20px] font-semibold h-[50px]  duration-1000 flex items-center duration-1000 justify-between pl-3 pr-3`}
      border-bottom:  1px solid ${({ theme }) => theme.borderBottom};
      visibility: ${open ? 'visible' : 'hidden'};
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
    <div>
      <div className="filtersTitleItem">
        Listing Type
        <ArrowIcon isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  )
}
const PriceRange = (): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>()
  return (
    <div>
      <div className="filtersTitleItem">
        Price Range
        <ArrowIcon isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
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
