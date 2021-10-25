import React from 'react'
import styled from 'styled-components'
import HeaderButton from './HeaderButton'
import NFTAvatar from './NFTAvatar'
import SearchBar from './SearchBar'

const HeaderWrapper = styled.div`
  height: 117px;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 8px 3px rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.bg3};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const AvatarWrapper = styled.div`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
`

const RestHeaderWrapper = styled.div`
  flex: 2;
  flex-direction: row;
  display: flex;
  align-items: center;
`

const ButtonSection = styled.div`
  display: flex;
  flex-direction: row;
`

const EmptyDiv = styled.div`
  width: 34px;
`

const HeaderNFT = () => {
  return (
    <HeaderWrapper>
      <AvatarWrapper>
        <NFTAvatar src="error" />
      </AvatarWrapper>
      <RestHeaderWrapper>
        <SearchBar />
        <ButtonSection>
          <HeaderButton isDropDown title="Category" />
          <EmptyDiv />
          <HeaderButton title="Create" />
        </ButtonSection>
      </RestHeaderWrapper>
    </HeaderWrapper>
  )
}

export default HeaderNFT
