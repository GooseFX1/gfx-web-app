import { FC } from 'react'
import styled from 'styled-components'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: 50%;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: 55%;
width: 100%;
`};
  margin-top: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.largeBorderRadius};
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.largeShadow}
`

export const BottomContainer: FC = () => {
  return <WRAPPER>Coming Soon</WRAPPER>
}
