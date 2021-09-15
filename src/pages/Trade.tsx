import React, { FC } from 'react'
import styled from 'styled-components'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
`

export const Trade: FC = () => {
  return <WRAPPER>Coming Soon</WRAPPER>
}
