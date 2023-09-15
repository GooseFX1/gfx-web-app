import React, { useCallback, FC, useRef, useEffect } from 'react'
import tw, { TwStyle, styled } from 'twin.macro'

import 'styled-components/macro'
import { SpaceBetweenDiv } from '../styles'
import { useDarkMode } from '../context'

const SEARCH_BAR_WRAPPER = styled(SpaceBetweenDiv)<{ bgColor: string; width: number; $cssStyle: TwStyle }>`
${tw`relative sm:w-3/4`}
  width: ${({ width }) => (width ? width : '50%')} !important;
  max-width: ${({ width }) => (width ? width : '583px')} !important;
  margin: 0 0 0 ${({ theme }) => theme.margin(3)};
  background: transparent;
  @media(max-width: 500px){
    margin: 0 0 0 0;
  }
  
  .ant-image {
    ${tw`sm:relative sm:left-2.5`}
    filter: ${({ theme }) => theme.filterWhiteIcon};

    @media(max-width: 500px){
      position: relative;
      left: 10px;
    }
  }

  > input {
    text-align: left;
    background: ${({ bgColor, theme }) => (bgColor ? bgColor : theme.searchbarBackground)};
    flex: 1;
    color: ${({ theme }) => theme.text32};
    font-family: 'Montserrat';
    border: transparent;

    ${tw`sm:w-full text-[15px] duration-500
      font-semibold  rounded-circle p-[0 40px 0 35px]`}
    ${({ $cssStyle }) => $cssStyle};

    &:focus {
      outline: 1.5px solid ${({ theme }) => theme.text11};
      @media(max-width: 500px){
        outline: none;
    }
    }
    ::placeholder {
      font-weight: 500;
      color: ${({ theme }) => theme.text18};
    }
  }

    .ant-image-img {
      ${tw`absolute w-[16px] left-3 top-2`}
      filter: ${({ theme }) => theme.filterWhiteIcon};
    }
    .ant-image-clear {
      ${tw`absolute h-6 w-6 right-2 top-[5px] cursor-pointer`}
      filter: ${({ theme }) => theme.filterWhiteIcon};
    }
  }
`

export const SearchBar: FC<{
  placeholder?: string
  setSearchFilter?: any
  filter?: any
  bgColor?: string
  shouldFocus?: boolean
  width?: string
  className?: string
  cssStyle?: TwStyle
}> = ({ placeholder, setSearchFilter, filter, bgColor, shouldFocus, width, cssStyle, ...rest }) => {
  const { mode } = useDarkMode()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputValue = useCallback((e) => {
    debouncer(e)
  }, [])

  const debouncer = (e) => setSearchFilter(e.target.value)

  const handleCloseClick = useCallback(() => {
    setSearchFilter('')
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (shouldFocus) inputRef.current?.focus()
  }, [inputRef?.current])

  return (
    <SEARCH_BAR_WRAPPER bgColor={bgColor} width={width} $cssStyle={cssStyle} {...rest}>
      <input
        placeholder={placeholder || 'Search by nft name'}
        ref={inputRef}
        value={filter}
        onChange={handleInputValue}
      />
      <img className="ant-image-img" src={`/img/assets/search_${mode}.svg`} />
      {filter && (
        <img
          className="ant-image-clear"
          src={`/img/assets/Aggregator/removeSearch${mode}.svg`}
          onClick={() => handleCloseClick()}
        />
      )}
    </SEARCH_BAR_WRAPPER>
  )
}
