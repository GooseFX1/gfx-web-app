import React from 'react'
import styled from 'styled-components'
import { Categories } from './Categories'
import NFTAvatar from '../NFTAvatar'
import { ButtonWrapper } from '../NFTButton'
import { SearchBar } from '../SearchBar'
import { SpaceBetweenDiv } from '../../../styles'

const HEADER_WRAPPER = styled(SpaceBetweenDiv)`
  padding: ${({ theme }) => theme.margins['3x']};
  ${({ theme }) => theme.largeBorderRadius}
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0 1px 5px 6px rgb(0 0 0 / 29%);
  z-index: 2;

  > *:not(:nth-child(2)) {
    flex: 2;
  }

  > *:nth-child(2) {
    flex: 3;
  }
`

const AVATAR_WRAPPER = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const BUTTON_SELECTION = styled.div`
  display: flex;
  justify-content: flex-end;

  > button:last-child {
    margin-left: ${({ theme }) => theme.margins['3x']};
  }
`

const CREATE = styled(ButtonWrapper)`
  justify-content: center;
  height: 50px;
  width: 140px;
  background-color: ${({ theme }) => theme.darkButton};

  span {
    color: white;
  }
`

export const Header = () => {
  return (
    <HEADER_WRAPPER>
      <AVATAR_WRAPPER>
        <NFTAvatar src="error" />
      </AVATAR_WRAPPER>
      <SearchBar />
      <BUTTON_SELECTION>
        <Categories />
        <CREATE>
          <span>Create</span>
        </CREATE>
      </BUTTON_SELECTION>
    </HEADER_WRAPPER>
  )
}
