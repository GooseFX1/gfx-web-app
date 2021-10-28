import { Image } from 'antd'
import React from 'react'
import styled from 'styled-components'

const SEARCH_BAR_WRAPPER = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  height: 60px;
  margin: 0 21px;
  padding: 19px 26px;
  border-radius: 45px;
  background-color: ${({ theme }) => theme.searchbarBackground};
  > input {
    height: ${({ theme }) => theme.margins['5x']};
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

const SearchBar = () => {
  return (
    <SEARCH_BAR_WRAPPER>
      <input placeholder="Search by nft or creator" />
      <Image preview={false} src={`${process.env.PUBLIC_URL}/img/assets/search.png`} />
    </SEARCH_BAR_WRAPPER>
  )
}

export default SearchBar
