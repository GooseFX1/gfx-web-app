import React, { useCallback, FC } from 'react'
import tw, { styled } from 'twin.macro'

import { SpaceBetweenDiv } from '../styles'
import { useDarkMode } from '../context'
import debounce from 'lodash.debounce'

const SEARCH_BAR_WRAPPER = styled(SpaceBetweenDiv)<{ bgColor: string; width: number }>`
${tw`sm:w-3/4 sm:!h-[45px] rounded-[45px] pb-5 !h-11 rounded-[45px]`}
  width: 50%;
  max-width: ${({ width }) => (width ? width : '583px')} !important;

  margin: 0 0 0 ${({ theme }) => theme.margin(3)};
  padding: ${({ theme }) => theme.margin(1)} 19px;
  background: ${({ theme }) => theme.searchbarBackground};
  background: ${({ bgColor }) => bgColor} !important;
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
    ${tw`sm:w-full text-[15px] duration-500  h-[40px]`}
    text-align: left;
    background: ${({ theme }) => theme.searchbarBackground};
    background: ${({ bgColor }) => bgColor} !important;
    flex: 1;
    ${({ $cssStyle }) => $cssStyle};
    color: ${({ theme }) => theme.text1};
    font-family: 'Montserrat';
    border: none;
    outline: none;
    ::placeholder {
      color: ${({ theme }) => theme.text18};
    }
  }


    .ant-image-img {
      filter: ${({ theme }) => theme.filterWhiteIcon};
      width: 16px;
    }
  }
`

export const SearchBar: FC<any> = ({ placeholder, setSearchFilter, filter, bgColor, width, ...rest }) => {
  const { mode } = useDarkMode()

  const handleInputValue = useCallback((e) => debouncer(e), [])

  const debouncer = debounce((e) => {
    setSearchFilter(e.target.value)
  }, 500)
  return (
    <SEARCH_BAR_WRAPPER bgColor={bgColor} width={width} {...rest}>
      <input placeholder={placeholder || 'Search by nft name'} value={filter} onChange={handleInputValue} />
      <img style={{ height: '20px', width: '20px' }} src={`/img/assets/search_${mode}.svg`} />
    </SEARCH_BAR_WRAPPER>
  )
}
