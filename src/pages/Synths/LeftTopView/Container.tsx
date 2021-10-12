import { FC } from 'react'
import styled from 'styled-components'
import { TopView } from './TopView'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: 45%;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: 45%;
width: 100%;
`};
  ${({ theme }) => theme.largeBorderRadius};
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.largeShadow}
`

export const TopContainer: FC = () => {
  return (
    <WRAPPER>
      <TopView></TopView>
    </WRAPPER>
  )
}
