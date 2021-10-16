import { FC } from 'react'
import styled from 'styled-components'
import { BottomView } from './BottomView'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: auto;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: auto;
width: 100%;
`};
  margin-top: 7%;
  ${({ theme }) => theme.largeBorderRadius};
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.largeShadow}
`

export const BottomContainer: FC = () => {
  return (
    <WRAPPER>
      <BottomView></BottomView>
    </WRAPPER>
  )
}
