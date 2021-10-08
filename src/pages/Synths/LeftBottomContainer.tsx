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
  margin-top: 5%;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.largeShadow}
`

export const LeftBottomContainer: FC = () => {
  return <WRAPPER>Coming Soon</WRAPPER>
}
