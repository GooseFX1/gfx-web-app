import React, { FC } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  font-family: Montserrat !important;
  display: flex;
  background-color: ${({ theme }) => theme.bg9};
  border-radius: 20px 20px 0 0;
`

export const FeesPopup: FC = () => {
  return <Wrapper></Wrapper>
}

export default FeesPopup
