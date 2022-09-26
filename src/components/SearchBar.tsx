import React from 'react'
import styled from 'styled-components'
import { SpaceBetweenDiv } from '../styles'
import tw from 'twin.macro'

const SEARCH_BAR_WRAPPER = styled(SpaceBetweenDiv)`
${tw`sm:w-3/4 sm:!h-[45px]`}
  width: 50%;
  max-width: 583px;
  height: 44px !important;
  padding-bottom: 20px;
  margin: 0 ${({ theme }) => theme.margin(3)};
  padding: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(3)};
  border-radius: 45px;
  background: ${({ theme }) => theme.searchbarBackground} !important;

  .ant-image {
    ${tw`sm:relative sm:left-2.5`}
    filter: ${({ theme }) => theme.filterWhiteIcon};

    @media(max-width: 500px){
      position: relative;
      left: 10px;
    }
  }

  > input {
    ${tw`sm:w-full`}
    height: ${({ theme }) => theme.margin(5)};
    font-size: 16px;
    text-align: left;
    background: ${({ theme }) => theme.searchbarBackground} !important;
    flex: 1;
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

export const SearchBar = ({ placeholder, setSearchFilter, filter, ...rest }: any) => (
  <SEARCH_BAR_WRAPPER {...rest}>
    <input
      placeholder={placeholder || 'Search by nft name'}
      value={filter}
      onChange={(e) => setSearchFilter(e.target.value)}
    />
    <img style={{ height: '20px', width: '20px' }} src={`/img/assets/search.svg`} />
  </SEARCH_BAR_WRAPPER>
)
