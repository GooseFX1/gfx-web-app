import { FC } from 'react'
import styled from 'styled-components'
import { RightView } from './RightView'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: 100vh;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  height: 100vh;
  width: 100%;
`};

  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.largeShadow}
`

export const RightContainer: FC = () => {
  return (
    <div>
      <WRAPPER>
        <RightView></RightView>
      </WRAPPER>
    </div>
  )
}
