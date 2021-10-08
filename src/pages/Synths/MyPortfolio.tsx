import React, { FC } from 'react'
import styled from 'styled-components'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
`

export const Synths: FC = () => {
  return <WRAPPER>Coming Soon - Test</WRAPPER>
}
