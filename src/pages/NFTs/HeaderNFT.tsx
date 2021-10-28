import React from 'react'
import styled from 'styled-components'
import DropdowButton from '../../layouts/App/DropDownButton'
import { colors } from '../../theme'
import HeaderButton from './HeaderButton'
import NFTAvatar from './NFTAvatar'
import SearchBar from './SearchBar'

const HEADER_WRAPPER = styled.div`
  height: 117px;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 8px 3px rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.bg3};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const AVATAR_WRAPPER = styled.div`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
`

const REST_HEADER_WRAPPER = styled.div`
  flex: 2;
  flex-direction: row;
  display: flex;
  align-items: center;
`

const BUTTON_SELECTION = styled.div`
  display: flex;
  flex-direction: row;
`

const EMPTY_DIV = styled.div`
  width: 34px;
`

const categoryButton = {
  width: 132,
  height: 50,
  backgroundColor: colors('lite').secondary2,
  justifyContent: 'space-between'
}

const HeaderNFT = () => {
  return (
    <HEADER_WRAPPER>
      <AVATAR_WRAPPER>
        <NFTAvatar src="error" />
      </AVATAR_WRAPPER>
      <REST_HEADER_WRAPPER>
        <SearchBar />
        <BUTTON_SELECTION>
          <DropdowButton style={categoryButton} title="Category" />
          <EMPTY_DIV />
          <HeaderButton title="Create" />
        </BUTTON_SELECTION>
      </REST_HEADER_WRAPPER>
    </HEADER_WRAPPER>
  )
}

export default HeaderNFT
