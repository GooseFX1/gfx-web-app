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
`

export const CollateralView: FC = () => {
  return (
    <WRAPPER>
      <div
        style={{
          height: 40,
          backgroundColor: '#121212',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20
        }}
      ></div>
    </WRAPPER>
  )
}
