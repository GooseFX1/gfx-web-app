import React, { useCallback, FC, useRef, useEffect } from 'react'
import tw, { styled } from 'twin.macro'

import { SpaceBetweenDiv } from '../styles'
import { useDarkMode } from '../context'
// import debounce from 'lodash.debounce'

const SEARCH_BAR_WRAPPER = styled(SpaceBetweenDiv)<{ bgColor: string; width: number }>`
${tw`relative sm:w-3/4 sm:!h-[45px] !h-11 `}
  width: 50%;
  max-width: ${({ width }) => (width ? width : '583px')} !important;

  margin: 0 0 0 ${({ theme }) => theme.margin(3)};
  background: transparent;

  @media(max-width: 500px){
    margin: 0 0 0 10px;
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
    ${tw`sm:w-full text-[15px] duration-500 h-[44px] rounded-circle p-[0 55px 0 18px]`}
    text-align: left;
    background: ${({ bgColor, theme }) => (bgColor ? bgColor : theme.searchbarBackground)};
    flex: 1;

    ${({ $cssStyle }) => $cssStyle};
    color: ${({ theme }) => theme.text1};
    font-family: 'Montserrat';
    border: transparent;
    &:focus {
      outline: 1.5px solid ${({ theme }) => theme.text11};
    }
    ::placeholder {
      color: ${({ theme }) => theme.text18};
    }
  }


    .ant-image-img {
      ${tw`absolute w-[16px] right-4`}
      filter: ${({ theme }) => theme.filterWhiteIcon};
    }
    .ant-image-clear {
      ${tw`absolute w-[16px] right-10 cursor-pointer`}
      filter: ${({ theme }) => theme.filterWhiteIcon};
    }
  }
`

export const SearchBar: FC<any> = ({
  placeholder,
  setSearchFilter,
  filter,
  bgColor,
  shouldFocus,
  width,
  ...rest
}) => {
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
    <SEARCH_BAR_WRAPPER bgColor={bgColor} width={width} {...rest}>
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
          src={`/img/assets/close-${mode}.svg`}
          onClick={() => handleCloseClick()}
        />
      )}
    </SEARCH_BAR_WRAPPER>
  )
}
