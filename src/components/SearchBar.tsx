import { Image } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { SpaceBetweenDiv } from '../styles'

const SEARCH_BAR_WRAPPER = styled(SpaceBetweenDiv)`
  width: 100%;
  margin: 0 ${({ theme }) => theme.margin(3)};
  padding: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(3)};
  border-radius: 45px;
  background-color: ${({ theme }) => theme.searchbarBackground};

  > input {
    height: ${({ theme }) => theme.margin(5)};
    font-size: 16px;
    text-align: left;
    background-color: ${({ theme }) => theme.searchbarBackground};
    flex: 1;
    color: white;
    font-family: 'Montserrat';
    border: none;
    outline: none;
    ::placeholder {
      color: white;
    }
  }
`

export const SearchBar = ({ placeholder, setFilter, filter, ...rest }: any) => {
  return (
    <SEARCH_BAR_WRAPPER {...rest}>
      <input
        placeholder={placeholder || 'Search by nft or creator'}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Image preview={false} src={`/img/assets/search.png`} />
    </SEARCH_BAR_WRAPPER>
  )
}
