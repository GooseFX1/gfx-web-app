import React, { FC } from 'react'
import styled from 'styled-components'
import { CenteredDiv, CenteredImg } from '../../../styles'

const WRAPPER = styled(CenteredDiv)`
  > div {
    ${({ theme }) => theme.measurements(theme.margins['3x'])}
    margin-right: ${({ theme }) => theme.margins['1x']};
  }

  > span {
    font-weight: bold;
  }
`

export const SynthToken: FC<{ token: string }> = ({ token }) => {
  return (
    <WRAPPER>
      <CenteredImg>
        <img src={`${process.env.PUBLIC_URL}/img/synths/${token}.svg`} alt="" />
      </CenteredImg>
      <span>{token}</span>
    </WRAPPER>
  )
}
