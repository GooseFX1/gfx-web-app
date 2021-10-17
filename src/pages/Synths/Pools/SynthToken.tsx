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

export const SynthToken: FC<{ synth: string }> = ({ synth }) => {
  return (
    <WRAPPER>
      <CenteredImg>
        <img src={`${process.env.PUBLIC_URL}/img/synth/${synth}.svg`} alt="" />
      </CenteredImg>
      <span>{synth}</span>
    </WRAPPER>
  )
}
